"use client"

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react"
import { IconCheck, IconCopy } from "@tabler/icons-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"

interface CodeTab {
  label: string
  code: string
  language?: string
}

interface CodeBlockProps {
  tabs?: CodeTab[]
  code?: string
  language?: string
  className?: string
}

export function CodeBlock({
  tabs,
  code,
  language = "bash",
  className,
}: CodeBlockProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)
  const [direction, setDirection] = useState(0)
  const preRef = useRef<HTMLPreElement>(null)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [hasOverflow, setHasOverflow] = useState(false)
  const [indicator, setIndicator] = useState<{
    left: number
    width: number
  } | null>(null)

  const measureIndicator = useCallback(() => {
    const container = tabsContainerRef.current
    const activeEl = tabRefs.current[activeTab]

    if (!container || !activeEl) {
      return
    }

    const containerRect = container.getBoundingClientRect()
    const tabRect = activeEl.getBoundingClientRect()

    setIndicator({
      left: tabRect.left - containerRect.left,
      width: tabRect.width,
    })
  }, [activeTab])

  const codeContent = useMemo(() => {
    if (tabs && tabs.length > 0) {
      return tabs
    }
    if (code) {
      return [{ label: language, code, language }]
    }
    return []
  }, [tabs, code, language])

  const currentCode = codeContent[activeTab]?.code || ""

  useLayoutEffect(() => {
    const checkOverflow = () => {
      if (preRef.current) {
        const hasHorizontalOverflow =
          preRef.current.scrollWidth > preRef.current.clientWidth
        setHasOverflow(hasHorizontalOverflow)
      }
    }

    checkOverflow()
    const resizeObserver = new ResizeObserver(checkOverflow)
    if (preRef.current) {
      resizeObserver.observe(preRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [activeTab])

  useLayoutEffect(() => {
    measureIndicator()

    const resizeObserver = new ResizeObserver(measureIndicator)
    const container = tabsContainerRef.current

    if (container) {
      resizeObserver.observe(container)
    }

    for (const tab of tabRefs.current) {
      if (tab) {
        resizeObserver.observe(tab)
      }
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [measureIndicator])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTabChange = (index: number) => {
    setDirection(index > activeTab ? 1 : -1)
    setActiveTab(index)
  }

  if (codeContent.length === 0) return null

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border shadow-xs",
        "bg-card",
        className
      )}
    >
      {/* Tab Bar */}
      {codeContent.length > 1 && (
        <div className="border-b">
          <div
            ref={tabsContainerRef}
            role="tablist"
            className={cn(
              "relative flex items-center text-xs rounded-tl-lg gap-1 flex-1 min-w-0 px-1.5",
              "overflow-x-auto overflow-y-hidden",
              "scrollbar-thin scrollbar-thumb-rounded",
              "scrollbar-thumb-black/15 hover:scrollbar-thumb-black/20",
              "dark:scrollbar-thumb-white/20 dark:hover:scrollbar-thumb-white/25"
            )}
          >
            {codeContent.map((tab, index) => (
              <button
                key={`${tab.label}-${index}`}
                ref={(element) => {
                  tabRefs.current[index] = element
                }}
                type="button"
                role="tab"
                aria-selected={activeTab === index}
                onClick={() => handleTabChange(index)}
                className={cn(
                  "flex items-center relative gap-1.5 my-1.5 outline-0",
                  "whitespace-nowrap font-medium transition-colors duration-150",
                  "px-2 py-1 rounded-md",
                  "hover:bg-muted",
                  activeTab === index
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
            {indicator && (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-foreground"
                initial={false}
                animate={{
                  left: indicator.left,
                  width: indicator.width,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Code Content */}
      <div className="relative overflow-hidden">
        {/* Copy Button */}
        <motion.button
          onClick={handleCopy}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "absolute top-2 right-2 z-10",
            "flex items-center justify-center size-8 rounded-md",
            "text-muted-foreground",
            "bg-background/80 backdrop-blur-sm",
            "border",
            "opacity-0 group-hover:opacity-100",
            "hover:bg-muted hover:text-foreground",
            "transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          )}
          aria-label="Copy code"
        >
          <span className="relative size-4">
            <motion.div
              initial={false}
              animate={{
                scale: copied ? 0 : 1,
                opacity: copied ? 0 : 1,
                rotate: copied ? 90 : 0,
              }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <IconCopy className="size-full" />
            </motion.div>
            <motion.div
              initial={false}
              animate={{
                scale: copied ? 1 : 0,
                opacity: copied ? 1 : 0,
                rotate: copied ? 0 : -90,
              }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <IconCheck className="size-full" />
            </motion.div>
          </span>
        </motion.button>
        <pre
          ref={preRef}
          onClick={() => {
            const selection = window.getSelection()
            const range = document.createRange()
            range.selectNodeContents(preRef.current!)
            selection?.removeAllRanges()
            selection?.addRange(range)
          }}
          className={cn(
            "cursor-pointer p-4 text-xs leading-relaxed m-0",
            codeContent.length > 1 ? "rounded-b-lg" : "rounded-lg",
            hasOverflow ? "overflow-x-auto" : "overflow-x-hidden",
            hasOverflow && "scrollbar-thin scrollbar-thumb-rounded",
            hasOverflow &&
              "scrollbar-thumb-black/15 hover:scrollbar-thumb-black/20",
            hasOverflow &&
              "dark:scrollbar-thumb-white/20 dark:hover:scrollbar-thumb-white/25",
            hasOverflow && "[&::-webkit-scrollbar]:h-2",
            hasOverflow && "[&::-webkit-scrollbar-thumb]:rounded-full",
            hasOverflow && "[&::-webkit-scrollbar-thumb]:bg-black/15",
            hasOverflow && "[&::-webkit-scrollbar-thumb]:dark:bg-white/20",
            hasOverflow && "[&::-webkit-scrollbar-thumb:hover]:bg-black/20",
            hasOverflow &&
              "[&::-webkit-scrollbar-thumb:hover]:dark:bg-white/25",
            hasOverflow && "[&::-webkit-scrollbar-track]:bg-transparent"
          )}
        >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.code
              key={activeTab}
              custom={direction}
              initial={{
                opacity: 0,
                x: direction > 0 ? 20 : -20,
                filter: "blur(4px)",
              }}
              animate={{
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                x: direction > 0 ? -20 : 20,
                filter: "blur(4px)",
              }}
              transition={{
                duration: 0.15,
                ease: "easeOut",
              }}
              className="font-mono text-foreground block whitespace-pre"
            >
              {currentCode}
            </motion.code>
          </AnimatePresence>
        </pre>
      </div>
    </div>
  )
}
