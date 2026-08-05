import { type ReactNode, type RefObject } from "react";
import { Braces, ChevronDown, CodeXml, FileImage, Link2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  copyText,
  downloadRaster,
  downloadSvg,
  latexToAsciiMath,
  latexToMathML,
  latexToOmml,
  latexToTypst,
  mathMLWithAttribute,
  prefixMathML,
  serializeSvg,
} from "@/features/editor/lib/export-formula";
import { useI18n } from "@/lib/i18n";
import { type Locale } from "@/lib/i18n";

interface ExportActionsProps {
  latex: string;
  previewRef: RefObject<HTMLDivElement | null>;
}

type AsyncAction = () => void | Promise<void>;

interface ActionMenuProps {
  icon: typeof FileImage;
  label: string;
  children: ReactNode;
  primary?: boolean;
}

function ActionMenu({ icon: Icon, label, children, primary = false }: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={primary ? "default" : "outline"} className="flex-1 sm:flex-none">
          <Icon />{label}<ChevronDown className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const formatLabels: Record<Locale, {
  htmlInline: string;
  htmlBlock: string;
  slash: string;
  dollarInline: string;
  dollarBlock: string;
  parenInline: string;
  bracketBlock: string;
  json: string;
}> = {
  "zh-CN": { htmlInline: "HTML 行内公式", htmlBlock: "HTML 独立公式", slash: "转义反斜杠", dollarInline: "行内公式", dollarBlock: "独立公式", parenInline: "行内公式", bracketBlock: "独立公式", json: "JSON 字符串" },
  "zh-TW": { htmlInline: "HTML 行內公式", htmlBlock: "HTML 獨立公式", slash: "跳脫反斜線", dollarInline: "行內公式", dollarBlock: "獨立公式", parenInline: "行內公式", bracketBlock: "獨立公式", json: "JSON 字串" },
  en: { htmlInline: "HTML inline formula", htmlBlock: "HTML block formula", slash: "Escape backslashes", dollarInline: "Inline formula", dollarBlock: "Block formula", parenInline: "Inline formula", bracketBlock: "Block formula", json: "JSON string" },
  ja: { htmlInline: "HTML インライン数式", htmlBlock: "HTML ブロック数式", slash: "バックスラッシュをエスケープ", dollarInline: "インライン数式", dollarBlock: "ブロック数式", parenInline: "インライン数式", bracketBlock: "ブロック数式", json: "JSON 文字列" },
};

export function ExportActions({ latex, previewRef }: ExportActionsProps) {
  const { locale, t } = useI18n();
  const labels = formatLabels[locale];
  const withFeedback = (successMessage: string, action: AsyncAction) => {
    void Promise.resolve()
      .then(action)
      .then(() => toast.success(successMessage))
      .catch(() => toast.error(t("operationFailed")));
  };

  const getPreview = () => {
    if (!previewRef.current) throw new Error(t("formulaRequired"));
    return previewRef.current;
  };

  const getShareUrl = () => {
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("formula", latex);
    return url.toString();
  };

  const copyGenerated = (label: string, generate: () => string | Promise<string>) => {
    withFeedback(`${label} ✓`, async () => copyText(await generate()));
  };

  const copyMathMlVariant = (label: string, transform: (mathml: string) => string) => {
    copyGenerated(label, async () => transform(await latexToMathML(latex)));
  };

  const shareNative = async () => {
    const url = getShareUrl();
    if (navigator.share) {
      await navigator.share({ title: "LaTeX Live", text: latex, url });
      return;
    }
    await copyText(url);
  };

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-card sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 px-1">
        <div className="grid size-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Share2 className="size-4" />
        </div>
        <h2 className="text-sm font-semibold">{t("exportShare")}</h2>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
        <ActionMenu icon={FileImage} label={t("outputImage")}>
          <DropdownMenuItem onSelect={() => withFeedback("SVG ✓", () => downloadSvg(getPreview()))}>.svg</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => withFeedback("PNG ✓", () => downloadRaster(getPreview(), "png"))}>.png</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => withFeedback("JPG ✓", () => downloadRaster(getPreview(), "jpeg"))}>.jpg</DropdownMenuItem>
        </ActionMenu>

        <ActionMenu icon={CodeXml} label={t("outputCode")}>
          <DropdownMenuItem onSelect={() => copyGenerated("LaTeX", () => latex)}>LaTeX</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => copyGenerated("ASCIIMath", () => latexToAsciiMath(latex))}>ASCIIMath</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => copyGenerated("Typst", () => latexToTypst(latex))}>Typst</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => copyGenerated("HTML inline", () => `<span class="math">\\(${latex}\\)</span>`)}>{labels.htmlInline}</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => copyGenerated("HTML block", () => `<div class="math">\\[${latex}\\]</div>`)}>{labels.htmlBlock}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => copyGenerated("MathML", () => latexToMathML(latex))}>MathML</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => copyMathMlVariant("MathML(mml:)", (value) => prefixMathML(value, "mml"))}>MathML (mml:)</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => copyMathMlVariant("MathML(m:)", (value) => prefixMathML(value, "m"))}>MathML (m:)</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => copyMathMlVariant("MathML(attr:)", mathMLWithAttribute)}>MathML (attr:)</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => copyGenerated("OMML", () => latexToOmml(latex))}>OMML</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => copyGenerated("SVG Code", () => serializeSvg(getPreview()))}>SVG Code</DropdownMenuItem>
        </ActionMenu>

        <ActionMenu icon={Braces} label={t("escape")}>
          <DropdownMenuItem onSelect={() => copyGenerated("\\ → \\\\ ", () => latex.replace(/\\/g, "\\\\"))}>
            <code>{String.raw`\ → \\`}</code> {labels.slash}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => copyGenerated("$...$", () => `$${latex}$`)}><code>$...$</code> {labels.dollarInline}</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => copyGenerated("$$...$$", () => `$$${latex}$$`)}><code>$$...$$</code> {labels.dollarBlock}</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => copyGenerated("\\(...\\)", () => `\\(${latex}\\)`)}><code>\(...\)</code> {labels.parenInline}</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => copyGenerated("\\[...\\]", () => `\\[${latex}\\]`)}><code>\[...\]</code> {labels.bracketBlock}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => copyGenerated("JSON", () => JSON.stringify(latex))}>{labels.json}</DropdownMenuItem>
        </ActionMenu>

        <ActionMenu icon={Link2} label={t("share")} primary>
          <DropdownMenuItem onSelect={() => withFeedback(t("copyShareUrl"), () => copyText(getShareUrl()))}><Link2 />{t("copyShareUrl")}</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => withFeedback(t("systemShare"), shareNative)}><Share2 />{t("systemShare")}</DropdownMenuItem>
        </ActionMenu>
      </div>
    </section>
  );
}
