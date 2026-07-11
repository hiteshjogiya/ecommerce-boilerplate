type LogLevel = "debug" | "info" | "warn" | "error";

interface LogMeta {
  [key: string]: unknown;
}

const levelWeight: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function getMinLevel(): LogLevel {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase();
  if (envLevel === "debug" || envLevel === "info" || envLevel === "warn" || envLevel === "error") {
    return envLevel;
  }

  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

function shouldLog(level: LogLevel) {
  return levelWeight[level] >= levelWeight[getMinLevel()];
}

function write(level: LogLevel, message: string, meta?: LogMeta) {
  if (!shouldLog(level)) {
    return;
  }

  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(meta ? { meta } : {}),
  };

  const text = JSON.stringify(payload);

  const hasProcessStreams = typeof process !== "undefined" && Boolean(process.stdout) && Boolean(process.stderr);

  if (hasProcessStreams) {
    if (level === "error") {
      process.stderr.write(`${text}\n`);
      return;
    }

    process.stdout.write(`${text}\n`);
    return;
  }

  if (level === "error") {
    console.error(text);
    return;
  }

  if (level === "warn") {
    console.warn(text);
    return;
  }

  console.log(text);
}

export const logger = {
  debug: (message: string, meta?: LogMeta) => write("debug", message, meta),
  info: (message: string, meta?: LogMeta) => write("info", message, meta),
  warn: (message: string, meta?: LogMeta) => write("warn", message, meta),
  error: (message: string, meta?: LogMeta) => write("error", message, meta),
};
