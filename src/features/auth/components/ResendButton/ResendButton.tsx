import { Button } from "../../../../components/ui/Button";
import { Status } from "../../../../components/ui/Status";
import { useAuthAction } from "../../hooks/useAuthAction";

interface ResendButtonProps {
  onResend: () => Promise<void>;
  label: string;
  waitText: string;
  doneText: string;
}

// Resend never counts down on its own: the wait comes from the server's 429 answer.
export function ResendButton({ onResend, label, waitText, doneText }: ResendButtonProps) {
  const { run, error, isPending, isBlocked, isDone } = useAuthAction<void>(onResend);

  return (
    <>
      <Button
        variant="soft"
        size="lg"
        isLoading={isPending}
        disabled={isBlocked}
        onClick={() => void run()}
      >
        {label}
      </Button>
      <Status>{isBlocked ? waitText : isDone ? doneText : (error ?? "")}</Status>
    </>
  );
}
