import { useId } from "react";

interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Switch({ label, checked, onChange }: SwitchProps) {
  const labelId = useId();

  // Only the toggle is interactive: the text is a plain span, not part of a <label>.
  return (
    <div className="switch">
      <span id={labelId}>{label}</span>
      <label className="switch__control">
        <input
          className="switch__input"
          type="checkbox"
          role="switch"
          aria-labelledby={labelId}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className="switch__track" aria-hidden="true" />
      </label>
    </div>
  );
}
