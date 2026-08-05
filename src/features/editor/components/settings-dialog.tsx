import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Columns2, Monitor, Moon, RotateCcw, Rows3, Sun } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  getDefaultEditorPreferences,
  useEditorUiStore,
  type PaneLayout,
  type ThemePreference,
} from "@/stores/editor-ui-store";
import { useI18n, type MessageKey } from "@/lib/i18n";

const settingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  layout: z.enum(["split", "stacked"]),
  alignment: z.enum(["left", "center", "right"]),
  previewScale: z.number().min(0.7).max(1.8),
});

type SettingsValues = z.infer<typeof settingsSchema>;

const themes: Array<{ value: ThemePreference; label: MessageKey; icon: typeof Sun }> = [
  { value: "light", label: "light", icon: Sun },
  { value: "dark", label: "dark", icon: Moon },
  { value: "system", label: "system", icon: Monitor },
];

const layouts: Array<{ value: PaneLayout; label: MessageKey; icon: typeof Columns2 }> = [
  { value: "split", label: "split", icon: Columns2 },
  { value: "stacked", label: "stacked", icon: Rows3 },
];

export function SettingsDialog() {
  const { t } = useI18n();
  const open = useEditorUiStore((state) => state.settingsOpen);
  const setOpen = useEditorUiStore((state) => state.setSettingsOpen);
  const currentTheme = useEditorUiStore((state) => state.theme);
  const currentLayout = useEditorUiStore((state) => state.layout);
  const currentAlignment = useEditorUiStore((state) => state.alignment);
  const currentScale = useEditorUiStore((state) => state.previewScale);
  const setTheme = useEditorUiStore((state) => state.setTheme);
  const setLayout = useEditorUiStore((state) => state.setLayout);
  const setAlignment = useEditorUiStore((state) => state.setAlignment);
  const setPreviewScale = useEditorUiStore((state) => state.setPreviewScale);
  const restoreDefaultPreferences = useEditorUiStore((state) => state.restoreDefaultPreferences);

  const { register, handleSubmit, control, reset } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      theme: currentTheme,
      layout: currentLayout,
      alignment: currentAlignment,
      previewScale: currentScale,
    },
  });

  const selectedTheme = useWatch({ control, name: "theme" });
  const selectedLayout = useWatch({ control, name: "layout" });

  useEffect(() => {
    if (!open) return;
    reset({
      theme: currentTheme,
      layout: currentLayout,
      alignment: currentAlignment,
      previewScale: currentScale,
    });
  }, [currentAlignment, currentLayout, currentScale, currentTheme, open, reset]);

  const submit = (values: SettingsValues) => {
    setTheme(values.theme);
    setLayout(values.layout);
    setAlignment(values.alignment);
    setPreviewScale(values.previewScale);
    setOpen(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
  };

  const handleRestoreDefaults = () => {
    const defaults = getDefaultEditorPreferences();
    restoreDefaultPreferences();
    reset({
      theme: defaults.theme,
      layout: defaults.layout,
      alignment: defaults.alignment,
      previewScale: defaults.previewScale,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent closeLabel={t("close")}>
        <DialogHeader>
          <DialogTitle>{t("editorPreferences")}</DialogTitle>
          <DialogDescription>{t("preferenceHint")}</DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={(event) => void handleSubmit(submit)(event)}>
          <fieldset>
            <legend className="mb-2.5 text-sm font-medium">{t("appearance")}</legend>
            <div className="grid grid-cols-3 gap-2">
              {themes.map(({ value, label, icon: Icon }) => (
                <label
                  key={value}
                  className={cn(
                    "relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-3 text-xs transition",
                    selectedTheme === value ? "border-primary bg-primary/7 text-primary" : "border-border hover:bg-accent",
                  )}
                >
                  <input type="radio" value={value} className="sr-only" {...register("theme")} />
                  <Icon className="size-4" />
                  {t(label)}
                  {selectedTheme === value ? <Check className="absolute right-2 top-2 size-3.5" /> : null}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2.5 text-sm font-medium">{t("workspaceLayout")}</legend>
            <div className="grid grid-cols-2 gap-2">
              {layouts.map(({ value, label, icon: Icon }) => (
                <label
                  key={value}
                  className={cn(
                    "flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 text-sm transition",
                    selectedLayout === value ? "border-primary bg-primary/7 text-primary" : "border-border hover:bg-accent",
                  )}
                >
                  <input type="radio" value={value} className="sr-only" {...register("layout")} />
                  <Icon className="size-4" />
                  {t(label)}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              <span>{t("formulaAlignment")}</span>
              <select
                {...register("alignment")}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="left">{t("left")}</option>
                <option value="center">{t("center")}</option>
                <option value="right">{t("right")}</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>{t("previewScale")}</span>
              <select
                {...register("previewScale", { valueAsNumber: true })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="0.8">80%</option>
                <option value="1">100%</option>
                <option value="1.2">120%</option>
                <option value="1.5">150%</option>
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="outline" onClick={handleRestoreDefaults} className="sm:self-start">
              <RotateCcw />
              {t("restoreDefaults")}
            </Button>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>{t("cancel")}</Button>
              <Button type="submit">{t("save")}</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
