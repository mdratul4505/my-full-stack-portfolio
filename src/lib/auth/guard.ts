import { getAdminSession, AdminSessionPayload } from "./session";

export async function requireAdminSession(): Promise<AdminSessionPayload> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED: Admin access required.");
  }
  return session;
}

export async function isAuthorizedAdmin(): Promise<boolean> {
  const session = await getAdminSession();
  return Boolean(session);
}
