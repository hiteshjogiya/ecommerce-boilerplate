import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/src/lib/supabase/env";
import { validateEnvironment } from "@/src/lib/env.validation";
import { logger } from "@/src/lib/logger";

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"];
const PROTECTED_PATHS = ["/profile", "/account", "/checkout", "/wishlist", "/orders", "/order"];
const ADMIN_PATHS = ["/admin"];

export async function proxy(request: NextRequest) {
  validateEnvironment();

  let response = NextResponse.next({ request: { headers: request.headers } });
  const { url, key, isConfigured } = getSupabaseEnv();
  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const isProtectedPath = PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const isAdminPath = ADMIN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (!isConfigured || !url || !key) {
    return response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request: { headers: request.headers } });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  let user: { id: string } | null = null;
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch (error) {
    logger.error("Proxy auth check failed", { error, pathname });
    if (isProtectedPath || isAdminPath) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  if (user && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!user && isProtectedPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!user && isAdminPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isAdminPath) {
    try {
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error || profile?.role !== "admin") {
        return NextResponse.redirect(new URL("/403", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/403", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};