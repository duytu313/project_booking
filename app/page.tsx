import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { unstable_noStore as noStore } from "next/cache";

export default async function HomePage() {
  noStore();
  const currentUser = await getCurrentUser();
  const role = currentUser?.dbUser?.role;

  if (role === "ADMIN" || role === "MANAGER") {
    redirect("/dashboard");
  }

  redirect("/guest");
}
