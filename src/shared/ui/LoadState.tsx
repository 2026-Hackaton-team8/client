type Props = {
  error?: unknown;
  label?: string;
  className?: string;
};

// Placeholder line while API data loads, or the error if it failed.
export function LoadState({ error, label = "불러오는 중이에요…", className }: Props) {
  return (
    <p
      role={error ? "alert" : "status"}
      className={`py-10 text-center text-body-md ${error ? "text-primary-600" : "text-secondary-600"} ${className ?? ""}`}
    >
      {error ? (error instanceof Error ? error.message : "데이터를 불러오지 못했어요.") : label}
    </p>
  );
}
