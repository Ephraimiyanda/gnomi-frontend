"use client";

import { useState } from "react";
import {
  X,
  Loader2,
  Plus,
  Globe2,
  MapPin,
  LocateFixed,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateTopicModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUniversal, setIsUniversal] = useState(true);

  // Geolocation states
  const [isLocating, setIsLocating] = useState(false);
  const [deviceCoords, setDeviceCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const router = useRouter();

  const handleGetLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDeviceCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        console.error("Error obtaining location:", error);
        alert(
          "Failed to get location. Please ensure location permissions are granted."
        );
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      creatorId: `user-${Math.floor(Math.random() * 1000)}`,
      isUniversal,
      country: isUniversal ? null : "Local Sector",
      lat: isUniversal ? null : deviceCoords?.lat || 0,
      lng: isUniversal ? null : deviceCoords?.lng || 0,
    };

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
        }/topics`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        setIsOpen(false);
        setDeviceCoords(null);
        setIsUniversal(true);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create topic", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-5 right-5 z-20 rounded-xl bg-cyan-400 p-3 text-slate-950 transition hover:scale-105 cursor-pointer"
      >
        <Plus className="h-5 w-5" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-cyan-500/30 bg-[#040a1b] p-6 shadow-[0_0_40px_rgba(0,209,255,.2)] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-widest text-cyan-400">
                INITIATE TOPIC
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 cursor-pointer text-slate-400 hover:bg-slate-800 hover:text-cyan-400 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-semibold tracking-widest text-slate-500">
                  TARGET ZONE
                </label>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUniversal(true)}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-bold transition ${
                      isUniversal
                        ? "border-cyan-500 bg-cyan-500/20 text-cyan-300 "
                        : "border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <Globe2 className="h-4 w-4" /> UNIVERSAL
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsUniversal(false)}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-bold transition ${
                      !isUniversal
                        ? "border-cyan-500 bg-cyan-500/20 text-cyan-300 "
                        : "border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <MapPin className="h-4 w-4" /> REGIONAL
                  </button>
                </div>
              </div>

              {!isUniversal && (
                <div className="animate-in fade-in slide-in-from-top-2 p-4 rounded-xl border border-slate-800 bg-slate-900/50">
                  <p className="text-xs text-slate-400 mb-4 text-center">
                    Plot this debate directly on the global map.
                  </p>

                  {deviceCoords ? (
                    <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-500/50 p-3 rounded-lg text-emerald-400 animate-in zoom-in-95 duration-200">
                      <div className="flex items-center gap-2 text-xs font-bold tracking-widest">
                        <CheckCircle2 className="h-4 w-4" />
                        LOCATION SECURED
                      </div>
                      <button
                        type="button"
                        onClick={() => setDeviceCoords(null)}
                        className="text-[10px] font-bold tracking-widest text-emerald-500/70 hover:text-emerald-300 transition"
                      >
                        RESET
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={isLocating}
                      className="w-full flex items-center justify-center gap-2 rounded-lg border border-cyan-700 bg-cyan-900/20 py-3 text-xs font-bold tracking-widest text-cyan-300 hover:bg-cyan-900/40 hover:border-cyan-500 transition disabled:opacity-50"
                    >
                      {isLocating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <LocateFixed className="h-4 w-4" />
                      )}
                      {isLocating
                        ? "ACQUIRING SIGNAL..."
                        : "USE CURRENT LOCATION"}
                    </button>
                  )}
                  {!deviceCoords && (
                    <p className="text-[10px] text-center text-amber-500/80 mt-3">
                      * Location access required for regional deployment.
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold tracking-widest text-slate-500">
                  TOPIC
                </label>
                <input
                  required
                  name="title"
                  placeholder="e.g. Is AGI a threat?"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-sm text-cyan-50 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold tracking-widest text-slate-500">
                  OPERATIONAL DETAILS
                </label>
                <textarea
                  required
                  name="description"
                  placeholder="Elaborate on the parameters..."
                  className="mt-1 h-24 w-full resize-none rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-sm text-cyan-50 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition custom-scrollbar"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || (!isUniversal && !deviceCoords)}
                className="w-full mt-2 rounded-lg bg-cyan-500 py-3.5 cursor-pointer text-sm font-bold tracking-widest text-slate-950 hover:bg-cyan-400 transition disabled:opacity-50 flex justify-center group"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "SETUP ARENA"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
