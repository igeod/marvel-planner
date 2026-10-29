import { Mail, Save } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { useState, type FormEvent } from "react";
import { TextField } from "../../../../components/ui/Field";
import { useI18n } from "../../../../i18n/useI18n";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useAuthAction } from "../../../auth/hooks/useAuthAction";
import { isValidEmail } from "../../../../lib/validation";
import type { User } from "../../../auth/types";

interface ProfileSectionProps {
  user: User;
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const { t } = useI18n();
  const { updateName, updateEmail } = useAuth();
  const { run, error, isPending, isDone } = useAuthAction(updateName);
  const emailAction = useAuthAction(updateEmail);
  const [email, setEmail] = useState(user.email);
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [name, setName] = useState(user.name);
  const [isTouched, setIsTouched] = useState(false);

  const trimmedName = name.trim();
  const hasChanges = trimmedName !== user.name;

  const trimmedEmail = email.trim();
  const emailChanged = trimmedEmail !== user.email;
  const emailValid = isValidEmail(trimmedEmail);

  const handleEmailSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (emailChanged && emailValid) void emailAction.run(trimmedEmail);
  };

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
      <form onSubmit={handleEmailSubmit} noValidate className="profile-section__second">
        <TextField
          label={t("account.profile.email")}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={setEmail}
          onBlur={() => setIsEmailTouched(true)}
          error={isEmailTouched && !emailValid ? t("auth.errors.invalidEmail") : null}
        />
        <div className="profile-section__actions">
          <Button
            type="submit"
            variant="primary"
            icon={<Mail aria-hidden />}
            isLoading={emailAction.isPending}
            loadingLabel={t("account.profile.saving")}
            disabled={!emailChanged || !emailValid}
          >
            {t("account.profile.emailSave")}
          </Button>
          {emailAction.error && <p role="alert">{emailAction.error}</p>}
          {emailAction.isDone && !emailChanged && (
            <p role="status">{t("account.profile.emailSaved")}</p>
          )}
        </div>
      </form>
    </section>
  );
}
