import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Bell, BellOff, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alarm Clock" },
      { name: "description", content: "A simple, beautiful alarm clock." },
      { property: "og:title", content: "Alarm Clock" },
      { property: "og:description", content: "A simple, beautiful alarm clock." },
    ],
  }),
  component: Index,
});

interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
}

function Index() {
  const [now, setNow] = useState(new Date());
  const [alarms, setAlarms] = useState<Alarm[]>([
    { id: "1", time: "07:00", label: "Morning", enabled: true },
    { id: "2", time: "08:30", label: "Work", enabled: false },
  ]);
  const [newTime, setNewTime] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [ringingId, setRingingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const checkRef = useRef<string>("");

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const current = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    if (now.getSeconds() === 0 && checkRef.current !== current) {
      checkRef.current = current;
      for (const alarm of alarms) {
        if (alarm.enabled && alarm.time === current) {
          setRingingId(alarm.id);
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        }
      }
    }
  }, [now, alarms]);

  const addAlarm = () => {
    if (!newTime) return;
    const alarm: Alarm = {
      id: crypto.randomUUID(),
      time: newTime,
      label: newLabel || "Alarm",
      enabled: true,
    };
    setAlarms((prev) => [...prev, alarm]);
    setNewTime("");
    setNewLabel("");
  };

  const toggleAlarm = (id: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const deleteAlarm = (id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
    if (ringingId === id) {
      setRingingId(null);
      audioRef.current?.pause();
    }
  };

  const stopRinging = () => {
    setRingingId(null);
    audioRef.current?.pause();
  };

  const timeString = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-background px-4">
      <audio
        ref={audioRef}
        src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
        loop
      />

      <div className="text-center">
        <div className="text-7xl font-light tracking-tight text-foreground tabular-nums sm:text-8xl">
          {timeString}
        </div>
        <div className="mt-2 text-lg text-muted-foreground">{dateString}</div>
      </div>

      <div className="w-full max-w-sm space-y-3">
        {alarms.map((alarm) => (
          <div
            key={alarm.id}
            className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
              ringingId === alarm.id
                ? "border-destructive bg-destructive/10"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleAlarm(alarm.id)}
                className={
                  alarm.enabled ? "text-primary" : "text-muted-foreground"
                }
              >
                {alarm.enabled ? <Bell size={18} /> : <BellOff size={18} />}
              </Button>
              <div>
                <div className="text-xl font-semibold tabular-nums text-foreground">
                  {alarm.time}
                </div>
                <div className="text-xs text-muted-foreground">
                  {alarm.label}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {ringingId === alarm.id && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={stopRinging}
                >
                  Stop
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteAlarm(alarm.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-2 pt-2">
          <Input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="w-28"
          />
          <Input
            type="text"
            placeholder="Label"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && addAlarm()}
          />
          <Button onClick={addAlarm} size="icon">
            <Plus size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
