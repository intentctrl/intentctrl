export interface ChatSessionResponse {
  id: string;
  projectId: string;
  projectSlug: string;
  externalUserId: string | null;
  visitorId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatSessionRequest {
  visitorId: string;
  externalUserId?: string;
}

export interface PaginatedChatSessionsResponse {
  items: ChatSessionResponse[];
  rowCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
