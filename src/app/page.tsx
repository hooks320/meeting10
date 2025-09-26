import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Meeting10</h1>
      <p className="mt-2 text-sm text-neutral-600">Lightweight meeting/scheduling app</p>

      <Link href="/meetings" className="mt-6 inline-block rounded border px-4 py-2">
        Go to Meetings
      </Link>
    </main>
  );
}
