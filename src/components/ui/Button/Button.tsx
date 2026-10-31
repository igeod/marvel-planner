import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { buttonClass, type ButtonVariant } from "./buttonClass";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconEnd?: ReactNode;
  isLoading?: boolean;
  loadingLabel?: string;
  children?: ReactNode;
}

export function Button({
  variant = "soft",
  size = "md",
  icon,
  iconEnd,
  isLoading,
  loadingLabel,
  children,
  className,
  type = "button",
  onClick,
  ...rest
}: ButtonProps) {
  const classes = [buttonClass(variant, size, children === undefined), className]
    .filter(Boolean)
    .join(" ");
  const canLoad = isLoading !== undefined;

  return (
    <button
      type={type}
      className={classes}
      aria-busy={isLoading || undefined}
      onClick={(event) => {
        if (isLoading) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...rest}
      aria-disabled={isLoading ? true : rest["aria-disabled"]}
    >
      {canLoad ? (
        <span className="btn__stack">
          <span className={`btn__content${isLoading ? " btn__content--hidden" : ""}`}>
            {icon}
            {children}
          </span>
          <span
            className={`btn__content${isLoading ? "" : " btn__content--hidden"}`}
            aria-hidden={!isLoading}
          >
            <LoaderCircle className="btn__spinner" aria-hidden />
            {loadingLabel ?? children}
          </span>
        </span>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
      {iconEnd}
    </button>
  );
}
