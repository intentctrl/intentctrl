export interface ApiResponse<T = unknown> {
  status: number;
  success: boolean;
  data: T;
  message: string;
}
