import type { NextRequest } from "next/server";

export function hasTrustedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  try {
    const originUrl = new URL(origin);
    const currentUrl = new URL(request.url);
    return originUrl.host === currentUrl.host;
  } catch {
    return false;
  }
}
