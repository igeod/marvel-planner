import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { useId, useState, type HTMLInputTypeAttribute } from "react";
import { useI18n } from "../../../i18n/useI18n";

export interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  type?: HTMLInputTypeAttribute;
  hint?: string;
  error?: string | null;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  onBlur?: () => void;
}

function describedBy(...ids: (string | false | undefined | null)[]) {
  const present = ids.filter(Boolean);
  return present.length > 0 ? present.join(" ") : undefined;
}

export function TextField({
  label,
  name,
  value,
  onChange,
  autoComplete,
  type = "text",
  hint,
  error,
  required,
  maxLength,
  minLength,
  onBlur,
}: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const isEmail = type === "email";

  return (
    <div className="field">
      <div className="field__label">
        <label htmlFor={id}>{label}</label>
        {maxLength !== undefined && (
          <span className="field__counter" aria-hidden="true">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        autoCapitalize={isEmail ? "none" : undefined}
        spellCheck={isEmail ? false : undefined}
        inputMode={isEmail ? "email" : undefined}
        required={required}
        maxLength={maxLength}
        minLength={minLength}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(hint && hintId, error && errorId)}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
      />
      {hint && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field__error">
          <CircleAlert aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

export function PasswordField(props: Omit<FieldProps, "type">) {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const { label, name, value, onChange, autoComplete, hint, error, required, minLength, onBlur } =
    props;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={isVisible ? "text" : "password"}
        value={value}
        autoComplete={autoComplete}
        autoCapitalize="none"
        spellCheck={false}
        required={required}
        minLength={minLength}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(hint && hintId, error && errorId)}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
      />
      <button
        type="button"
        className="btn btn--text field__toggle"
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
        <span>{isVisible ? t("auth.hidePassword") : t("auth.showPassword")}</span>
      </button>
      {hint && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field__error">
          <CircleAlert aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}
