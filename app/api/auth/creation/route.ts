import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { determineRole } from "@/app/lib/auth";

export async function GET() {
  noStore();
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  // Kiểm tra nếu không có user từ Kinde thì báo lỗi
  if (!user || user === null || !user.id) {
    throw new Error("Something went wrong, please try again.");
  }

  const role = determineRole(user.email ?? undefined);

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email ?? "",
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
        profileImage:
          user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
        role,
      },
    });
  } else if (dbUser.role !== role) {
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { role },
    });
  }

  return NextResponse.redirect("http://localhost:3000");
}