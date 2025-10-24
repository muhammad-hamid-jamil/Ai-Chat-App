"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Select } from "../ui/select";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { MessageBubble } from "./message-bubble";
import { trpc } from "../../lib/trpc";
import { Send, Loader2 } from "lucide-react";

interface ChatBoxProps {
  userId: string;
}

export function ChatBox({ userId }: ChatBoxProps) {
  const [selectedModel, setSelectedModel] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { data: models, isLoading: modelsLoading } = trpc.models.getAvailable.useQuery();
  const { data: history, refetch: refetchHistory } = trpc.chat.history.useQuery(
    { userId, modelTag: selectedModel },
    { enabled: !!selectedModel }
  );

  const sendMessage = trpc.chat.send.useMutation({
    onSuccess: () => {
      setMessage("");
      refetchHistory();
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedModel || isLoading) return;

    setIsLoading(true);
    try {
      await sendMessage.mutateAsync({
        userId,
        modelTag: selectedModel,
        prompt: message.trim(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [history]);

  if (modelsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Model Selector */}
      <div className="space-y-2">
        <Label htmlFor="model" className="text-sm font-medium text-gray-700 dark:text-gray-200">Select AI Model</Label>
        <Select
          id="model"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={isLoading}
          className="transition-all duration-300"
        >
          <option value="">Choose a model...</option>
          {models?.map((model) => (
            <option key={model.tag} value={model.tag}>
              {model.tag}
            </option>
          ))}
        </Select>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 min-h-0 bg-white dark:bg-gray-900 rounded-2xl shadow-sm scroll-smooth">
        <div className="p-4 space-y-4">
          {history?.map((msg, index) => (
            <MessageBubble
              key={index}
              role={msg.role as "user" | "ai"}
              content={msg.content}
              createdAt={msg.created_at}
            />
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <div className="bg-gray-100 dark:bg-gray-800/60 rounded-2xl p-3 md:p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 animate-pulse opacity-70">AI is typing...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 min-h-[60px] max-h-[120px] resize-none rounded-xl transition-all duration-300"
          disabled={!selectedModel || isLoading}
        />
        <Button
          type="submit"
          disabled={!message.trim() || !selectedModel || isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl px-4 py-2 shadow-sm hover:shadow transition-all duration-300"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
