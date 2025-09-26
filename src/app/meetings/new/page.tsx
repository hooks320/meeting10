"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function NewMeetingPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startsAt || !endsAt) {
      toast.error("Please fill all required fields");
      return;
    }
    const start = new Date(startsAt);
    const end = new Date(endsAt);
    if (end <= start) {
      toast.error("End time must be after start time");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, startsAt, endsAt, notes }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Error creating meeting");
      }
      toast.success("Meeting created");
      router.push("/meetings");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">New Meeting</h1>
      <form onSubmit={submit} className="space-y-3 max-w-md">
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="block text-sm">Start</label>
        <input
          type="datetime-local"
          className="w-full rounded border px-3 py-2"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
          required
        />

        <label className="block text-sm">End</label>
        <input
          type="datetime-local"
          className="w-full rounded border px-3 py-2"
          value={endsAt}
          onChange={(e) => setEndsAt(e.target.value)}
          required
        />

        <textarea
          className="w-full rounded border px-3 py-2"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            className="rounded border px-3 py-2 disabled:opacity-50"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Creating…" : "Create"}
          </button>
          <Link href="/meetings" className="rounded border px-3 py-2">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
