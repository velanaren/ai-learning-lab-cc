import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memory | AI Learning Lab",
  description: "Your learning memory and evidence",
};

export default function MemoryPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-medium text-zinc-900">Memory</h1>
        <p className="text-base text-zinc-600">Coming soon...</p>
      </div>
    </div>
  );
}
