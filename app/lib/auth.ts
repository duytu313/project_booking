import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import { UserRole } from "@prisma/client";

const adminEmails = new Set(["tudo9912@gmail.com"]);
const managerEmails = new Set(["manager@ktvplatform.com"]);

export function determineRole(email?: string): UserRole {
  if (!email) return UserRole.CUSTOMER;

  const normalizedEmail = email.toLowerCase();

  if (adminEmails.has(normalizedEmail)) {
    return UserRole.ADMIN;
  }

  if (managerEmails.has(normalizedEmail)) {
    return UserRole.MANAGER;
  }

  return UserRole.CUSTOMER;
}

export async function getCurrentUser() {
  const { getUser } = getKindeServerSession();

  const kindeUser = await getUser();

  if (!kindeUser || !kindeUser.email) {
    return null;
  }

  const role = determineRole(kindeUser.email);

  const dbUser = await prisma.user.upsert({
    where: {
      email: kindeUser.email.toLowerCase(),
    },

    update: {
      firstName: kindeUser.given_name ?? "",
      lastName: kindeUser.family_name ?? "",
      profileImage:
        kindeUser.picture ??
        `https://avatar.vercel.sh/${kindeUser.email}`,

      role,
    },

    create: {
      id: kindeUser.id,

      email: kindeUser.email.toLowerCase(),

      firstName: kindeUser.given_name ?? "",

      lastName: kindeUser.family_name ?? "",

      profileImage:
        kindeUser.picture ??
        `https://avatar.vercel.sh/${kindeUser.email}`,

      role,
    },
  });

  return {
    kindeUser,
    dbUser,
  };
}

export async function requireRole(
  allowedRoles: UserRole[] = [
    UserRole.ADMIN,
    UserRole.MANAGER,
  ]
) {
  const currentUser = await getCurrentUser();

  if (
    !currentUser?.dbUser ||
    !allowedRoles.includes(currentUser.dbUser.role)
  ) {
    redirect("/rooms");
  }

  return currentUser;
}

export async function requireAuth() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.dbUser) {
    redirect("/rooms");
  }

  return currentUser;
}