// Re-export auth from config for server-side usage
export { auth } from './config';

// Server-side session function
export async function getServerSession() {
  try {
    const { auth } = await import('./config');
    const session = await auth.api.getSession({
      headers: new Headers()
    });
    
    return session;
  } catch (error) {
    console.error('Error getting server session:', error);
    return null;
  }
}