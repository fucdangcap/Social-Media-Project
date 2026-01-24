"use client";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function NotificationHeart() {
  const { user } = useUser();
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    if (!user) return;
    const channel = pusherClient.subscribe(`user_${user.id}`);
    channel.bind("new-notification", () => setHasNew(true));
    return () => pusherClient.unsubscribe(`user_${user.id}`);
  }, [user?.id]);

  return (
    <Link href="/activity" onClick={() => setHasNew(false)} className="relative p-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-7 h-7 ${hasNew ? "text-black dark:text-white" : "text-gray-400"}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
      {hasNew && (
        <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
        </span>
      )}
    </Link>
  );
}