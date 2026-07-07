"use client";

function TypingCursor() {
  return (
    <span className="ml-0.5 inline-flex items-center gap-0.5">
      <span className="size-1.5 motion-reduce:animate-none animate-bounce rounded-full bg-current [animation-delay:0ms]" />
      <span className="size-1.5 motion-reduce:animate-none animate-bounce rounded-full bg-current [animation-delay:150ms]" />
      <span className="size-1.5 motion-reduce:animate-none animate-bounce rounded-full bg-current [animation-delay:300ms]" />
    </span>
  );
}

export { TypingCursor };
