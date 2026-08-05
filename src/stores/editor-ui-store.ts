import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type CategoryTag } from "@/features/editor/types/editor";
import { type Locale } from "@/lib/i18n";

export type ThemePreference = "light" | "dark" | "system";
export type PaneLayout = "split" | "stacked";
export type FormulaAlignment = "left" | "center" | "right";

interface EditorUiState {
  theme: ThemePreference;
  locale: Locale;
  layout: PaneLayout;
  alignment: FormulaAlignment;
  previewScale: number;
  sourceFontSize: number;
  activeCategory: CategoryTag;
  symbolPanelOpen: boolean;
  settingsOpen: boolean;
  setTheme: (theme: ThemePreference) => void;
  setLocale: (locale: Locale) => void;
  setLayout: (layout: PaneLayout) => void;
  setAlignment: (alignment: FormulaAlignment) => void;
  setPreviewScale: (scale: number) => void;
  setSourceFontSize: (size: number) => void;
  setActiveCategory: (category: CategoryTag) => void;
  setSymbolPanelOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
}

function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const language = (navigator.languages[0] ?? navigator.language).toLowerCase();
  if (/^zh-(tw|hk|mo|hant)/.test(language)) return "zh-TW";
  if (language.startsWith("zh")) return "zh-CN";
  if (language.startsWith("ja")) return "ja";
  return "en";
}

export const useEditorUiStore = create<EditorUiState>()(
  persist(
    (set) => ({
      theme: "system",
      locale: detectBrowserLocale(),
      layout: "split",
      alignment: "center",
      previewScale: 1,
      sourceFontSize: 16,
      activeCategory: "symbol",
      symbolPanelOpen: true,
      settingsOpen: false,
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
      setLayout: (layout) => set({ layout }),
      setAlignment: (alignment) => set({ alignment }),
      setPreviewScale: (previewScale) => set({ previewScale }),
      setSourceFontSize: (sourceFontSize) => set({ sourceFontSize }),
      setActiveCategory: (activeCategory) => set({ activeCategory }),
      setSymbolPanelOpen: (symbolPanelOpen) => set({ symbolPanelOpen }),
      setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
    }),
    {
      name: "latexlive-ui",
      partialize: ({ theme, locale, layout, alignment, previewScale, sourceFontSize }) => ({
        theme,
        locale,
        layout,
        alignment,
        previewScale,
        sourceFontSize,
      }),
    },
  ),
);
