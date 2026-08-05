import { useEffect, useState } from "react";
import { ArrowLeft, BookOpenText, Languages, Moon, Sigma, Sun } from "lucide-react";
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
import { docsByLanguage, type DocsLanguage } from "@/features/docs/data/docs-content";
import { useEditorUiStore } from "@/stores/editor-ui-store";
import { useI18n } from "@/lib/i18n";

export function DocsPage() {
  const navigate = useNavigate();
  const { locale } = useI18n();
  const [language, setLanguage] = useState<DocsLanguage>(locale === "zh-CN" ? "zh-CN" : "en");
  const theme = useEditorUiStore((state) => state.theme);
  const setTheme = useEditorUiStore((state) => state.setTheme);
  const content = docsByLanguage[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = `${content.title} · LaTeX Live`;
    return () => {
      document.documentElement.lang = locale;
      document.title = "LaTeX Live · Online LaTeX Formula Editor";
    };
  }, [content.title, language, locale]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-3 sm:h-16 sm:px-6 lg:px-8">
          <button type="button" onClick={() => void navigate({ to: "/" })} className="flex items-center gap-2 text-left">
            <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm sm:size-9">
              <Sigma className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold sm:text-base">LaTeX Live</span>
              <span className="hidden text-[11px] text-muted-foreground sm:block">{content.title}</span>
            </span>
          </button>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="px-2 sm:px-3"
              onClick={() => void navigate({ to: "/" })}
              aria-label={content.backLabel}
            >
              <ArrowLeft />
              <span className="hidden sm:inline">{content.backLabel}</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={content.languageLabel}><Languages /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{content.languageLabel}</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value as DocsLanguage)}>
                  <DropdownMenuRadioItem value="zh-CN">简体中文</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={content.themeLabel}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-7 border-b border-border pb-7 sm:mb-10 sm:pb-9">
          <div className="mb-4 grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
            <BookOpenText className="size-5" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">{content.title}</h1>
        </div>

        <div className="grid min-w-0 items-start gap-8 overflow-hidden lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12 lg:overflow-visible">
          <aside className="min-w-0 top-24 lg:sticky">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{content.contentsLabel}</p>
            <nav className="flex w-full max-w-full gap-2 overflow-x-auto pb-2 scrollbar-none lg:flex-col lg:overflow-visible">
              {content.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="shrink-0 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground transition hover:border-primary/30 hover:bg-primary/7 hover:text-primary lg:border-transparent lg:bg-transparent lg:text-sm"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <article className="min-w-0 space-y-5 sm:space-y-6">
            {content.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-7">
                <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{section.lead}</p>
                {section.items ? (
                  <ul className="mt-4 space-y-2.5 text-sm leading-6 text-foreground/85">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {section.note ? (
                  <div className="mt-5 rounded-xl border border-primary/20 bg-primary/7 px-4 py-3 text-sm leading-6 text-foreground/85">
                    <span className="mr-2 font-semibold text-primary">{content.noteLabel}</span>
                    {section.note}
                  </div>
                ) : null}
                {section.examples ? (
                  <div className="mt-5 grid gap-3">
                    {section.examples.map((example) => (
                      <div key={example.label} className="overflow-hidden rounded-xl border border-border bg-slate-950">
                        <div className="border-b border-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          {content.exampleLabel} · {example.label}
                        </div>
                        <pre className="overflow-x-auto p-4 text-xs leading-6 text-slate-100 sm:text-sm">
                          <code>{example.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            ))}
          </article>
        </div>
      </main>
    </div>
  );
}
