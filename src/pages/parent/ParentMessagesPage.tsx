import { useEffect, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentParentProfile, useChildren } from "@/features/parents";
import { useConversationMessages, useParentConversations, useSendMessage, messagingService } from "@/features/messaging";
import { initials, formatRelativeToNow } from "@/utils/formatters";
import { cn } from "@/utils/cn";

export function ParentMessagesPage() {
  const { user } = useAuth();
  const { parentId } = useCurrentParentProfile();
  const { data: children, isLoading: isChildrenLoading } = useChildren(parentId);
  const childOptions = (children ?? []).map((c) => ({ id: c.id, name: c.fullName ?? "Student" }));
  const { data: conversations, isLoading } = useParentConversations(childOptions);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const { data: messages } = useConversationMessages(activeId ?? "");
  const sendMessage = useSendMessage(activeId ?? "");

  useEffect(() => {
    const [firstConversation] = conversations ?? [];
    if (!activeId && firstConversation) setActiveId(firstConversation.id);
  }, [conversations, activeId]);

  useEffect(() => {
    if (activeId) messagingService.markRead(activeId);
  }, [activeId]);

  const filtered = conversations?.filter((c) => c.participantName.toLowerCase().includes(query.toLowerCase()) || (c.childName ?? "").toLowerCase().includes(query.toLowerCase())) ?? [];
  const activeConversation = conversations?.find((c) => c.id === activeId);

  function handleSend() {
    if (!draft.trim() || !user) return;
    sendMessage.mutate({ senderId: user.id, body: draft.trim() });
    setDraft("");
  }

  if (isChildrenLoading || isLoading) return <LoadingState label="Loading your messages..." />;

  if (!conversations || conversations.length === 0) {
    return <EmptyState icon={MessageSquare} title="No conversations yet" description="Once your child has a lesson, you'll be able to message their tutor here." />;
  }

  return (
    <Card className="overflow-hidden">
      <div className="grid h-[32rem] sm:grid-cols-[18rem_1fr]">
        <div className="hidden flex-col border-r border-border sm:flex">
          <div className="border-b border-border p-3">
            <SearchInput value={query} onChange={setQuery} placeholder="Search by tutor or child..." />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setActiveId(conversation.id)}
                className={cn("flex w-full items-center gap-3 border-b border-border p-3 text-left hover:bg-muted/50", conversation.id === activeId && "bg-muted")}
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{initials(conversation.participantName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{conversation.participantName}</p>
                    {conversation.isUnread && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{conversation.lastMessage?.body}</p>
                  {conversation.childName && (
                    <Badge variant="outline" className="mt-1 text-[10px]">
                      {conversation.childName}
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          {activeConversation && (
            <div className="flex items-center gap-3 border-b border-border p-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{initials(activeConversation.participantName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{activeConversation.participantName}</p>
                {activeConversation.childName && <p className="text-xs text-muted-foreground">Re: {activeConversation.childName}</p>}
              </div>
            </div>
          )}
          <CardContent className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages?.map((message) => {
              const isMine = message.senderId === user?.id;
              return (
                <div key={message.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[75%] rounded-lg px-3 py-2 text-sm", isMine ? "bg-primary text-primary-foreground" : "bg-muted")}>
                    <p>{message.body}</p>
                    <p className={cn("mt-1 text-[10px]", isMine ? "text-primary-foreground/70" : "text-muted-foreground")}>{formatRelativeToNow(message.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
          <div className="flex items-center gap-2 border-t border-border p-3">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Write a message..."
              aria-label="Message"
            />
            <Button size="icon" onClick={handleSend} disabled={!draft.trim()} aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
