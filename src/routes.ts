// TODO publicRoutes: เส้นทางที่สามารถเข้าถึงได้โดยไม่ต้องตรวจสอบสิทธิ์ (เส้นทางสาธารณะ).
export const publicRoutes = ["/", "/auth/new-verification"];
// TODO authRoutes: เส้นทางที่เกี่ยวข้องกับการรับรองตัวตน (การลงชื่อเข้าใช้และลงชื่อสมัครใช้).
export const authRoutes = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/reset",
  "/auth/new-password",
];
// TODO:apiAuthPrefix: พรีฟิกซ์สำหรับเส้นทาง API ที่เกี่ยวข้องกับการรับรองตัวตน.
export const apiAuthPrefix = "/api/auth";
// TODO:DEFAULT_LOGIN_REDIRECT: เส้นทางที่ผู้ใช้จะถูกนำไปหลังจากการล็อกอินสำเร็จ.
export const DEFAULT_LOGIN_REDIRECT = `${process.env.NEXTAUTH_URL}/dashboard`;

// * โค้ดส่วนนี้ใช้กับไฟล์ middleware.ts
