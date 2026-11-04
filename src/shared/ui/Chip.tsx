import type { ButtonHTMLAttributes } from "react";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-pressed"> & {
  selected: boolean;
};

export function Chip({ selected, className, type = "button", ...rest }: Props) {
  const tone = selected
    ? "border-primary-300 bg-primary-100 text-black"
    : "border-secondary-100 bg-white text-secondary-700 hover:border-secondary-300";
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={`cursor-pointer rounded-lg border-2 px-3 py-1.5 text-label-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${tone} ${className ?? ""}`}
      {...rest}
    />
  );
}
