export function timestamp(): string {
  return new Date().toISOString();
}

export function info(message: string, meta?: unknown): void {
  if (meta !== undefined) {
    // eslint-disable-next-line no-console
    console.log(`[INFO] ${timestamp()} - ${message}`, meta);
  } else {
    // eslint-disable-next-line no-console
    console.log(`[INFO] ${timestamp()} - ${message}`);
  }
}

export function warn(message: string, meta?: unknown): void {
  if (meta !== undefined) {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${timestamp()} - ${message}`, meta);
  } else {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${timestamp()} - ${message}`);
  }
}

export function error(message: string, meta?: unknown): void {
  if (meta !== undefined) {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${timestamp()} - ${message}`, meta);
  } else {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${timestamp()} - ${message}`);
  }
}

export function step(message: string, meta?: unknown): void {
  if (meta !== undefined) {
    // eslint-disable-next-line no-console
    console.log(`[STEP] ${timestamp()} - ${message}`, meta);
  } else {
    // eslint-disable-next-line no-console
    console.log(`[STEP] ${timestamp()} - ${message}`);
  }
}

export default { info, warn, error, step };
