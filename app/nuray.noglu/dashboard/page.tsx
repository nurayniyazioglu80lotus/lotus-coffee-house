import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  adminCookieName,
  verifyAdminSessionValue,
} from "@/lib/admin-auth";
import AdminDashboardShell from "./dashboard-shell";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(adminCookieName)?.value;
  const isValid = verifyAdminSessionValue(session);

  if (!isValid) {
    redirect("/nuray.noglu");
  }

  return <AdminDashboardShell />;
}