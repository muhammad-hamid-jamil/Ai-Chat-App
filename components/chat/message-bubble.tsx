import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card } from "../ui/card";

interface MessageBubbleProps {
  role: "user" | "ai";
  content: string;
  createdAt: string;
}

export function MessageBubble({ role, content, createdAt }: MessageBubbleProps) {
  const isUser = role === "user";
  const timestamp = new Date(createdAt).toLocaleTimeString();

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">AI</AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl p-3 md:p-4 shadow-sm transition-all duration-300 ${
            isUser
              ? "bg-indigo-50 dark:bg-indigo-900/40 text-gray-900 dark:text-gray-100"
              : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {timestamp}
        </span>
      </div>
      {isUser && (
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200">U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
