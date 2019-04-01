export interface SqlQueryRequest {
  limit?: number;
  offset?: number;
  q?: string;
}

export interface SqlQueryResponse {
  data: any[];
  count: number;
}


