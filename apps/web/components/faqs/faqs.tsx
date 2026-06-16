import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FullWidthDivider } from "../common/full-width-divider";
import { TextAnimate } from "@/components/ui/text-animate";

export function FaqsSection() {
  return (
    <section className="mx-auto w-full scroll-mt-20" id="faqs">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="space-y-4 px-4 pt-12 pb-4 md:border-r">
          <TextAnimate
            animation="slideUp"
            as="h2"
            by="word"
            className="font-medium text-2xl tracking-tight md:text-3xl lg:text-4xl"
            duration={0.5}
            once
            startOnView
          >
            FAQs
          </TextAnimate>
          <TextAnimate
            animation="slideUp"
            as="p"
            by="word"
            className="text-muted-foreground"
            delay={0.2}
            duration={0.5}
            once
            startOnView
          >
            Here are some common questions and answers that you might encounter.
          </TextAnimate>
          <TextAnimate
            animation="slideUp"
            as="p"
            by="word"
            className="text-muted-foreground"
            delay={0.4}
            duration={0.5}
            once
            startOnView
          >
            Can't find what you're looking for?
          </TextAnimate>
          <Link className="text-primary hover:underline" href="/#contact">
            Contact Us
          </Link>
        </div>
        <div className="place-content-center">
          <Accordion className="rounded-none" collapsible type="single">
            {questions.map((item) => (
              <AccordionItem className="px-4" key={item.id} value={item.id}>
                <AccordionTrigger className="py-4 hover:no-underline focus-visible:underline focus-visible:ring-0">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-muted-foreground">{item.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      <FullWidthDivider />
    </section>
  );
}

const questions = [
  {
    id: "item-1",
    title: "Is this just a chatbot widget?",
    content:
      "No. The widget is just one way to expose it. IntentCtrl is a runtime \u2014 it understands your app\u2019s actual structure and can take real actions inside it. The chat is the interface; the runtime is what makes it powerful.",
  },
  {
    id: "item-2",
    title: "Does it require a backend?",
    content:
      "No backend changes needed. The SDK runs entirely in the browser. You write one API route and bring your own LLM key. That\u2019s it.",
  },
  {
    id: "item-3",
    title: "Can the AI break my app?",
    content:
      "By design, no. The AI never executes arbitrary JavaScript or manipulates the DOM directly. Every action is routed through a permission-checked, validated runtime executor.",
  },
  {
    id: "item-4",
    title: "How does the AI know what my app can do?",
    content:
      "Two ways. Automatically \u2014 it reads ARIA labels, visible text, buttons, and inputs on the current page. And explicitly \u2014 you register typed tools that expose your application logic directly to the model.",
  },
  {
    id: "item-5",
    title: "What\u2019s the difference between built-in tools and custom tools?",
    content:
      "Built-in tools (navigate, click, type, scroll, highlight, extract) handle common DOM interactions. Custom tools, registered via useAiTool or toolRegistry, call your actual application code \u2014 API calls, state mutations, anything.",
  },
  {
    id: "item-6",
    title: "Which frameworks does it support?",
    content: "React 19 and Next.js today. The core runtime is framework-agnostic, so broader support is planned.",
  },
  {
    id: "item-7",
    title: "Is there a hosted backend?",
    content:
      "Not yet. It\u2019s on the roadmap. Right now you own the whole stack \u2014 which many developers prefer.",
  },
  {
    id: "item-8",
    title: "Is it open source?",
    content: "Yes. The SDK is MIT-licensed. The upcoming cloud backend will be closed source with a free tier.",
  },
];
