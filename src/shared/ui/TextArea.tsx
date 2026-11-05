import { useId, type TextareaHTMLAttributes } from "react";
import { FieldLabel } from "./FieldLabel";
import { fieldStyles } from "./fieldStyles";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hideLabel?: boolean;
  hint?: string;
};

export function TextArea({
  label,
  hideLabel,
  hint,
  id,
  className,
  rows = 4,
  required,
  ...rest
}: Props) {
  const fallbackId = useId();
  const fieldId = id ?? fallbackId;
  const hintId = hint ? `${fieldId}-hint` : undefined;

  return (
    <FieldLabel
      htmlFor={fieldId}
      label={label}
      hideLabel={hideLabel}
      required={required}
      hint={hint}
      hintId={hintId}
    >
      <textarea
        id={fieldId}
        rows={rows}
        required={required}
        aria-describedby={hintId}
        className={`${fieldStyles} resize-y ${className ?? ""}`}
        {...rest}
      />
    </FieldLabel>
  );
}
