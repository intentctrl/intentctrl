import { v4 as uuidv4 } from "uuid";
import type {
  ApiResponse,
  ChatSessionResponse,
  CreateChatSessionRequest,
  PaginatedChatSessionsResponse,
} from "@intentctrl/types";
import { getItem, setItem, removeItem } from "./storage";

const VISITOR_ID_KEY = "visitorId";
const ACTIVE_SESSION_ID_KEY = "activeSessionId";

async function getOrCreateVisitorId(): Promise<string> {
  const existing = await getItem(VISITOR_ID_KEY);
  if (existing) return existing;
  const id = uuidv4();
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

const EMPTY_SESSIONS: PaginatedChatSessionsResponse = {
  items: [],
  rowCount: 0,
  pageCount: 0,
  pageIndex: 0,
  pageSize: 0,
};

function unwrapData<T>(body: unknown): T {
  const api = body as ApiResponse<T>;
  return api.data as T;
}

async function fetchSessions(
  apiUrl: string,
  apiKey: string,
  visitorId: string,
): Promise<PaginatedChatSessionsResponse> {
  const url = `${apiUrl}/sessions/visitor/${visitorId}`;

  try {
    const res = await fetch(url, {
      headers: { "x-api-key": apiKey },
    });
    if (!res.ok) {
      return EMPTY_SESSIONS;
    }
    return unwrapData(await res.json());
  } catch {
    return EMPTY_SESSIONS;
  }
}

async function fetchSessionMessages(
  apiUrl: string,
  apiKey: string,
  sessionId: string,
  visitorId: string,
): Promise<unknown[]> {
  const url = `${apiUrl}/sessions/${sessionId}/messages/${visitorId}`;

  try {
    const res = await fetch(url, {
      headers: { "x-api-key": apiKey },
    });
    if (!res.ok) return [];
    return unwrapData<unknown[]>(await res.json());
  } catch {
    return [];
  }
}

async function getOrCreateActiveSession(apiUrl: string, apiKey: string): Promise<ChatSessionResponse | null> {
  const visitorId = await getOrCreateVisitorId();
  const storedId = await getActiveSessionId();
  const sessions = await fetchSessions(apiUrl, apiKey, visitorId);

  if (storedId) {
    const match = sessions.items.find((s) => s.id === storedId);
    if (match) return match;
  }

  return createSession(apiUrl, apiKey, visitorId);
}

async function createSession(
  apiUrl: string,
  apiKey: string,
  visitorId: string,
  externalUserId?: string,
): Promise<ChatSessionResponse | null> {
  const sessionId = uuidv4();
  const url = `${apiUrl}/sessions/create/${sessionId}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({ visitorId, externalUserId } satisfies CreateChatSessionRequest),
    });
    if (!res.ok) return null;
    const session = unwrapData<ChatSessionResponse>(await res.json());
    if (!session.id) return null;
    await saveActiveSessionId(session.id);
    return session;
  } catch {
    return null;
  }
}

export {
  getOrCreateVisitorId,
  getActiveSessionId,
  saveActiveSessionId,
  fetchSessions,
  fetchSessionMessages,
  getOrCreateActiveSession,
  createSession,
};
