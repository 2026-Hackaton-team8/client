import { useId, type SelectHTMLAttributes } from "react";
import { FieldLabel } from "./FieldLabel";
import { fieldStyles } from "./fieldStyles";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: { value: string; label: string }[];
};

export function Select({ label, options, id, className, ...rest }: Props) {
  const fallbackId = useId();
  const fieldId = id ?? fallbackId;

  return (
    <FieldLabel htmlFor={fieldId} label={label}>
      <select id={fieldId} className={`${fieldStyles} cursor-pointer ${className ?? ""}`} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldLabel>
  );
}
