import { z } from "zod";
import type {
  ApiResponse,
  ChatSessionResponse,
  CreateChatSessionRequest,
  PaginatedChatSessionsResponse,
  UIMessage,
} from "@intentctrl/types";
import { getItem, setItem, removeItem } from "./storage";

const VISITOR_ID_KEY = "visitorId";
const ACTIVE_SESSION_ID_KEY = "activeSessionId";

// Visitor & session persistence

async function getOrCreateVisitorId(): Promise<string> {
  const existing = await getItem(VISITOR_ID_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  await setItem(VISITOR_ID_KEY, id);
  return id;
}

async function getActiveSessionId(): Promise<string | null> {
  return getItem(ACTIVE_SESSION_ID_KEY);
}

async function saveActiveSessionId(id: string | null): Promise<void> {
  if (id) {
    await setItem(ACTIVE_SESSION_ID_KEY, id);
  } else {
    await removeItem(ACTIVE_SESSION_ID_KEY);
  }
}

// API helpers

const UIMessageShapeSchema = z.array(
  z
    .object({
      id: z.string(),
      role: z.enum(["system", "user", "assistant", "tool"]),
      parts: z.array(z.unknown()),
      metadata: z.unknown().optional(),
    })
    .loose(),
);

function unwrapData<T>(body: unknown): T {
  return (body as ApiResponse<T>).data as T;
}

function authHeaders(apiKey: string): HeadersInit {
  return { "x-api-key": apiKey };
}

export const EMPTY_SESSIONS: PaginatedChatSessionsResponse = {
  items: [],
  rowCount: 0,
  pageCount: 0,
  pageIndex: 0,
  pageSize: 0,
};

// Remote calls

async function fetchSessions(
  apiUrl: string,
  apiKey: string,
  visitorId: string,
  signal?: AbortSignal,
): Promise<PaginatedChatSessionsResponse> {
  try {
    const res = await fetch(`${apiUrl}/sessions/visitor/${visitorId}`, {
      headers: authHeaders(apiKey),
      signal,
    });
    if (!res.ok) return EMPTY_SESSIONS;
    return unwrapData(await res.json());
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return EMPTY_SESSIONS;
    return EMPTY_SESSIONS;
  }
}

async function fetchSessionMessages(
  apiUrl: string,
  apiKey: string,
  sessionId: string,
  visitorId: string,
  signal?: AbortSignal,
): Promise<UIMessage[]> {
  try {
    const res = await fetch(`${apiUrl}/sessions/${sessionId}/messages/${visitorId}`, {
      headers: authHeaders(apiKey),
      signal,
    });
    if (!res.ok) return [];
    const raw = unwrapData<unknown>(await res.json());
    const parsed = UIMessageShapeSchema.safeParse(raw);
    if (!parsed.success) {
      console.error("[IntentCtrl] Malformed messages from server:", parsed.error.flatten());
      return [];
    }
    return parsed.data as unknown as UIMessage[];
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return [];
    return [];
  }
}

async function createSession(
  apiUrl: string,
  apiKey: string,
  visitorId: string,
  externalUserId?: string,
  signal?: AbortSignal,
): Promise<ChatSessionResponse | null> {
  try {
    const res = await fetch(`${apiUrl}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(apiKey) },
      body: JSON.stringify({ visitorId, externalUserId } satisfies CreateChatSessionRequest),
      signal,
    });
    if (!res.ok) return null;
    const session = unwrapData<ChatSessionResponse>(await res.json());
    if (!session.id) return null;
    await saveActiveSessionId(session.id);
    return session;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return null;
    return null;
  }
}

export {
  getOrCreateVisitorId,
  getActiveSessionId,
  saveActiveSessionId,
  fetchSessions,
  fetchSessionMessages,
  createSession,
};
