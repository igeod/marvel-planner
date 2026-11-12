import type { ReactNode } from "react";
import { Link, type LinkProps } from "react-router";
import { buttonClass, type ButtonVariant } from "./buttonClass";

interface ButtonLinkProps extends Omit<LinkProps, "className"> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconEnd?: ReactNode;
}

// A link that looks like a Button: icon before the text for an action, iconEnd when it leads elsewhere.
export function ButtonLink({
  variant = "soft",
  size = "md",
  icon,
  iconEnd,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, size)} {...rest}>
      {icon}
      {children}
      {iconEnd}
    </Link>
  );
}
