"use client";

import * as React from "react";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Message, MessageContent, MessageFooter, MessageHeader } from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { IntentCtrlChat } from "@intentctrl/react";
import { isTextUIPart, isReasoningUIPart, isToolUIPart } from "@intentctrl/react";
import { IconMessageCircle, IconSend, IconPlayerStop, IconPlus, IconX, IconChevronLeft } from "@tabler/icons-react";
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/chat/reasoning-block";
import { ToolCard } from "@/components/chat/tool-card";
import { TypingCursor } from "@/components/chat/typing-cursor";

const DEFAULT_SUGGESTIONS = [
  "Help me write an email",
  "Summarize this article",
  "Explain like I'm 5",
  "Give me a recipe",
];

function formatRelativeTime(iso: string): string {
  const timestamp = new Date(iso).getTime();
  if (Number.isNaN(timestamp)) return "";
  const diff = Date.now() - timestamp;
  if (diff < 0) return "just now";
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export interface PopoverChatProps {
  chat: IntentCtrlChat;
  title?: string;
  description?: string;
  placeholder?: string;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
  suggestions?: string[];
}

export function PopoverChat({
  chat,
  title = "AI Assistant",
  description = "Ask me anything",
  placeholder = "Type a message...",
  defaultOpen = false,
  onToggle,
  suggestions = DEFAULT_SUGGESTIONS,
}: PopoverChatProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [input, setInput] = React.useState("");
  const hasSessions = chat.session.sessions.items.length > 0;
  const [showList, setShowList] = React.useState(!chat.session.activeSessionId && hasSessions);
  const [pendingMessage, setPendingMessage] = React.useState(false);
  const isBusy = chat.status === "streaming" || chat.status === "submitted";
  const isReady = chat.session.initState === "ready";

  React.useEffect(() => {
    if (chat.session.activeSessionId) setShowList(false);
  }, [chat.session.activeSessionId]);

  const lastAssistantMsg = React.useMemo(
    () => [...chat.messages].reverse().find((m) => m.role === "assistant"),
    [chat.messages],
  );

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      onToggle?.(nextOpen);
    },
    [onToggle],
  );

  const handleBackToList = React.useCallback(() => {
    chat.clearSession();
    setShowList(true);
  }, [chat]);

  const handleSend = React.useCallback(async () => {
    const text = input.trim();
    if (!text || isBusy || !isReady) return;
    setInput("");
    if (showList) {
      setPendingMessage(true);
      await chat.clearSession();
      setShowList(false);
    }
    await chat.sendMessage(text);
    setPendingMessage(false);
  }, [input, isBusy, isReady, chat, showList]);

  const handleSuggestionClick = React.useCallback(
    async (text: string) => {
      setInput("");
      await chat.sendMessage(text);
    },
    [chat],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (isBusy) {
          chat.stop();
        } else {
          handleSend();
        }
      }
      if (e.key === "Escape") {
        e.preventDefault();
        handleOpenChange(false);
      }
    },
    [handleSend, isBusy, chat.stop, handleOpenChange],
  );

  return (
    <div className="fixed inset-0">
      <Popover modal={true} open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          render={<Button className="fixed bottom-4 right-4 size-12 rounded-full shadow-lg bg-muted text-foreground" />}
        >
          <IconMessageCircle className="size-6" />
        </PopoverTrigger>
        <PopoverContent data-ignore className="h-112 w-80 p-0 mr-4">
          {/* Header */}
          <div className="flex shrink-0 items-start justify-between border-b px-4 py-3">
            <div className="flex items-center gap-1">
              {!showList && hasSessions && (
                <Button variant="ghost" size="icon-xs" onClick={handleBackToList} aria-label="Back to chats">
                  <IconChevronLeft className="size-4" />
                </Button>
              )}
              <PopoverHeader className="gap-0.5 p-0">
                <PopoverTitle className="text-sm font-semibold">{showList ? "Chats" : title}</PopoverTitle>
                <PopoverDescription className="text-xs">
                  {showList
                    ? `${chat.session.sessions.items.length} conversation${chat.session.sessions.items.length !== 1 ? "s" : ""}`
                    : chat.status === "streaming"
                      ? "Thinking\u2026"
                      : chat.status === "submitted"
                        ? "Sending\u2026"
                        : chat.status === "error"
                          ? chat.error || "Error"
                          : description}
                </PopoverDescription>
              </PopoverHeader>
            </div>
            <Button variant="ghost" size="icon-xs" onClick={() => handleOpenChange(false)} aria-label="Close">
              <IconX />
            </Button>
          </div>

          {/* Sessions list */}
          {showList && (
            <>
              {hasSessions ? (
                <div className="flex-1 overflow-y-auto">
                  <button
                    onClick={() => {
                      chat.clearSession();
                      setShowList(false);
                    }}
                    className="flex w-full items-center gap-3 border-b px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                      <IconPlus className="size-4 text-primary" />
                    </div>
                    <span>New conversation</span>
                  </button>
                  {chat.session.sessions.items.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        chat.switchSession(s.id);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                        <IconMessageCircle className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{s.title}</div>
                        <div className="mt-0.5 truncate text-xs text-muted-foreground">
                          {formatRelativeTime(s.updatedAt)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                  <IconMessageCircle className="size-8 opacity-40" />
                  <span>Start a new conversation</span>
                </div>
              )}
            </>
          )}

          {/* Chat view */}
          {!showList && (
            <MessageScrollerProvider autoScroll defaultScrollPosition="end">
              <MessageScroller className="flex-1">
                <MessageScrollerViewport>
                  <MessageScrollerContent className="gap-4 p-4">
                    {/* Loading state — chat bubble skeletons */}
                    {chat.session.initState === "loading" && (
                      <div className="flex h-full flex-col justify-end gap-4">
                        <div className="flex flex-col gap-1.5">
                          <Skeleton className="h-2.5 w-14" />
                          <Skeleton className="h-12 w-3/5 rounded-2xl" />
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <Skeleton className="h-2.5 w-10" />
                          <Skeleton className="h-9 w-2/5 rounded-2xl" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Skeleton className="h-2.5 w-14" />
                          <div className="flex flex-col gap-1.5">
                            <Skeleton className="h-4 w-4/5 rounded-2xl" />
                            <Skeleton className="h-4 w-3/5 rounded-2xl" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Skeleton className="h-2.5 w-12" />
                          <Skeleton className="h-8 w-1/2 rounded-2xl" />
                        </div>
                      </div>
                    )}
                    {/* Error state */}
                    {chat.session.initState === "error" && (
                      <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
                        <div className="text-sm text-destructive">{chat.error || "Failed to load session"}</div>
                        <Button variant="outline" size="sm" onClick={chat.newSession}>
                          <IconPlus className="size-3" />
                          New session
                        </Button>
                      </div>
                    )}
                    {/* Empty state */}
                    {isReady && chat.messages.length === 0 && (
                      <div className="flex h-full flex-col items-center justify-center gap-4 text-sm text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <IconMessageCircle className="size-8 opacity-40" />
                          <span>{description}</span>
                        </div>
                      </div>
                    )}

                    {/* Message list */}
                    {isReady &&
                      chat.messages.map((message) => {
                        const isUser = message.role === "user";

                        return (
                          <MessageScrollerItem key={message.id} messageId={message.id} scrollAnchor={isUser}>
                            <Message align={isUser ? "end" : "start"}>
                              <MessageContent>
                                <MessageHeader className="px-1">{isUser ? "You" : "Assistant"}</MessageHeader>
                                {message.parts?.map((part, partIndex) => {
                                  if (isTextUIPart(part)) {
                                    const isStreaming =
                                      isBusy &&
                                      lastAssistantMsg &&
                                      message.id === lastAssistantMsg.id &&
                                      partIndex === message.parts!.length - 1;
                                    return (
                                      <Bubble
                                        key={partIndex}
                                        variant={isUser ? "default" : "secondary"}
                                        align={isUser ? "end" : "start"}
                                      >
                                        <BubbleContent>
                                          {part.text}
                                          {isStreaming && <TypingCursor />}
                                        </BubbleContent>
                                      </Bubble>
                                    );
                                  }
                                  if (isReasoningUIPart(part)) {
                                    const isReasoningStreaming = part.state === "streaming";
                                    return (
                                      <Reasoning key={partIndex} isStreaming={isReasoningStreaming}>
                                        <ReasoningTrigger isStreaming={isReasoningStreaming} />
                                        <ReasoningContent>{part.text}</ReasoningContent>
                                      </Reasoning>
                                    );
                                  }
                                  if (isToolUIPart(part)) {
                                    return <ToolCard key={part.toolCallId ?? partIndex} toolPart={part} chat={chat} />;
                                  }
                                  return null;
                                })}
                                <MessageFooter className="opacity-60 px-1">
                                  {new Date(
                                    (message as { createdAt?: string }).createdAt ?? Date.now(),
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </MessageFooter>
                              </MessageContent>
                            </Message>
                          </MessageScrollerItem>
                        );
                      })}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton className="bg-muted rounded-full" direction="end" />
              </MessageScroller>
            </MessageScrollerProvider>
          )}

          {!showList && isReady && chat.messages.length === 0 && suggestions.length > 0 && !pendingMessage && (
            <div className="shrink-0 border-b px-4 py-3">
              <div className="flex flex-wrap justify-center gap-1.5">
                {suggestions.map((text) => (
                  <button
                    key={text}
                    onClick={() => handleSuggestionClick(text)}
                    className="rounded-full border bg-muted px-3 py-1.5 text-xs text-foreground hover:bg-muted/50 hover:border-foreground/20 transition-colors"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Input */}
          <div className="shrink-0 p-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={showList ? "New conversation..." : placeholder}
                  className="min-h-9 max-h-24 resize-none pr-8"
                  rows={1}
                  disabled={!isReady}
                />
                {input && !isBusy && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setInput("")}
                    aria-label="Clear input"
                  >
                    <IconX className="size-3" />
                  </Button>
                )}
              </div>
              <Button
                size="icon"
                className="shrink-0"
                onClick={isBusy ? chat.stop : handleSend}
                disabled={chat.status === "submitted"}
              >
                {isBusy ? <IconPlayerStop className="size-4" /> : <IconSend className="size-4" />}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
