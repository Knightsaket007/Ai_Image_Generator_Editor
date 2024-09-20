import { clerkMiddleware } from '@clerk/nextjs/server';
import { debug } from 'console';

export default clerkMiddleware()

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
  debug:true,
};