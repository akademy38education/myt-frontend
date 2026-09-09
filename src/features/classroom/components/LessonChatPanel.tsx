import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import type { LessonParticipantRole } from "@myt/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/EmptyState";
import { useLessonChat, useSendLessonMessage } from "../hooks/useLessonChat";
import { cn } from "@/utils/cn";

export function LessonChatPanel({ bookingId, role }: { bookingId: string; role: LessonParticipantRole }) {
  const { data: messages } = useLessonChat(bookingId);
  const sendMessage = useSendLessonMessage(bookingId, role);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  function handleSend() {
    if (!draft.trim()) return;
    const body = draft.trim();
    setDraft("");
    sendMessage.mutate(body);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {!messages || messages.length === 0 ? (
          <EmptyState title="No messages yet" description="Say hello to get started." className="py-8" />
        ) : (
          messages.map((message) => {
            const isMine = message.senderRole === role;
            return (
              <div key={message.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[80%] rounded-lg px-3 py-2 text-sm", isMine ? "bg-primary text-primary-foreground" : "bg-muted")}>{message.body}</div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>
      <div className="flex items-center gap-2 border-t border-border p-3">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message…"
          aria-label="Lesson chat message"
        />
        <Button size="icon" onClick={handleSend} disabled={!draft.trim()} aria-label="Send message">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
