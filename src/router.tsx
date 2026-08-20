import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { RouteLoading } from "@/components/myansan/RouteLoading";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultPreload: "intent",
    defaultPendingComponent: RouteLoading,
    defaultPendingMs: 0,
    defaultPendingMinMs: 300,
  });

  return router;
};
