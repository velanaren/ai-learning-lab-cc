import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | AI Learning Lab",
  description: "Manage your learning preferences and account settings",
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-medium text-zinc-900">Settings</h1>
        <p className="text-base text-zinc-600">Coming soon...</p>
      </div>
    </div>
  );
}
