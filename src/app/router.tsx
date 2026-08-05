import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import { z } from "zod";
import { EditorPage } from "@/features/editor/components/editor-page";
import { DocsPage } from "@/features/docs/components/docs-page";

const editorSearchSchema = z.object({
  formula: z.string().max(16384).optional().catch(undefined),
});

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: (search) => editorSearchSchema.parse(search),
  component: EditorRoute,
});

const docsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/docs",
  component: DocsPage,
});

function EditorRoute() {
  const { formula } = indexRoute.useSearch();
  return <EditorPage initialFormula={formula} />;
}

const routeTree = rootRoute.addChildren([indexRoute, docsRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
