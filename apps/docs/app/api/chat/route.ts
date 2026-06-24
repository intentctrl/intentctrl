import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from "ai";
import { z } from "zod";
import { source } from "@/lib/source";
import { Document, type DocumentData } from "flexsearch";
import { ChatUIMessage, SearchTool } from "../../../components/ai/search";

type ChatRequest = {
  messages: ChatUIMessage[];
};

interface CustomDocument extends DocumentData {
  url: string;
  title: string;
  description: string;
  content: string;
}
const searchServer = createSearchServer();

async function createSearchServer() {
  const search = new Document<CustomDocument>({
    document: {
      id: "url",
      index: ["title", "description", "content"],
      store: true,
    },
  });

  const docs = await chunkedAll(
    source.getPages().map(async (page) => {
      if (!("getText" in page.data)) return null;

      return {
        title: page.data.title,
        description: page.data.description,
        url: page.url,
        content: await page.data.getText("processed"),
      } as CustomDocument;
    }),
  );

  for (const doc of docs) {
    if (doc) search.add(doc);
  }

  return search;
}

async function chunkedAll<O>(promises: Promise<O>[]): Promise<O[]> {
  const SIZE = 50;
  const out: O[] = [];
  for (let i = 0; i < promises.length; i += SIZE) {
    out.push(...(await Promise.all(promises.slice(i, i + SIZE))));
  }
  return out;
}

const LLM_BASE_URL = process.env.LLM_BASE_URL ?? "https://api.puter.com/puterai/openai/v1";
const LLM_MODEL = process.env.LLM_MODEL ?? "gpt-4o-mini";
const LLM_API_KEY = process.env.LLM_API_KEY ?? "sk-1234";

const openaiCompatibleProvider = createOpenAICompatible({
  name: "Any",
  apiKey: LLM_API_KEY,
  baseURL: LLM_BASE_URL,
  includeUsage: true,
});

/** System prompt, you can update it to provide more specific information */
const systemPrompt = [
  "You are an AI assistant for a documentation site.",
  "Use the `search` tool to retrieve relevant docs context before answering when needed.",
  "The `search` tool returns raw JSON results from documentation. Use those results to ground your answer and cite sources as markdown links using the document `url` field when available.",
  "If you cannot find the answer in search results, say you do not know and suggest a better search query.",
].join("\n");

export async function POST(req: Request, ctx: RouteContext<"/api/chat">) {
  const reqJson: ChatRequest = await req.json();

  const messages = await convertToModelMessages<ChatUIMessage>(reqJson.messages, {
    convertDataPart(part) {
      if (part.type === "data-client")
        return {
          type: "text",
          text: `[Client Context: ${JSON.stringify(part.data)}]`,
        };
    },
  });

  const result = streamText({
    model: openaiCompatibleProvider.chatModel(LLM_MODEL),
    system: systemPrompt,
    stopWhen: stepCountIs(5),
    tools: {
      search: searchTool,
    },
    messages: messages,
    toolChoice: "auto",
  });

  return result.toUIMessageStreamResponse();
}

const searchTool = tool({
  description: "Search the docs content and return raw JSON results.",
  inputSchema: z.object({
    query: z.string(),
    limit: z.number().int().min(1).max(100).default(10),
  }),
  async execute({ query, limit }) {
    const search = await searchServer;
    return await search.searchAsync(query, {
      limit,
      merge: true,
      enrich: true,
    });
  },
}) satisfies SearchTool;
