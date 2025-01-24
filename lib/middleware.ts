import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Tạo response mặc định
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Tạo Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Lấy thông tin người dùng
  const { data: { user }, error } = await supabase.auth.getUser();

  // Bảo vệ các route bắt đầu bằng /protected
  if (request.nextUrl.pathname.startsWith("/protected") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/protected/:path*"], // Áp dụng middleware cho các route bắt đầu bằng /protected
};