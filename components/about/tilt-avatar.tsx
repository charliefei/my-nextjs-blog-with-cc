"use client";

import { useRef, useState, type PointerEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";

interface TiltAvatarProps {
  src: string;
  name: string;
  openToWork?: boolean;
}

const MAX_TILT = 14; // degrees

export function TiltAvatar({ src, name, openToWork }: TiltAvatarProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, on: false });
  const [tapping, setTapping] = useState(false);

  const isFinePointer = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !isFinePointer()) return;
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    setTilt({
      rx: (0.5 - py) * MAX_TILT * 2,
      ry: (px - 0.5) * MAX_TILT * 2,
    });
    setGlare({ x: px * 100, y: py * 100, on: true });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setGlare((g) => ({ ...g, on: false }));
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    // Touch / coarse pointer: play the tap pop animation
    if (e.pointerType === "mouse" && isFinePointer()) return;
    setTapping(false);
    // restart animation on rapid taps
    requestAnimationFrame(() => setTapping(true));
  };

  return (
    <div
      className="group/avatar relative shrink-0 [perspective:600px]"
      style={{ touchAction: "manipulation" }}
    >
      <div
        ref={wrapperRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        className={`relative transition-transform duration-200 ease-out [transform-style:preserve-3d] ${
          tapping ? "animate-avatar-tap" : ""
        }`}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${
            tilt.rx || tilt.ry ? 1.06 : 1
          })`,
        }}
        onAnimationEnd={() => setTapping(false)}
      >
        {/* Gradient halo */}
        <div
          aria-hidden
          className="absolute -inset-1.5 rounded-full bg-linear-to-tr from-primary/40 via-accent/30 to-transparent opacity-70 blur-md transition-opacity duration-500 group-hover/avatar:opacity-100"
          style={{ transform: "translateZ(-20px)" }}
        />

        <Avatar className="relative h-20 w-20 ring-1 ring-border/50 ring-offset-4 ring-offset-background md:h-24 md:w-24">
          <AvatarImage src={src} alt={name} />
          <AvatarFallback className="bg-muted text-2xl font-bold">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        {/* Moving glare highlight (desktop tilt only) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full mix-blend-overlay transition-opacity duration-200"
          style={{
            opacity: glare.on ? 1 : 0,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.55), transparent 45%)`,
            transform: "translateZ(1px)",
          }}
        />

        {openToWork && (
          <div
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background"
            style={{ transform: "translateZ(30px)" }}
          >
            <Sparkles className="h-3 w-3" />
          </div>
        )}
      </div>
    </div>
  );
}
