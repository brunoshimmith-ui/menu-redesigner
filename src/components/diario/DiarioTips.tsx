import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Info, Lightbulb, AlertTriangle, X } from "lucide-react";

const STORAGE_KEY = "diario-tips-enabled";

export function useDiarioTips() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    const v = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    return v === null ? true : v === "1";
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  }, [enabled]);
  return { enabled, setEnabled };
}

export function TipsToggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Switch id="tips-toggle" checked={enabled} onCheckedChange={onChange} />
      <Label htmlFor="tips-toggle" className="cursor-pointer">
        Dicas importantes
      </Label>
    </div>
  );
}

type Variant = "info" | "tip" | "warn";

const variantStyles: Record<Variant, string> = {
  info: "border-blue-300 bg-blue-50 text-blue-900 dark:bg-blue-950/30 dark:text-blue-100 dark:border-blue-800",
  tip: "border-amber-300 bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-100 dark:border-amber-800",
  warn: "border-red-300 bg-red-50 text-red-900 dark:bg-red-950/30 dark:text-red-100 dark:border-red-800",
};

const variantIcon = {
  info: Info,
  tip: Lightbulb,
  warn: AlertTriangle,
};

export function TipBanner({
  variant = "tip",
  title,
  children,
  dismissKey,
}: {
  variant?: Variant;
  title: string;
  children: React.ReactNode;
  dismissKey?: string;
}) {
  const [dismissed, setDismissed] = useState(() => {
    if (!dismissKey || typeof window === "undefined") return false;
    return localStorage.getItem(`diario-tip-dismiss-${dismissKey}`) === "1";
  });
  if (dismissed) return null;
  const Icon = variantIcon[variant];
  return (
    <Alert className={`${variantStyles[variant]} py-2 pr-2`}>
      <Icon className="h-4 w-4" />
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <AlertTitle className="text-xs font-semibold mb-0.5">{title}</AlertTitle>
          <AlertDescription className="text-xs leading-relaxed">{children}</AlertDescription>
        </div>
        {dismissKey && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mt-1 shrink-0"
            onClick={() => {
              localStorage.setItem(`diario-tip-dismiss-${dismissKey}`, "1");
              setDismissed(true);
            }}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </Alert>
  );
}
