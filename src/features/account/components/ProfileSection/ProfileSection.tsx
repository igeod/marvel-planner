import { Save } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { useState, type FormEvent } from "react";
import { TextField } from "../../../../components/ui/Field";
import { useI18n } from "../../../../i18n/useI18n";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useAuthAction } from "../../../auth/hooks/useAuthAction";
import type { User } from "../../../auth/types";

interface ProfileSectionProps {
  user: User;
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const { t } = useI18n();
  const { updateName } = useAuth();
  const { run, error, isPending, isDone } = useAuthAction(updateName);
  const [name, setName] = useState(user.name);
  const [isTouched, setIsTouched] = useState(false);

  const trimmedName = name.trim();
  const hasChanges = trimmedName !== user.name;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (hasChanges && trimmedName) void run(trimmedName);
  };

  return (
    <section className="profile-section">
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label={t("auth.name")}
          name="name"
          autoComplete="nickname"
          required
          maxLength={30}
          value={name}
          onChange={setName}
          onBlur={() => setIsTouched(true)}
          error={isTouched && !trimmedName ? t("auth.errors.required") : null}
          hint={t("auth.nameHint")}
        />
        <div className="profile-section__actions">
          <Button
            type="submit"
            variant="primary"
            icon={<Save aria-hidden />}
            isLoading={isPending}
            loadingLabel={t("account.profile.saving")}
            disabled={!hasChanges || !trimmedName}
          >
            {t("account.profile.save")}
          </Button>
          {error && <p role="alert">{error}</p>}
          {isDone && !hasChanges && <p role="status">{t("account.profile.saved")}</p>}
        </div>
      </form>
      <dl className="profile-section__facts">
        <dt>{t("account.profile.email")}</dt>
        <dd>{user.email}</dd>
      </dl>
    </section>
  );
}
