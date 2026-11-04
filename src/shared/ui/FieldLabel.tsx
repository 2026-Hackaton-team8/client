import type { ReactNode } from "react";

type Props = {
  htmlFor: string;
  label?: string;
  hideLabel?: boolean;
  hint?: string;
  hintId?: string;
  children: ReactNode;
};

export function FieldLabel({ htmlFor, label, hideLabel, hint, hintId, children }: Props) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label htmlFor={htmlFor} className={hideLabel ? "sr-only" : "text-label-lg text-black"}>
          {label}
        </label>
      )}
      {children}
      {hint && (
        <p id={hintId} className="text-body-md text-secondary-600">
          {hint}
        </p>
      )}
    </div>
  );
}
