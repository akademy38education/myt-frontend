import * as React from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { cn } from "@/utils/cn";

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMb?: number;
  files: File[];
  onFilesChange: (files: File[]) => void;
  className?: string;
}

export function FileUpload({ accept, multiple = false, maxSizeMb = 25, files, onFilesChange, className }: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState<string | null>(null);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const incoming = Array.from(fileList);
    const tooLarge = incoming.find((f) => f.size > maxSizeMb * 1024 * 1024);
    if (tooLarge) {
      setError(`"${tooLarge.name}" exceeds the ${maxSizeMb}MB limit`);
      return;
    }
    setError(null);
    onFilesChange(multiple ? [...files, ...incoming] : incoming.slice(0, 1));
  }

  return (
    <div className={cn("space-y-2", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input bg-muted/30 px-6 py-8 text-center transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <UploadCloud className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        <span className="text-sm text-muted-foreground">
          Click to upload or drag and drop {accept ? `(${accept})` : ""}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="sr-only"
        />
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {files.length > 0 && (
        <ul className="space-y-1">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              <span className="flex items-center gap-2 truncate">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{file.name}</span>
              </span>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={() => onFilesChange(files.filter((_, i) => i !== index))}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
