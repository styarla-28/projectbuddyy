import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSensoryControls } from "@/components/buddy/SensoryProvider";

/** Private, non-diagnostic mirror. Video stays in this tab: never recorded, stored, or sent. */
export function MirrorView() {
  const { cameraOptIn, setCameraOptIn } = useSensoryControls();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [on, setOn] = useState(false);
  const [error, setError] = useState("");

  const stop = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setOn(false);
  };

  const start = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      setOn(true);
    } catch {
      setError("The camera couldn't open. You can allow it in your browser settings, or simply carry on without it.");
    }
  };

  useEffect(() => { if (on && videoRef.current && streamRef.current) videoRef.current.srcObject = streamRef.current; }, [on]);
  useEffect(() => { if (!cameraOptIn) stop(); }, [cameraOptIn]);
  useEffect(() => () => stop(), []);

  if (!cameraOptIn) return null;

  return (
    <section aria-label="Private mirror" className="mt-5 rounded-3xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center gap-2 text-sm"><ShieldCheck className="size-5 shrink-0 text-stream" /><span className="text-graphite">Private mirror · stays on your device, never recorded</span></div>
      {on ? (
        <>
          <video ref={videoRef} autoPlay playsInline muted className="mt-3 aspect-[4/3] w-full -scale-x-100 rounded-2xl bg-secondary object-cover" />
          <Button onClick={stop} variant="outline" className="mt-3 h-12 w-full rounded-full"><CameraOff />Turn camera off</Button>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm text-graphite">A gentle mirror to notice your hands resting. Nothing is analyzed or judged.</p>
          {error && <p role="status" className="mt-2 text-sm">{error}</p>}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Button onClick={start} className="h-12 rounded-full"><Camera />Open mirror</Button>
            <Button onClick={() => setCameraOptIn(false)} variant="ghost" className="h-12 rounded-full">Hide mirror from Home</Button>
          </div>
        </>
      )}
    </section>
  );
}
