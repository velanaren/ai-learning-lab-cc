import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Today's Learning | AI Learning Lab",
  description: "Your personalized daily learning session",
};

export default function TodayPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-medium text-zinc-900">
          Today's Learning
        </h1>
        <p className="text-base text-zinc-600">Coming soon...</p>
      </div>
    </div>
  );
}
