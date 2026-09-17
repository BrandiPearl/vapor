export function AdminNotice({
  tone = "warning",
  title,
  detail,
}: {
  tone?: "warning" | "error";
  title: string;
  detail?: string;
}) {
  const styles =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-950"
      : "border-amber-200 bg-amber-50 text-amber-950";

  return (
    <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${styles}`}>
      <p className="font-semibold">{title}</p>
      {detail && (
        <p className="mt-1 break-words font-mono text-xs opacity-90">{detail}</p>
      )}
    </div>
  );
}
