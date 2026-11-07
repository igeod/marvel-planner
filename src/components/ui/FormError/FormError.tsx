import { CircleAlert } from "lucide-react";
import rateArt from "../../../assets/err-429.webp";

interface FormErrorProps {
  children: string;
  // "rate" is the too-many-attempts block: the shield and, in it and en only, a one-line quip.
  tone?: "error" | "rate";
  title?: string;
}

// An error that belongs to the form and not to one field.
export function FormError({ children, tone = "error", title }: FormErrorProps) {
  if (tone === "rate") {
    return (
      <div role="alert" className="form-error form-error--rate">
        <img src={rateArt} alt="" aria-hidden width={56} height={56} />
        <div>
          {title && <strong>{title}</strong>}
          <p>{children}</p>
        </div>
      </div>
    );
  }
  return (
    <p role="alert" className="form-error">
      <CircleAlert aria-hidden />
      {children}
    </p>
  );
}
