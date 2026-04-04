/**
 * Simple console-based logger (replaces pino for DB-free demo).
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export const logger = {
  info: (obj: any, msg?: string) => console.log(`[INFO] ${msg ?? ''}`, obj),
  warn: (obj: any, msg?: string) => console.warn(`[WARN] ${msg ?? ''}`, obj),
  error: (obj: any, msg?: string) => console.error(`[ERROR] ${msg ?? ''}`, obj),
  debug: (obj: any, msg?: string) => console.debug(`[DEBUG] ${msg ?? ''}`, obj),
  child: (context: Record<string, unknown>) => {
    return {
      info: (obj: any, msg?: string) => console.log(`[INFO]`, context, msg ?? '', obj),
      warn: (obj: any, msg?: string) => console.warn(`[WARN]`, context, msg ?? '', obj),
      error: (obj: any, msg?: string) => console.error(`[ERROR]`, context, msg ?? '', obj),
      debug: (obj: any, msg?: string) => console.debug(`[DEBUG]`, context, msg ?? '', obj),
    };
  },
};

export function createChildLogger(context: Record<string, unknown>) {
  return logger.child(context);
}
