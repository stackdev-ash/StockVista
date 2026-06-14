import AlertCard from "./alert-card";

interface AlertsPanelProps {
  alerts: Alert[];
}

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <div
      className="
      rounded-2xl
      border border-slate-800
      bg-[#0f1117]
      p-4
      h-75
    md:h-87.5
    overflow-hidden
    "
    >
      {alerts.length === 0 ? (
        <div
          className="
          flex
          items-center
          justify-center
          text-slate-500
          text-sm
          h-full
        "
        >
          No alerts created yet
        </div>
      ) : (
        <div
          className="
          flex
          flex-col
          gap-4
          overflow-y-auto
          h-full
          pr-1
          scrollbar-hide-default
        "
        >
          {alerts.map((alert) => (
            <AlertCard key={alert._id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}
