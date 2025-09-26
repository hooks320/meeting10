"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

type Meeting = {
    id: string;
    title: string;
    startsAt: string; // ISO string from API
    endsAt: string;   // ISO string from API
    notes?: string | null;
};

export default function MeetingsPage() {
    const [items, setItems] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/meetings", { cache: "no-store" });
                if (!res.ok) throw new Error("Failed to load meetings");
                const data = (await res.json()) as Meeting[];
                setItems(data);
            } catch (err) {
                toast.error("Could not load meetings");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const remove = async (id: string) => {
        const prev = items;
        setItems((x) => x.filter((m) => m.id !== id)); // optimistic
        const res = await fetch(`/api/meetings/${id}`, { method: "DELETE" });
        if (!res.ok) {
            setItems(prev);
            toast.error("Delete failed");
            return;
        }
        toast.success("Deleted");
    };

    return (
        <main className="p-8 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Meetings</h1>
                <Link href="/meetings/new" className="rounded border px-3 py-2">
                    New
                </Link>
            </div>

            {loading ? (
                <p className="text-sm text-neutral-600">Loading…</p>
            ) : items.length === 0 ? (
                <div className="rounded border p-6">
                    <p className="text-sm text-neutral-600">No meetings yet.</p>
                    <Link href="/meetings/new" className="mt-3 inline-block rounded border px-3 py-2">
                        Create your first meeting
                    </Link>
                </div>
            ) : (
                <ul className="divide-y rounded border">
                    {items.map((m) => {
                        const start = new Date(m.startsAt);
                        const end = new Date(m.endsAt);
                        return (
                            <li key={m.id} className="p-4 flex items-center justify-between">
                                <div>
                                    <div className="font-medium">{m.title}</div>
                                    <div className="text-xs text-neutral-600">
                                        {start.toLocaleString()} – {end.toLocaleTimeString()}
                                    </div>
                                    {m.notes && <div className="text-xs mt-1">{m.notes}</div>}
                                </div>
                                <button
                                    onClick={() => remove(m.id)}
                                    className="text-red-600 text-sm hover:underline"
                                >
                                    Delete
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}

            <Link href="/" className="inline-block text-sm text-blue-600 hover:underline">
                ← Back home
            </Link>
        </main>
    );
}
