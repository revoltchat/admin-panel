export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/panel", "/panel/:path*"],
  pages: {
    signIn: "/",
  },
};
