export function CreditScoreMeter({ score }: Readonly<{ score: number }>) {
  const pct = Math.min(100, Math.max(0, ((score - 400) / 500) * 100));
  const poor = score < 350;

  return (
    <div className="space-y-2 w-full">
      <h3 className="text-lg font-semibold">Credit Score Meter</h3>
      <div className="relative h-4 w-full rounded-full bg-gray-200">
        <div
          className={`h-4 rounded-full absolute top-0 ${poor ? "bg-red-500" : "bg-blue-500"}`}
          style={{ width: `${pct}%` }}
        />
        <div
          className={`absolute h-0 w-0 border-l-8 border-r-8 border-t-8 border-transparent ${poor ? "border-t-red-600" : "border-t-black"}`}
          style={{ left: `calc(${pct}% - 8px)`, top: "20px" }}
        />
        <div className="absolute top-6 flex w-full justify-between text-xs font-medium">
          <span>400</span>
          <span>900</span>
        </div>
      </div>
      <p
        className={`text-center font-medium ${poor ? "text-red-600" : "text-gray-700"}`}
      >
        Your score: {score}
      </p>
    </div>
  );
}
