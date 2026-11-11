import { use, useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "../../../../components/ui/Button/Button";
import { FormError } from "../../../../components/ui/FormError/FormError";
import { EmailSuggestion } from "../../../../components/ui/Field/EmailSuggestion";
import { TextField } from "../../../../components/ui/Field/Field";
import { Status } from "../../../../components/ui/Status/Status";
import type { TranslationKey } from "../../../../i18n/types";
import { useI18n } from "../../../../i18n/useI18n";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useAuthAction } from "../../../auth/hooks/useAuthAction";
import { isValidEmail, suggestEmail } from "../../../../lib/validation";
import type { User } from "../../../auth/types";
import { RevealContext, useReportDirty, useReportPending } from "../../hooks/useReportDirty";

const MIN_NAME_LENGTH = 3;

// Server answers that belong to a field; any other answer goes in the form's error row.
const NAME_CODES: TranslationKey[] = ["auth.errors.nameTaken", "auth.errors.invalidName"];
const EMAIL_CODES: TranslationKey[] = ["auth.errors.invalidEmail", "auth.errors.emailTaken"];

interface Feedback {
  kind: "error" | "note";
  text: string;
}

interface ProfileSectionProps {
  user: User;
  // The Profile tab is the visible one; leaving it clears the success messages.
  isActive: boolean;
}

export function ProfileSection({ user, isActive }: ProfileSectionProps) {
  const { t } = useI18n();
  const { updateName, updateEmail } = useAuth();
  const reveal = use(RevealContext);
  const nameAction = useAuthAction(updateName);
  const emailAction = useAuthAction(updateEmail);
  const [email, setEmail] = useState(user.email);
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [name, setName] = useState(user.name);
  const [isTouched, setIsTouched] = useState(false);
  // Why a submit was refused on the client; cleared as soon as the field changes.
  const [nameFeedback, setNameFeedback] = useState<Feedback | null>(null);
  const [emailFeedback, setEmailFeedback] = useState<Feedback | null>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const nameActions = useRef<HTMLDivElement>(null);
  const emailActions = useRef<HTMLDivElement>(null);

  const trimmedName = name.trim();
  const hasChanges = trimmedName !== user.name;
  const canSaveName = hasChanges && trimmedName.length >= MIN_NAME_LENGTH;

  const trimmedEmail = email.trim();
  const emailChanged = trimmedEmail !== user.email;
  const emailValid = isValidEmail(trimmedEmail);
  const [isEmailLeft, setIsEmailLeft] = useState(false);
  const suggestion = isEmailLeft ? suggestEmail(trimmedEmail) : null;
  const canSaveEmail = emailChanged && emailValid;

  useReportDirty("name", hasChanges);
  useReportDirty("email", emailChanged);
  useReportPending("name", nameAction.isPending);
  useReportPending("email", emailAction.isPending);

  const { reset: resetName, isPending: isNamePending, errorCode: nameCode } = nameAction;
  const { reset: resetEmail, isPending: isEmailPending, errorCode: emailCode } = emailAction;

  useEffect(() => {
    if (isActive) return;
    if (!isNamePending) resetName();
    if (!isEmailPending) resetEmail();
  }, [isActive, isNamePending, isEmailPending, resetName, resetEmail]);

  // After a server answer that belongs to a field, the focus goes to that field.
  useEffect(() => {
    if (nameCode && NAME_CODES.includes(nameCode)) nameInput.current?.focus();
  }, [nameCode]);
  useEffect(() => {
    if (emailCode && EMAIL_CODES.includes(emailCode)) emailInput.current?.focus();
  }, [emailCode]);

  // On a phone the message must not end up behind the keyboard or the unsaved-changes banner.
  useEffect(() => {
    if (nameAction.resultId > 0) reveal(nameActions.current);
  }, [nameAction.resultId, reveal]);
  useEffect(() => {
    if (emailAction.resultId > 0) reveal(emailActions.current);
  }, [emailAction.resultId, reveal]);

  const refuseName = (feedback: Feedback, focus: boolean) => {
    setNameFeedback(feedback);
    if (focus) nameInput.current?.focus();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (nameAction.isPending) return;
    setIsTouched(true);
    if (!trimmedName) return refuseName({ kind: "error", text: t("auth.errors.required") }, true);
    if (trimmedName.length < MIN_NAME_LENGTH) {
      return refuseName(
        { kind: "error", text: t("account.profile.errors.nameShort", { min: MIN_NAME_LENGTH }) },
        true,
      );
    }
    // Nothing changed: the button is already off and says why to a screen reader; no message.
    if (!hasChanges) return;
    void nameAction.run(trimmedName);
  };

  const handleEmailSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (emailAction.isPending) return;
    setIsEmailTouched(true);
    if (!emailValid) {
      setEmailFeedback({ kind: "error", text: t("auth.errors.invalidEmail") });
      return emailInput.current?.focus();
    }
    if (!emailChanged) {
      return setEmailFeedback({ kind: "note", text: t("account.profile.errors.emailUnchanged") });
    }
    void emailAction.run(trimmedEmail);
  };

  const nameServerError = nameCode && NAME_CODES.includes(nameCode) ? nameAction.error : null;
  const emailServerError = emailCode && EMAIL_CODES.includes(emailCode) ? emailAction.error : null;
  const nameFormError = nameAction.error && !nameServerError ? nameAction.error : null;
  const emailFormError = emailAction.error && !emailServerError ? emailAction.error : null;

  const nameError =
    (nameFeedback?.kind === "error" ? nameFeedback.text : null) ??
    nameServerError ??
    (isTouched && !trimmedName ? t("auth.errors.required") : null);
  const emailError =
    (emailFeedback?.kind === "error" ? emailFeedback.text : null) ??
    emailServerError ??
    (isEmailTouched && !emailValid ? t("auth.errors.invalidEmail") : null);

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
          inputRef={nameInput}
          onChange={(value) => {
            setName(value);
            setNameFeedback(null);
            nameAction.reset();
          }}
          onBlur={() => setIsTouched(true)}
          hint={t("auth.nameHint")}
          note={nameFeedback?.kind === "note" ? nameFeedback.text : undefined}
          error={nameError}
        />
        {nameFormError && <FormError>{nameFormError}</FormError>}
        <div className="profile-section__actions" ref={nameActions}>
          <Button
            type="submit"
            variant="primary"
            isLoading={nameAction.isPending}
            loadingLabel={t("account.profile.saving")}
            aria-disabled={!canSaveName}
            aria-describedby={hasChanges ? undefined : "profile-name-nothing"}
          >
            {t("account.profile.save")}
          </Button>
          {!hasChanges && (
            <span id="profile-name-nothing" className="visually-hidden">
              {t("account.profile.nothingToSave")}
            </span>
          )}
          <Status tone="success" resultKey={nameAction.resultId}>
            {nameAction.isDone ? t("account.profile.saved") : ""}
          </Status>
        </div>
      </form>
      <hr className="profile__rule" />
      <form onSubmit={handleEmailSubmit} noValidate>
        <TextField
          label={t("account.profile.email")}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          inputRef={emailInput}
          onChange={(value) => {
            setEmail(value);
            setIsEmailLeft(false);
            setEmailFeedback(null);
            emailAction.reset();
          }}
          onBlur={() => {
            setIsEmailTouched(true);
            setIsEmailLeft(true);
          }}
          note={emailFeedback?.kind === "note" ? emailFeedback.text : undefined}
          error={emailError}
        />
        <EmailSuggestion
          suggestion={suggestion}
          onUse={(value) => {
            setEmail(value);
            setIsEmailLeft(false);
            setEmailFeedback(null);
            emailAction.reset();
          }}
        />
        {emailFormError && <FormError>{emailFormError}</FormError>}
        <div className="profile-section__actions" ref={emailActions}>
          <Button
            type="submit"
            variant="primary"
            isLoading={emailAction.isPending}
            loadingLabel={t("account.profile.saving")}
            aria-disabled={!canSaveEmail}
          >
            {t("account.profile.emailSave")}
          </Button>
          <Status tone="success" resultKey={emailAction.resultId}>
            {emailAction.isDone ? t("account.profile.emailSaved") : ""}
          </Status>
        </div>
      </form>
    </section>
  );
}
