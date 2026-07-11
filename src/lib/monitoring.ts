import { logger } from "@/src/lib/logger";

interface MonitoringContext {
  area?: string;
  route?: string;
  extra?: Record<string, unknown>;
}

export function reportError(error: unknown, context: MonitoringContext = {}) {
  const payload = {
    message: error instanceof Error ? error.message : "Unknown error",
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  };

  logger.error("monitoring.error", payload);
}
