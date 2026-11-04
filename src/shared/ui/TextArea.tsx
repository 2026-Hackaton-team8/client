import { useId, type TextareaHTMLAttributes } from "react";
import { FieldLabel } from "./FieldLabel";
import { fieldStyles } from "./fieldStyles";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
};

export function TextArea({ label, hint, id, className, rows = 4, ...rest }: Props) {
  const fallbackId = useId();
  const fieldId = id ?? fallbackId;
  const hintId = hint ? `${fieldId}-hint` : undefined;

  return (
    <FieldLabel htmlFor={fieldId} label={label} hint={hint} hintId={hintId}>
      <textarea
        id={fieldId}
        rows={rows}
        aria-describedby={hintId}
        className={`${fieldStyles} resize-y ${className ?? ""}`}
        {...rest}
      />
    </FieldLabel>
  );
}
