import * as React from "react";
export interface UsePaginationOptions { total: number; pageSize?: number; initialPage?: number; }
export interface UsePaginationReturn { page: number; pageSize: number; totalPages: number; from: number; to: number; canPrev: boolean; canNext: boolean; setPage: (p: number) => void; prev: () => void; next: () => void; }
export function usePagination({ total, pageSize = 10, initialPage = 1 }: UsePaginationOptions): UsePaginationReturn {
  const [page, setPageState] = React.useState(initialPage);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const setPage = (p: number) => setPageState(Math.min(Math.max(1, p), totalPages));
  return { page, pageSize, totalPages, from: (page-1)*pageSize+1, to: Math.min(page*pageSize, total), canPrev: page>1, canNext: page<totalPages, setPage, prev: () => setPage(page-1), next: () => setPage(page+1) };
}
