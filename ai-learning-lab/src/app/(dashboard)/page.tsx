import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Redirect /dashboard to /dashboard/today
  redirect("/dashboard/today");
}
