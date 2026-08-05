import { type ChangeEvent, type DragEvent, useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ImagePlus, LoaderCircle, ScanLine, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { recognizeFormulaImage } from "@/features/editor/api/recognize-image";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface ImageRecognizerProps {
  onRecognized: (latex: string) => void;
}

function readImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) return Promise.reject(new Error("请选择有效图片"));
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("图片读取失败"));
    reader.onerror = () => reject(new Error("图片读取失败"));
    reader.readAsDataURL(file);
  });
}

export function ImageRecognizer({ onRecognized }: ImageRecognizerProps) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const mutation = useMutation({
    mutationFn: recognizeFormulaImage,
    onSuccess: (latex) => {
      onRecognized(latex);
      toast.success(t("synced"));
    },
    onError: (error) => toast.info(error.message === "OCR_API_MISSING" ? t("ocrApiMissing") : t("ocrFailed")),
  });

  const loadFile = (file: File) => {
    void readImage(file)
      .then(setImageUrl)
      .catch(() => toast.error(t("imageReadError")));
  };

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const file = Array.from(event.clipboardData?.files ?? []).find((item) => item.type.startsWith("image/"));
      if (file) loadFile(file);
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  });

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) loadFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) loadFile(file);
  };

  return (
    <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <div
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          "relative grid min-h-64 place-items-center overflow-hidden rounded-2xl border-2 border-dashed bg-muted/20 p-5 transition-colors",
          dragging ? "border-primary bg-primary/7" : "border-border hover:border-primary/40",
        )}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={t("imageReady")} className="max-h-80 max-w-full rounded-xl object-contain shadow-lg" />
        ) : (
          <div className="max-w-sm text-center">
            <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
              <ImagePlus className="size-6" />
            </div>
            <p className="font-medium">{t("dropTitle")}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("dropHint")}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between gap-5 rounded-2xl border border-border bg-muted/20 p-4">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><ScanLine className="size-4 text-primary" />{t("imageRecognition")}</div>
          <ol className="space-y-2 text-xs leading-5 text-muted-foreground">
            <li>1. {t("upload")}</li>
            <li>2. {t("imageReady")}</li>
            <li>3. {t("recognize")}</li>
          </ol>
        </div>
        <div className="grid gap-2">
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleInput} />
          <Button variant="outline" onClick={() => inputRef.current?.click()}><Upload />{t("upload")}</Button>
          <Button disabled={!imageUrl || mutation.isPending} onClick={() => imageUrl && mutation.mutate(imageUrl)}>
            {mutation.isPending ? <LoaderCircle className="animate-spin" /> : <ScanLine />}
            {mutation.isPending ? t("recognizing") : t("recognize")}
          </Button>
          <Button variant="ghost" disabled={!imageUrl} onClick={() => setImageUrl(null)}><Trash2 />{t("removeImage")}</Button>
        </div>
      </div>
    </div>
  );
}
