import { Mail, Save } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "../../../../components/ui/Button";
import { TextField } from "../../../../components/ui/Field";
import { Status } from "../../../../components/ui/Status";
import { useI18n } from "../../../../i18n/useI18n";
import { isValidEmail } from "../../../../lib/validation";
import { MIN_NAME_LENGTH } from "../../../auth/constants";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useAuthAction } from "../../../auth/hooks/useAuthAction";
import type { User } from "../../../auth/types";
import { useReportDirty } from "../../hooks/useReportDirty";

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
  // Why a submit was refused; cleared as soon as the field changes.
  const [nameReason, setNameReason] = useState("");
  const [emailReason, setEmailReason] = useState("");

  const trimmedName = name.trim();
  const hasChanges = trimmedName !== user.name;
  const canSaveName = hasChanges && trimmedName.length >= MIN_NAME_LENGTH;

  const trimmedEmail = email.trim();
  const emailChanged = trimmedEmail !== user.email;
  const emailValid = isValidEmail(trimmedEmail);
  const canSaveEmail = emailChanged && emailValid;

  useReportDirty("name", hasChanges);
  useReportDirty("email", emailChanged);

  const handleEmailSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSaveEmail) return setEmailReason(t("account.dialog.invalidEmail"));
    void emailAction.run(trimmedEmail);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSaveName) return setNameReason(t("account.dialog.invalidName"));
    void run(trimmedName);
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
          onChange={(value) => {
            setName(value);
            setNameReason("");
          }}
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
            aria-disabled={!canSaveName}
          >
            {t("account.profile.save")}
          </Button>
          {error && <p role="alert">{error}</p>}
          <Status>{nameReason || (isDone && !hasChanges ? t("account.profile.saved") : "")}</Status>
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
          onChange={(value) => {
            setEmail(value);
            setEmailReason("");
          }}
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
            aria-disabled={!canSaveEmail}
          >
            {t("account.profile.emailSave")}
          </Button>
          {emailAction.error && <p role="alert">{emailAction.error}</p>}
          <Status>
            {emailReason ||
              (emailAction.isDone && !emailChanged ? t("account.profile.emailSaved") : "")}
          </Status>
        </div>
      </form>
    </section>
  );
}
