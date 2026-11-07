import { CircleAlert, Eye, EyeOff, X } from "lucide-react";
import {
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
  type HTMLInputTypeAttribute,
  type MouseEvent,
  type ReactNode,
} from "react";
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
  readOnly?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
  // Neutral line under the field in place of the hint: no icon, no ring.
  note?: string;
  // Focus the input from outside, e.g. after a refused submit.
  inputRef?: Ref<HTMLInputElement>;
  // The error is not announced on its own (a summary above already is).
  isQuiet?: boolean;
  // Marks the field invalid when its error is shown elsewhere (the password length row).
  invalid?: boolean;
  describedBy?: string;
}

// The label names the field for assistive technology, but a click on it does not move focus.
function keepFocus(event: MouseEvent<HTMLLabelElement>) {
  event.preventDefault();
}

// One status line under the field: reserves its height so the layout never jumps. An error is a new
// element (role="alert") so screen readers announce it when it appears.
function FieldMessage({
  id,
  hint,
  error,
  notice,
  isQuiet,
}: {
  id: string;
  hint?: string;
  error?: string | null;
  notice?: string | false;
  isQuiet?: boolean;
}) {
  if (error) {
    return (
      <p
        key="error"
        id={id}
        role={isQuiet ? "status" : "alert"}
        className="field__message field__error"
      >
        <CircleAlert aria-hidden />
        {error}
      </p>
    );
  }
  return (
    <p key="message" id={id} role="status" className="field__message">
      {notice && <CircleAlert aria-hidden />}
      {notice || hint}
    </p>
  );
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
  readOnly,
  disabled,
  onBlur,
  note,
  inputRef: externalRef,
  isQuiet,
}: FieldProps) {
  const { t } = useI18n();
  const id = useId();
  const messageId = `${id}-message`;
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(externalRef, () => inputRef.current as HTMLInputElement);
  const isEmail = type === "email";
  const hasClear = isEmail && value !== "" && !readOnly && !disabled;

  return (
    <div className="field">
      <div className="field__label">
        <label htmlFor={id} onClick={keepFocus}>
          {label}
        </label>
        {maxLength !== undefined && (
          <span className="field__counter" aria-hidden="true">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <div className="field__control">
        <input
          id={id}
          ref={inputRef}
          name={name}
          type={type}
          value={value}
          autoComplete={autoComplete}
          autoCapitalize="none"
          spellCheck={false}
          inputMode={isEmail ? "email" : undefined}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          readOnly={readOnly}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={messageId}
          data-clearable={hasClear || undefined}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
        />
        {hasClear && (
          <button
            type="button"
            className="field__button"
            aria-label={t("auth.clearEmail")}
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
          >
            <X aria-hidden />
          </button>
        )}
      </div>
      <FieldMessage id={messageId} hint={note ?? hint} error={error} isQuiet={isQuiet} />
    </div>
  );
}

interface PasswordFieldProps extends Omit<FieldProps, "type"> {
  // Controlled visibility, for a group of fields that share one eye.
  isVisible?: boolean;
  onToggleVisible?: () => void;
  // Ids toggled by the eye; defaults to this field alone.
  controls?: string;
  id?: string;
  // No eye on this field (it follows the one above).
  hideToggle?: boolean;
  // Overrides the eye button name, e.g. when three fields each carry one.
  toggleLabel?: string;
  after?: ReactNode;
}

export function PasswordField(props: PasswordFieldProps) {
  const { t } = useI18n();
  const [ownVisible, setOwnVisible] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);
  const generatedId = useId();
  const id = props.id ?? generatedId;
  const isVisible = props.isVisible ?? ownVisible;
  const toggle = props.onToggleVisible ?? (() => setOwnVisible(!ownVisible));
  const messageId = `${id}-message`;
  const { label, name, value, onChange, autoComplete, hint, error, required, minLength } = props;

  return (
    <div className="field">
      <label htmlFor={id} onClick={keepFocus}>
        {label}
      </label>
      <div className="field__control">
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
          readOnly={props.readOnly}
          disabled={props.disabled}
          aria-invalid={Boolean(error) || props.invalid}
          aria-describedby={[messageId, props.describedBy].filter(Boolean).join(" ")}
          data-clearable={props.hideToggle ? undefined : true}
          onChange={(event) => onChange(event.target.value)}
          onKeyUp={(event) => setIsCapsLock(event.getModifierState("CapsLock"))}
          onBlur={() => {
            setIsCapsLock(false);
            props.onBlur?.();
          }}
        />
        {!props.hideToggle && (
          <button
            type="button"
            className="field__button"
            aria-label={props.toggleLabel ?? t("auth.showPassword")}
            aria-pressed={isVisible}
            aria-controls={props.controls ?? id}
            onClick={toggle}
          >
            {isVisible ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
          </button>
        )}
      </div>
      <FieldMessage
        id={messageId}
        hint={hint}
        error={error}
        notice={isCapsLock && t("auth.capsLock")}
        isQuiet={props.isQuiet}
      />
      {props.after}
    </div>
  );
}
