/**
 * In-memory mock replacement for Prisma Client.
 * Provides a thin API surface that the engines use, backed by simple arrays.
 * Data resets on server restart — intentional for the DB-free demo.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// In-memory stores
// ---------------------------------------------------------------------------

const store: Record<string, any[]> = {
  users: [],
  journeys: [],
  journeySteps: [],
  checklists: [],
  checklistItems: [],
  notifications: [],
  auditLogs: [],
  featureFlags: [],
  integrationLogs: [],
};

let idCounter = 1;
function nextId(): string {
  return `mock-${Date.now()}-${idCounter++}`;
}

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

function findMany(collection: string, where: any = {}, options: any = {}): any[] {
  let items = [...store[collection]];

  for (const [key, value] of Object.entries(where)) {
    if (value && typeof value === 'object' && ('lt' in (value as any) || 'gte' in (value as any))) {
      const cond = value as any;
      items = items.filter((item) => {
        const d = new Date(item[key]).getTime();
        if (cond.lt && d >= new Date(cond.lt).getTime()) return false;
        if (cond.gte && d < new Date(cond.gte).getTime()) return false;
        return true;
      });
    } else if (value === null) {
      items = items.filter((item) => item[key] === null || item[key] === undefined);
    } else {
      items = items.filter((item) => item[key] === value);
    }
  }

  if (options.orderBy) {
    const entries = Array.isArray(options.orderBy) ? options.orderBy : [options.orderBy];
    for (const ob of entries.reverse()) {
      const [key, dir] = Object.entries(ob)[0] as [string, string];
      items.sort((a, b) => {
        if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }

  if (options.skip) items = items.slice(options.skip);
  if (options.take) items = items.slice(0, options.take);

  return items;
}

function findUnique(collection: string, where: any): any | null {
  const key = Object.keys(where)[0];
  return store[collection].find((item) => item[key] === where[key]) ?? null;
}

function create(collection: string, data: any): any {
  const now = new Date();
  const record = { id: nextId(), ...data, createdAt: now, updatedAt: now };
  store[collection].push(record);
  return record;
}

function update(collection: string, where: any, data: any): any {
  const key = Object.keys(where)[0];
  const idx = store[collection].findIndex((item) => item[key] === where[key]);
  if (idx === -1) return null;
  store[collection][idx] = { ...store[collection][idx], ...data, updatedAt: new Date() };
  return store[collection][idx];
}

function updateMany(collection: string, where: any, data: any): number {
  let count = 0;
  for (let i = 0; i < store[collection].length; i++) {
    let match = true;
    for (const [k, v] of Object.entries(where)) {
      if (store[collection][i][k] !== v) { match = false; break; }
    }
    if (match) {
      store[collection][i] = { ...store[collection][i], ...data, updatedAt: new Date() };
      count++;
    }
  }
  return count;
}

function count(collection: string, where: any = {}): number {
  return findMany(collection, where).length;
}

// ---------------------------------------------------------------------------
// Model proxies (mimic prisma.modelName.method(...))
// ---------------------------------------------------------------------------

function createModelProxy(collection: string) {
  return {
    findMany: (args: any = {}) => {
      const items = findMany(collection, args.where, args);
      if (args.include) {
        return items.map((item: any) => attachIncludes(item, args.include));
      }
      return items;
    },
    findUnique: (args: any) => {
      const item = findUnique(collection, args.where);
      if (item && args.include) return attachIncludes(item, args.include);
      if (item && args.select) {
        const selected: any = {};
        for (const k of Object.keys(args.select)) selected[k] = item[k];
        return selected;
      }
      return item;
    },
    findFirst: (args: any = {}) => {
      const items = findMany(collection, args.where, args);
      return items[0] ?? null;
    },
    create: (args: any) => {
      const { data } = args;
      // Handle nested creates
      const nestedKeys: string[] = [];
      const flatData: any = {};
      for (const [k, v] of Object.entries(data)) {
        if (v && typeof v === 'object' && 'create' in (v as any)) {
          nestedKeys.push(k);
        } else {
          flatData[k] = v;
        }
      }
      const record = create(collection, flatData);
      for (const nk of nestedKeys) {
        const nestedCollection = resolveNestedCollection(nk);
        const creates = Array.isArray((data[nk] as any).create) ? (data[nk] as any).create : [(data[nk] as any).create];
        const parentKey = resolveParentKey(collection);
        for (const c of creates) {
          create(nestedCollection, { ...c, [parentKey]: record.id });
        }
      }
      if (args.include) return attachIncludes(record, args.include);
      return record;
    },
    update: (args: any) => {
      const record = update(collection, args.where, args.data);
      if (record && args.include) return attachIncludes(record, args.include);
      return record;
    },
    updateMany: (args: any) => {
      return { count: updateMany(collection, args.where, args.data) };
    },
    count: (args: any = {}) => count(collection, args.where),
    delete: (args: any) => {
      const key = Object.keys(args.where)[0];
      const idx = store[collection].findIndex((item) => item[key] === args.where[key]);
      if (idx === -1) return null;
      return store[collection].splice(idx, 1)[0];
    },
  };
}

function resolveNestedCollection(key: string): string {
  const map: Record<string, string> = {
    steps: 'journeySteps',
    items: 'checklistItems',
  };
  return map[key] ?? key;
}

function resolveParentKey(parentCollection: string): string {
  const map: Record<string, string> = {
    journeys: 'journeyId',
    checklists: 'checklistId',
  };
  return map[parentCollection] ?? 'parentId';
}

function attachIncludes(item: any, include: any): any {
  const result = { ...item };
  for (const [key, val] of Object.entries(include)) {
    const nestedCollection = resolveNestedCollection(key);
    const parentKey = resolveParentKey(
      Object.keys(store).find((c) => store[c].includes(item)) ?? '',
    );
    if (val === true) {
      result[key] = store[nestedCollection]?.filter((r: any) => r[parentKey] === item.id) ?? [];
    } else if (typeof val === 'object' && val !== null) {
      let items = store[nestedCollection]?.filter((r: any) => r[parentKey] === item.id || r.journeyId === item.id || r.checklistId === item.id) ?? [];
      if ((val as any).orderBy) {
        const entries = Array.isArray((val as any).orderBy) ? (val as any).orderBy : [(val as any).orderBy];
        for (const ob of entries.reverse()) {
          const [k, dir] = Object.entries(ob)[0] as [string, string];
          items.sort((a: any, b: any) => {
            if (a[k] < b[k]) return dir === 'asc' ? -1 : 1;
            if (a[k] > b[k]) return dir === 'asc' ? 1 : -1;
            return 0;
          });
        }
      }
      if ((val as any).include) {
        items = items.map((i: any) => attachIncludes(i, (val as any).include));
      }
      result[key] = items;
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Public mock client
// ---------------------------------------------------------------------------

export const prisma = {
  user: createModelProxy('users'),
  journey: createModelProxy('journeys'),
  journeyStep: createModelProxy('journeySteps'),
  checklist: createModelProxy('checklists'),
  checklistItem: createModelProxy('checklistItems'),
  notification: createModelProxy('notifications'),
  auditLog: createModelProxy('auditLogs'),
  featureFlag: createModelProxy('featureFlags'),
  integrationLog: createModelProxy('integrationLogs'),
};
