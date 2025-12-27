import { auth } from "./auth";
import { prisma } from "@/lib/db/prisma";

/**
 * Get the current session from server components
 */
export async function getSession() {
  return await auth();
}

/**
 * Get the current user from server components
 * Throws error if not authenticated
 */
export async function getCurrentUser() {
  const session = await getSession();

  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      profile: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session?.user;
}
