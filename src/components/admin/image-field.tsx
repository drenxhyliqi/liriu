"use client";

import * as React from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { useMarkDirty } from "@/components/admin/forms";
import type { ImageFit } from "@/types/catalog";
import { cn } from "@/lib/utils";

/**
 * Uploads straight away (so the preview is real) and keeps the resulting
 * path in a hidden `imageUrl` input for the surrounding form. Also owns the
 * `imageFit` choice since it only matters when there is an image.
 */
export function ImageField({
  defaultUrl,
  defaultFit,
  label = "Imazhi",
}: {
  defaultUrl: string | null;
  defaultFit: ImageFit;
  label?: string;
}) {
  const [url, setUrl] = React.useState(defaultUrl ?? "");
  const [fit, setFit] = React.useState<ImageFit>(defaultFit);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const markDirty = useMarkDirty();

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Zgjidhni një skedar imazhi (JPG, PNG, WebP).");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Ngarkimi dështoi.");
      setUrl(data.url);
      markDirty();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ngarkimi dështoi.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="sr-only">{label}</span>
      <input type="hidden" name="imageUrl" value={url} />
      <input type="hidden" name="imageFit" value={fit} />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
        }}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
        className={cn(
          "relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden border bg-surface/60",
          dragging ? "border-ink border-dashed bg-ink/[0.03]" : url ? "border-line" : "border-dashed border-ink/20",
        )}
      >
        {url ? (
          <Image
            src={url}
            alt=""
            fill
            sizes="384px"
            className={fit === "contain" ? "object-contain p-4" : "object-cover"}
          />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted transition-colors hover:text-ink"
          >
            <span className="flex h-11 w-11 items-center justify-center border border-line bg-paper">
              <ImagePlus aria-hidden className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <span className="text-[13px] font-medium text-ink">Ngarko një imazh</span>
            <span className="text-[12px]">ose tërhiqe këtu</span>
            <span className="text-[11px]">JPG, PNG ose WebP · deri në 15 MB</span>
          </button>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-paper/80">
            <Loader2 aria-hidden className="h-6 w-6 animate-spin text-ink" />
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-[12px] text-red">{error}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {url && (
          <>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex h-8 items-center gap-1.5 border border-line bg-paper px-2.5 text-[12px] font-medium text-ink transition-colors hover:bg-surface"
            >
              <Upload aria-hidden className="h-3.5 w-3.5" />
              Zëvendëso
            </button>
            <button
              type="button"
              onClick={() => {
                setUrl("");
                markDirty();
              }}
              disabled={uploading}
              className="inline-flex h-8 items-center gap-1.5 border border-line bg-paper px-2.5 text-[12px] font-medium text-red transition-colors hover:border-red/40 hover:bg-red/[0.04]"
            >
              <Trash2 aria-hidden className="h-3.5 w-3.5" />
              Hiq
            </button>
          </>
        )}
        <div className="ml-auto flex border border-line bg-paper p-0.5 text-[12px]" role="radiogroup" aria-label="Paraqitja e imazhit">
          {(
            [
              ["contain", "I plotë"],
              ["cover", "Mbush kornizën"],
            ] as const
          ).map(([value, text]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={fit === value}
              onClick={() => {
                setFit(value);
                markDirty();
              }}
              className={cn("h-7 px-2.5", fit === value ? "bg-ink font-medium text-paper" : "text-muted hover:text-ink")}
            >
              {text}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-muted">
        &ldquo;I plotë&rdquo; për produkte të prera pa sfond, &ldquo;Mbush kornizën&rdquo; për fotografi.
        Imazhi ruhet automatikisht si WebP i kompresuar.
      </p>
    </div>
  );
}
