"use client";

import { useState } from "react";
import { Trash2, Bell } from "lucide-react"
import { ToggleLeft, ToggleRight } from "lucide-react";
import { deleteAlert, toggleAlert } from "@/lib/actions/alert.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CreateAlertDialog from "./create-alert-dialog";

interface AlertCardProps {
  alert: Alert;
}

export default function AlertCard({ alert }: AlertCardProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const result = await deleteAlert(alert._id);
    if (result.success) {
      toast.success("Alert deleted");
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const [isActive, setIsActive] = useState(alert.isActive);

  const handleToggle = async () => {
    const result = await toggleAlert(alert._id);

    if (result.success) {
      setIsActive(result.isActive);

      toast.success(result.isActive ? "Alert enabled" : "Alert disabled");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div
      className="
        rounded-xl
        border border-slate-800
        bg-[#14161d]
        p-3
        hover:border-slate-700
        transition-all
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div
            className="
              h-10 w-10
              rounded-xl
              bg-slate-800
              flex items-center justify-center
              shrink-0
            "
          >
            <Bell className="h-5 w-5 text-yellow-400" />
          </div>

          <div>
            <h3 className="text-sm font-medium text-white">{alert.company}</h3>

            <p className="text-slate-400 text-xs mt-1">{alert.symbol}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-slate-400 text-sm">Current Price</p>

          <p className="text-xl font-semibold text-white">
            {alert.currentPrice ? `$${alert.currentPrice.toFixed(2)}` : "--"}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-slate-800" />

      {/* Alert Header */}
      <div className="flex items-center justify-between">
        <span className="text-slate-400 font-medium">Alert:</span>

        <div className="flex items-center gap-3">
          <CreateAlertDialog
            mode="edit"
            alert={alert}
            symbol={alert.symbol}
            company={alert.company}
          />

          <button onClick={handleToggle} className="transition-all">
            {isActive ? (
              <ToggleRight className="h-6 w-8 text-yellow-400" />
            ) : (
              <ToggleLeft className="h-6 w-8 text-slate-500" />
            )}
          </button>

          <button
            onClick={handleDelete}
            className="
              text-slate-500
              hover:text-red-400
              transition-colors
            "
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Alert Rule */}
      <div className="mt-3 flex items-end justify-between">
        <p className="text-lg font-medium text-white">
          Price {alert.alertType === "upper" ? ">" : "<"} ${alert.threshold}
        </p>

        <span
          className="
            rounded-md
            bg-yellow-500/10
            border border-yellow-500/20
            px-3 py-1.5
            text-xs
            font-medium
            text-yellow-400
          "
        >
          {alert.frequency}
        </span>
      </div>
    </div>
  );
}
