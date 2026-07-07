"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { IconBrain, IconChevronDown } from "@tabler/icons-react";
import type { ComponentProps, ReactNode } from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Shimmer } from "@/components/chat/shimmer";

function useControllableState<T>({
  defaultProp,
  onChange,
  prop,
}: {
  defaultProp?: T;
  onChange?: (value: T) => void;
  prop?: T;
}): [T, (value: T) => void] {
  const [internal, setInternal] = useState(defaultProp as T);
  const isControlled = prop !== undefined;
  const value = isControlled ? (prop as T) : internal;
  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [value, setValue];
}

export type ReasoningProps = ComponentProps<typeof Collapsible> & {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const AUTO_CLOSE_DELAY = 1000;

export const Reasoning = memo(
  ({ className, isStreaming = false, open, defaultOpen, onOpenChange, children, ...props }: ReasoningProps) => {
    const resolvedDefaultOpen = defaultOpen ?? isStreaming;
    const isExplicitlyClosed = defaultOpen === false;

    const [isOpen, setIsOpen] = useControllableState<boolean>({
      defaultProp: resolvedDefaultOpen,
      onChange: onOpenChange,
      prop: open,
    });
    const hasEverStreamedRef = useRef(isStreaming);
    const [hasAutoClosed, setHasAutoClosed] = useState(false);

    useEffect(() => {
      if (isStreaming && !isOpen && !isExplicitlyClosed) {
        setIsOpen(true);
      }
    }, [isStreaming, isOpen, setIsOpen, isExplicitlyClosed]);

    useEffect(() => {
      if (hasEverStreamedRef.current && !isStreaming && isOpen && !hasAutoClosed) {
        const timer = setTimeout(() => {
          setIsOpen(false);
          setHasAutoClosed(true);
        }, AUTO_CLOSE_DELAY);
        return () => clearTimeout(timer);
      }
    }, [isStreaming, isOpen, setIsOpen, hasAutoClosed]);

    const handleOpenChange = useCallback(
      (newOpen: boolean) => {
        setIsOpen(newOpen);
      },
      [setIsOpen],
    );

    return (
      <Collapsible className={cn("not-prose mb-1", className)} onOpenChange={handleOpenChange} open={isOpen} {...props}>
        {children}
      </Collapsible>
    );
  },
);

export type ReasoningTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  isStreaming?: boolean;
  getThinkingMessage?: (isStreaming: boolean) => ReactNode;
};

function defaultGetThinkingMessage(isStreaming: boolean) {
  if (isStreaming) {
    return <Shimmer duration={1}>Thinking...</Shimmer>;
  }
  return <p>Thought</p>;
}

export const ReasoningTrigger = memo(
  ({
    className,
    children,
    isStreaming = false,
    getThinkingMessage = defaultGetThinkingMessage,
    ...props
  }: ReasoningTriggerProps) => {
    return (
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center gap-1.5 text-muted-foreground text-xs transition-colors hover:text-foreground",
          className,
        )}
        {...props}
      >
        {children ?? (
          <>
            <IconBrain className="size-3" />
            {getThinkingMessage(isStreaming)}
            <IconChevronDown className="size-3 transition-transform motion-reduce:transition-none aria-expanded:rotate-180" />
          </>
        )}
      </CollapsibleTrigger>
    );
  },
);

export type ReasoningContentProps = ComponentProps<typeof CollapsibleContent> & {
  children: string;
};

export const ReasoningContent = memo(({ className, children, ...props }: ReasoningContentProps) => (
  <CollapsibleContent className={cn("mt-2 text-xs text-muted-foreground outline-none", className)} {...props}>
    {children}
  </CollapsibleContent>
));

Reasoning.displayName = "Reasoning";
ReasoningTrigger.displayName = "ReasoningTrigger";
ReasoningContent.displayName = "ReasoningContent";
