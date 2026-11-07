import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "../../../i18n/useI18n";
import { Button } from "../Button";
import { useToast } from "../Toast";

const CHECK_MS = 2000;

export function ErrorCode({ code }: { code: string }) {
  const { t } = useI18n();
  const toast = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const timer = setTimeout(() => setIsCopied(false), CHECK_MS);
    return () => clearTimeout(timer);
  }, [isCopied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setHasFailed(false);
      setIsCopied(true);
      toast.show({ tone: "info", title: t("error.codeCopied") });
    } catch {
      // No clipboard (permissions, insecure context): let the code be selected by hand.
      setHasFailed(true);
      toast.show({ tone: "info", title: t("error.copyFailed") });
    }
  };

  return (
    <Button
      variant="text"
      className={hasFailed ? "error-code error-code--select" : "error-code"}
      icon={isCopied ? <Check aria-hidden /> : <Copy aria-hidden />}
      aria-label={t("error.copyCode", { code })}
      onClick={() => void copy()}
    >
      {t("error.code", { code })}
    </Button>
  );
}
