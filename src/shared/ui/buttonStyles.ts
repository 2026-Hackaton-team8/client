export type ButtonVariant = "primary" | "soft" | "ghost" | "strong" | "outline" | "subtle";
export type ButtonSize = "sm" | "md";

const base =
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary-300 text-primary-50 hover:bg-primary-400",
  soft: "bg-primary-100 text-black hover:bg-primary-200",
  ghost: "bg-secondary-100 text-secondary-700 hover:bg-secondary-200 hover:text-secondary-900",
  strong: "bg-primary-500 text-primary-50 hover:bg-primary-600",
  outline: "border border-secondary-100 bg-white font-medium text-black hover:border-secondary-300",
  subtle: "bg-primary-50 font-medium text-secondary-900 hover:bg-primary-100",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-body-sm font-semibold",
  md: "h-10 px-4 text-label-lg",
};

type Options = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
};

export function buttonStyles({ variant = "strong", size = "md", block, className }: Options) {
  return [base, variants[variant], sizes[size], block && "w-full", className]
    .filter(Boolean)
    .join(" ");
}
