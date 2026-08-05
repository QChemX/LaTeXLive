import { type PropsWithChildren, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEditorUiStore } from "@/stores/editor-ui-store";
import { translate } from "@/lib/i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ThemeSynchronizer() {
  const theme = useEditorUiStore((state) => state.theme);
  const locale = useEditorUiStore((state) => state.locale);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const isDark = theme === "dark" || (theme === "system" && media.matches);
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    };

    applyTheme();
    document.documentElement.lang = locale;
    document.title = `LaTeX Live · ${translate(locale, "brandTagline")}`;
    media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, [locale, theme]);

  return null;
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={300}>
        <ThemeSynchronizer />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
}
