import { auth } from "@/lib/auth/config";

// Export GET and POST handlers directly, as auth.handler is a function, not an object with GET/POST properties
export const GET = auth.handler;
export const POST = auth.handler;
