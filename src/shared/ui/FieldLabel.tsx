import type { ReactNode } from "react";

type Props = {
  htmlFor: string;
  label?: string;
  hideLabel?: boolean;
  required?: boolean;
  hint?: string;
  hintId?: string;
  children: ReactNode;
};

export function FieldLabel({ htmlFor, label, hideLabel, required, hint, hintId, children }: Props) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label htmlFor={htmlFor} className={hideLabel ? "sr-only" : "text-label-lg text-black"}>
          {label}
          {required && <span className="ml-1 text-primary-500">*</span>}
        </label>
      )}
      {children}
      {hint && (
        <p id={hintId} className="text-label-md font-normal text-secondary-600">
          {hint}
        </p>
      )}
    </div>
  );
}
