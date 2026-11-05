import { useId, type InputHTMLAttributes } from "react";
import { FieldLabel } from "./FieldLabel";
import { fieldStyles } from "./fieldStyles";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hideLabel?: boolean;
  hint?: string;
};

export function TextField({ label, hideLabel, hint, id, className, ...rest }: Props) {
  const fallbackId = useId();
  const fieldId = id ?? fallbackId;
  const hintId = hint ? `${fieldId}-hint` : undefined;

  return (
    <FieldLabel htmlFor={fieldId} label={label} hideLabel={hideLabel} hint={hint} hintId={hintId}>
      <input
        id={fieldId}
        aria-describedby={hintId}
        className={`${fieldStyles} ${className ?? ""}`}
        {...rest}
      />
    </FieldLabel>
  );
}
