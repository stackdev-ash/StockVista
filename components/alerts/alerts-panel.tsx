import AlertCard from "./alert-card";

interface AlertsPanelProps {
  alerts: Alert[];
}

export default function AlertsPanel({
  alerts,
}: AlertsPanelProps) {
  return (
    <div
      className="
      rounded-2xl
      border border-slate-800
      bg-[#0f1117]
      p-4
      h-160
      overflow-hidden
      
    "
    >
      

      {alerts.length === 0 ? (
        <div
          className="
          h-full
          flex
          items-center
          justify-center
          text-slate-500
          text-sm
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
          h-155
          pr-1
        "
        >
          {alerts.map((alert) => (
            <AlertCard
              key={alert._id}
              alert={alert}
            />
          ))}
        </div>
      )}
    </div>
  );
}