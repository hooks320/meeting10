// src/app/page.tsx
"use client";

import { toast } from "sonner";

export default function Home() {
    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold">Meeting10</h1>
            <p className="mt-2 text-sm text-neutral-600">Fresh start ✅</p>
            <button
                onClick={() => toast.success("It works!")}
                className="mt-6 rounded-lg border px-4 py-2"
            >
                Test Toast
            </button>
        </main>
    );
}
