import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware((auth, req) => {
  const publicRoutes = ['/', '/api/narrate'];
  if (!publicRoutes.includes(req.nextUrl.pathname)) {
    auth.protect(); // ✅ use auth.protect(), not auth().protect()
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
