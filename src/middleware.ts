export { default } from "next-auth/middleware";

export const config = { matcher: ["/job/post", "/interview/:path*"] };
