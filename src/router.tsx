import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import axios from "axios";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Don't retry on 4xx errors — they won't resolve on retry
        retry: (failureCount, error) => {
          if (axios.isAxiosError(error)) {
            const status = error.response?.status ?? 0;
            if (status >= 400 && status < 500) return false;
          }
          return failureCount < 2;
        },
        // Keep data fresh for 30s
        staleTime: 30_000,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
