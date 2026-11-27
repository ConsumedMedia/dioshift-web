"use client";

import { useEffect, useTransition } from "react";
import { markMessageRead } from "@/app/admin/_actions/messages";

/**
 * Marks a message read once it's actually on screen. Done here rather than
 * while rendering so a link prefetch never marks anything read.
 */
export function MarkRead({ id }: { id: string }) {
  const [, startTransition] = useTransition();
  useEffect(() => {
    startTransition(() => markMessageRead(id));
  }, [id]);
  return null;
}
