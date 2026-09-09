import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messagingService } from "../services/messagingService";

export function useConversations() {
  return useQuery({ queryKey: ["conversations"], queryFn: () => messagingService.listConversations() });
}

export function useTutorConversations(tutorUserId: string) {
  return useQuery({
    queryKey: ["conversations", "tutor", tutorUserId],
    queryFn: () => messagingService.listConversationsForTutor(tutorUserId),
    enabled: Boolean(tutorUserId),
  });
}

export function useParentConversations(children: Array<{ id: string; name: string }>) {
  return useQuery({
    queryKey: ["conversations", "parent", children.map((c) => c.id)],
    queryFn: () => messagingService.listConversationsForParent(children),
    enabled: children.length > 0,
  });
}

export function useConversationMessages(conversationId: string) {
  return useQuery({
    queryKey: ["conversations", conversationId, "messages"],
    queryFn: () => messagingService.getMessages(conversationId),
    enabled: Boolean(conversationId),
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ senderId, body }: { senderId: string; body: string }) => messagingService.sendMessage(conversationId, senderId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations", conversationId, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
