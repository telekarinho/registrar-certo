import { isEnabled } from '@/server/lib/feature-flags';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TrademarkResult {
  processo: string;
  marca: string;
  titular: string;
  situacao: string;
  classesNice: string[];
}

export interface TrademarkSearchResponse {
  results: TrademarkResult[];
  total: number;
  page: number;
  limit: number;
  source: 'microservice' | 'cache' | 'fallback';
}

export interface TrademarkDetailResponse {
  processo: string;
  marca: string;
  titular: string;
  situacao: string;
  classesNice: string[];
  deposito: string | null;
  concessao: string | null;
  vigencia: string | null;
  source: 'microservice' | 'cache' | 'fallback';
}

export interface NiceClass {
  code: string;
  title: string;
  description: string;
  examples: string[];
}

export interface NiceClassListResponse {
  classes: NiceClass[];
  source: 'microservice' | 'cache' | 'fallback';
}

// ---------------------------------------------------------------------------
// Provider Interface
// ---------------------------------------------------------------------------

export interface IINPISearchProvider {
  searchByName(query: string, page: number, limit: number): Promise<TrademarkSearchResponse>;
  searchByProcess(processo: string): Promise<TrademarkDetailResponse>;
  getNiceClasses(): Promise<NiceClassListResponse>;
  getNiceClassDetail(code: string): Promise<NiceClass | null>;
}

// ---------------------------------------------------------------------------
// Circuit Breaker
// ---------------------------------------------------------------------------

interface CircuitBreakerState {
  failures: number;
  lastFailure: number;
  isOpen: boolean;
}

class CircuitBreaker {
  private state: CircuitBreakerState = {
    failures: 0,
    lastFailure: 0,
    isOpen: false,
  };

  constructor(
    private readonly threshold: number = 5,
    private readonly resetTimeMs: number = 60_000,
  ) {}

  canRequest(): boolean {
    if (!this.state.isOpen) return true;
    if (Date.now() - this.state.lastFailure > this.resetTimeMs) {
      this.state.isOpen = false;
      this.state.failures = 0;
      return true;
    }
    return false;
  }

  recordSuccess(): void {
    this.state.failures = 0;
    this.state.isOpen = false;
  }

  recordFailure(): void {
    this.state.failures += 1;
    this.state.lastFailure = Date.now();
    if (this.state.failures >= this.threshold) {
      this.state.isOpen = true;
    }
  }

  isCircuitOpen(): boolean {
    return this.state.isOpen;
  }
}

// ---------------------------------------------------------------------------
// In-memory cache (replaces Redis)
// ---------------------------------------------------------------------------

const cache = new Map<string, { value: string; expiresAt: number }>();

function cacheGet<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { cache.delete(key); return null; }
  return JSON.parse(entry.value) as T;
}

function cacheSet(key: string, value: unknown, ttlSeconds: number): void {
  cache.set(key, { value: JSON.stringify(value), expiresAt: Date.now() + ttlSeconds * 1000 });
}

// ---------------------------------------------------------------------------
// Unofficial INPI Provider (calls the microservice)
// ---------------------------------------------------------------------------

export class UnofficialINPIProvider implements IINPISearchProvider {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly circuitBreaker: CircuitBreaker;

  private readonly SEARCH_CACHE_TTL = 3600;
  private readonly NICE_CACHE_TTL = 86400;

  constructor() {
    this.baseUrl = process.env.INPI_MICROSERVICE_URL ?? 'http://localhost:4000';
    this.apiKey = process.env.INPI_MICROSERVICE_API_KEY ?? '';
    this.circuitBreaker = new CircuitBreaker(5, 60_000);
  }

  async searchByName(query: string, page: number = 1, limit: number = 20): Promise<TrademarkSearchResponse> {
    const cacheKey = `inpi:search:${query}:${page}:${limit}`;
    const cached = cacheGet<TrademarkSearchResponse>(cacheKey);
    if (cached) return { ...cached, source: 'cache' };

    if (!this.circuitBreaker.canRequest()) {
      throw new INPISearchError('SERVICE_UNAVAILABLE', 'Servico de busca INPI temporariamente indisponivel.');
    }

    try {
      const url = `${this.baseUrl}/api/marcas?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
      const response = await this.fetchWithTimeout(url, 10_000);

      if (!response.ok) throw new Error(`INPI microservice responded with ${response.status}`);

      const data: TrademarkSearchResponse = await response.json();
      data.source = 'microservice';

      cacheSet(cacheKey, data, this.SEARCH_CACHE_TTL);
      this.circuitBreaker.recordSuccess();
      return data;
    } catch {
      this.circuitBreaker.recordFailure();
      throw new INPISearchError('SEARCH_FAILED', 'Falha na busca de marcas. Tente novamente mais tarde.');
    }
  }

  async searchByProcess(processo: string): Promise<TrademarkDetailResponse> {
    const cacheKey = `inpi:process:${processo}`;
    const cached = cacheGet<TrademarkDetailResponse>(cacheKey);
    if (cached) return { ...cached, source: 'cache' };

    if (!this.circuitBreaker.canRequest()) {
      throw new INPISearchError('SERVICE_UNAVAILABLE', 'Servico de busca INPI temporariamente indisponivel.');
    }

    try {
      const url = `${this.baseUrl}/api/marcas/${encodeURIComponent(processo)}`;
      const response = await this.fetchWithTimeout(url, 10_000);

      if (!response.ok) {
        if (response.status === 404) {
          throw new INPISearchError('NOT_FOUND', `Processo ${processo} nao encontrado.`);
        }
        throw new Error(`INPI microservice responded with ${response.status}`);
      }

      const data: TrademarkDetailResponse = await response.json();
      data.source = 'microservice';

      cacheSet(cacheKey, data, this.SEARCH_CACHE_TTL);
      this.circuitBreaker.recordSuccess();
      return data;
    } catch (error) {
      if (error instanceof INPISearchError) throw error;
      this.circuitBreaker.recordFailure();
      throw new INPISearchError('SEARCH_FAILED', 'Falha na consulta do processo. Tente novamente mais tarde.');
    }
  }

  async getNiceClasses(): Promise<NiceClassListResponse> {
    const cacheKey = 'inpi:nice:all';
    const cached = cacheGet<NiceClassListResponse>(cacheKey);
    if (cached) return { ...cached, source: 'cache' };

    if (!this.circuitBreaker.canRequest()) {
      throw new INPISearchError('SERVICE_UNAVAILABLE', 'Servico temporariamente indisponivel.');
    }

    try {
      const url = `${this.baseUrl}/api/nices`;
      const response = await this.fetchWithTimeout(url, 10_000);
      if (!response.ok) throw new Error(`INPI microservice responded with ${response.status}`);

      const data: NiceClassListResponse = await response.json();
      data.source = 'microservice';
      cacheSet(cacheKey, data, this.NICE_CACHE_TTL);
      this.circuitBreaker.recordSuccess();
      return data;
    } catch (error) {
      if (error instanceof INPISearchError) throw error;
      this.circuitBreaker.recordFailure();
      throw new INPISearchError('SEARCH_FAILED', 'Falha ao carregar classes Nice.');
    }
  }

  async getNiceClassDetail(code: string): Promise<NiceClass | null> {
    const cacheKey = `inpi:nice:${code}`;
    const cached = cacheGet<NiceClass>(cacheKey);
    if (cached) return cached;

    if (!this.circuitBreaker.canRequest()) {
      throw new INPISearchError('SERVICE_UNAVAILABLE', 'Servico temporariamente indisponivel.');
    }

    try {
      const url = `${this.baseUrl}/api/nices/${encodeURIComponent(code)}`;
      const response = await this.fetchWithTimeout(url, 10_000);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`INPI microservice responded with ${response.status}`);
      }

      const data: NiceClass = await response.json();
      cacheSet(cacheKey, data, this.NICE_CACHE_TTL);
      this.circuitBreaker.recordSuccess();
      return data;
    } catch (error) {
      if (error instanceof INPISearchError) throw error;
      this.circuitBreaker.recordFailure();
      throw new INPISearchError('SEARCH_FAILED', 'Falha ao carregar detalhes da classe Nice.');
    }
  }

  private async fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(url, {
        headers: {
          'X-API-Key': this.apiKey,
          Accept: 'application/json',
        },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
  }
}

// ---------------------------------------------------------------------------
// Fallback Provider (returns empty results + official link)
// ---------------------------------------------------------------------------

export class FallbackINPIProvider implements IINPISearchProvider {
  private readonly OFFICIAL_URL = 'https://busca.inpi.gov.br/pePI/';

  async searchByName(_query: string, page: number = 1, limit: number = 20): Promise<TrademarkSearchResponse> {
    return { results: [], total: 0, page, limit, source: 'fallback' };
  }

  async searchByProcess(_processo: string): Promise<TrademarkDetailResponse> {
    throw new INPISearchError(
      'FALLBACK_MODE',
      `Busca INPI indisponivel. Consulte diretamente: ${this.OFFICIAL_URL}`,
    );
  }

  async getNiceClasses(): Promise<NiceClassListResponse> {
    return { classes: [], source: 'fallback' };
  }

  async getNiceClassDetail(_code: string): Promise<NiceClass | null> {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Factory function
// ---------------------------------------------------------------------------

export async function createINPISearchProvider(userId?: string): Promise<IINPISearchProvider> {
  const enabled = await isEnabled('inpi_search_enabled', userId);
  if (enabled) return new UnofficialINPIProvider();
  return new FallbackINPIProvider();
}

// ---------------------------------------------------------------------------
// Custom error class
// ---------------------------------------------------------------------------

export class INPISearchError extends Error {
  public code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'INPISearchError';
  }
}
