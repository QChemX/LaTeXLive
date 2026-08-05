import { BookOpenText, Languages, Moon, Settings2, Sigma, Sun } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useEditorUiStore } from "@/stores/editor-ui-store";
import { localeLabels, useI18n, type Locale } from "@/lib/i18n";

export function AppHeader() {
  const navigate = useNavigate();
  const { locale, t } = useI18n();
  const theme = useEditorUiStore((state) => state.theme);
  const setTheme = useEditorUiStore((state) => state.setTheme);
  const setLocale = useEditorUiStore((state) => state.setLocale);
  const setSettingsOpen = useEditorUiStore((state) => state.setSettingsOpen);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-2 sm:h-16 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm sm:size-9">
            <Sigma className="size-5" strokeWidth={2.25} />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight sm:text-lg">LaTeX Live</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">{t("brandTagline")}</p>
          </div>
        </div>

        <div className="flex items-center gap-0 sm:gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 sm:size-9"
                onClick={() => void navigate({ to: "/docs" })}
                aria-label={t("documentation")}
              >
                <BookOpenText />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("documentation")}</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8 sm:size-9" aria-label={t("language")}><Languages /></Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>{t("language")}</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={locale} onValueChange={(value) => setLocale(value as Locale)}>
                {(Object.entries(localeLabels) as Array<[Locale, string]>).map(([value, label]) => (
                  <DropdownMenuRadioItem key={value} value={value}>{label}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 sm:size-9" onClick={toggleTheme} aria-label={t("theme")}>
                {theme === "dark" ? <Sun /> : <Moon />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("theme")}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 sm:size-9"
                aria-label={t("github")}
                onClick={() => window.open("https://github.com/QChemX/LaTeXLive", "_blank", "noopener,noreferrer")}
              >
                <FaGithub className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("github")}</TooltipContent>
          </Tooltip>
          <Button variant="outline" size="icon" className="ml-0 size-8 sm:ml-1 sm:size-9 md:w-auto md:px-3" onClick={() => setSettingsOpen(true)} aria-label={t("settings")}>
            <Settings2 />
            <span className="hidden md:inline">{t("settings")}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
