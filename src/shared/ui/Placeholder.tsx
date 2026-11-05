type Props = {
  label: string;
  className?: string;
};

export function Placeholder({ label, className }: Props) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`rounded-lg bg-secondary-100 ${className ?? ""}`}
    />
  );
}
