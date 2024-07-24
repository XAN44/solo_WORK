import NextAuth from "next-auth";
import authConfig from "auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLOggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  // TODO : ถ้ามีการเข้าสู่ระบบ จะทำการ Redirect ไปยังหน้าที่ได้ระบุไว้ใน DEFAULT_LOGIN....
  if (isAuthRoute) {
    if (isLOggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // TODO: ปิดใช้งาน PATH / หากไม่มีการเข้าสู่ระบบ และจะนำกลับไปหน้า Sign-In หากไม่ได้ login
  if (!isLOggedIn && (!isPublicRoute || nextUrl.pathname === "/")) {
    return Response.redirect(new URL("/auth/sign-in", nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
