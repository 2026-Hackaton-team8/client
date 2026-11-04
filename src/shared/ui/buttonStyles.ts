export type ButtonVariant = "primary" | "secondary" | "soft" | "ghost" | "strong";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary-300 text-primary-50 hover:bg-primary-400",
  secondary: "bg-secondary-100 text-secondary-600 hover:bg-secondary-200 hover:text-secondary-800",
  soft: "bg-primary-100 text-black hover:bg-primary-200",
  ghost: "bg-secondary-50 text-black hover:bg-secondary-100",
  strong: "bg-primary-500 text-white hover:bg-primary-600",
};

const sizes: Record<ButtonSize, string> = {
  sm: "p-2.5 text-body-lg",
  md: "h-11 px-2.5 text-title-md",
  lg: "p-5 text-heading-sm",
};

type Options = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
};

export function buttonStyles({ variant = "primary", size = "md", block, className }: Options) {
  return [base, variants[variant], sizes[size], block && "w-full", className]
    .filter(Boolean)
    .join(" ");
}
