"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { createAlert, updateAlert } from "@/lib/actions/alert.actions";

interface Props {
  symbol: string;
  company: string;
  mode?: "create" | "edit";
  alert?: Alert;
}

export default function CreateAlertDialog({
  symbol,
  company,
  mode = "create",
  alert,
}: Props) {
    const router = useRouter();
  const [open, setOpen] = useState(false);

  const [alertName, setAlertName] = useState(
    alert?.alertName || `${symbol} Price Alert`,
  );

  const [alertType, setAlertType] = useState<"upper" | "lower">(
    alert?.alertType || "upper",
  );

  const [threshold, setThreshold] = useState(
    alert?.threshold?.toString() || "",
  );

  const [loading, setLoading] = useState(false);

  const [frequency, setFrequency] = useState<"once" | "hourly" | "daily">(
    alert?.frequency || "once",
  );

  const handleSubmit = async () => {
    if (!threshold) {
      toast.error("Please enter threshold price");
      return;
    }

    setLoading(true);

    let result;

    if (mode === "edit" && alert?._id) {
      result = await updateAlert(alert._id, {
        symbol,
        company,
        alertName,
        alertType,
        threshold,
        frequency,
      });
    } else {
      result = await createAlert({
        symbol,
        company,
        alertName,
        alertType,
        threshold,
        frequency,
      });
    }

    if (!result.success) {
      setLoading(false);
      toast.error(result.message);
      return;
    }

    toast.success(mode === "edit" ? "Alert updated" : "Alert created");
    setLoading(false);

    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "edit" ? (
          <button
            className="
              text-slate-500
              hover:text-white
              transition-colors
            "
          >
            <Pencil className="h-4 w-4" />
          </button>
        ) : (
          <Button
            variant="outline"
            className="
              border-white/10
              bg-white/5
              hover:bg-white/10
            "
          >
            Add Alert
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-130 border-slate-800 bg-[#111111] text-white rounded-2xl p-8 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {mode === "edit" ? "Edit Alert" : "Create Alert"}
          </DialogTitle>
          <DialogDescription>
            Configure stock price alert settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-3">
          <label className="text-[13px] text-slate-400">Alert Name</label>
          <Input
            value={alertName}
            onChange={(e) => setAlertName(e.target.value)}
            placeholder="Alert Name"
            className="bg-[#1f232b] border-slate-700 h-10 "
          />

          <label className="text-[13px] text-slate-400">Stock Identifier</label>

          <Input
            className="bg-[#1f232b] border-slate-700 h-10 "
            value={`${company} (${symbol})`}
            disabled
          />

          <label className="text-[13px] text-slate-400">Alert Condition</label>

          <select
            value={alertType}
            onChange={(e) => setAlertType(e.target.value as "upper" | "lower")}
            className="w-full h-10 rounded-md bg-[#1f232b] border border-slate-700 p-2"
          >
            <option value="upper">Price Above</option>

            <option value="lower">Price Below</option>
          </select>

          <label className="text-[13px] text-slate-400">Threshold Value</label>

          <Input
            type="number"
            placeholder="Threshold Price eg:140"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="bg-[#1f232b] border-slate-700 h-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />

          <label className="text-[13px] text-slate-400">Frequency</label>

          <select
            value={frequency}
            onChange={(e) =>
              setFrequency(e.target.value as "once" | "hourly" | "daily")
            }
            className="w-full h-10 rounded-md bg-[#1f232b] border border-slate-700 p-2"
          >
            <option value="once">Once</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
          </select>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="
              cyan-btn
            "
          >
            {loading
              ? mode === "edit"
                ? "Updating..."
                : "Creating..."
              : mode === "edit"
                ? "Update Alert"
                : "Create Alert"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
