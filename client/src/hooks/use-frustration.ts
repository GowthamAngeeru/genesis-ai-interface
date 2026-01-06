"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Point, detectThrashing, detectRageClicks } from "@/lib/cursor-math";
import { sendSignalToCortex } from "@/lib/api"; 

export type FrustrationSignal = "NONE" | "THRASHING" | "RAGE_CLICK";

export function useFrustration() {
  const [signal, setSignal] = useState<FrustrationSignal>("NONE");
  
  const [trajectory, setTrajectory] = useState<Point[]>([]);

  const history = useRef<Point[]>([]);
  const clicks = useRef<Point[]>([]);
  const frameRef = useRef<number>(0);
  const isSendingRef = useRef<boolean>(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    
    history.current.push({ x: e.clientX, y: e.clientY, t: now });
    if (history.current.length > 50) history.current.shift();

    if (frameRef.current % 10 === 0) {
      if (detectThrashing(history.current)) {
        setSignal((prev) => {
          if (prev !== "THRASHING" && !isSendingRef.current) {
            isSendingRef.current = true;
            setTrajectory([...history.current]);
            
            sendSignalToCortex(history.current, "THRASHING").then(() => {
                isSendingRef.current = false;
            });
            setTimeout(() => { setSignal("NONE"); setTrajectory([]); }, 2000);
            return "THRASHING";
          }
          return prev;
        });
      }
    }
    frameRef.current++;
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    const now = Date.now();
    clicks.current.push({ x: e.clientX, y: e.clientY, t: now });
    clicks.current = clicks.current.filter(c => now - c.t < 1000);

    if (detectRageClicks(clicks.current)) {
      setSignal((prev) => {
          if (prev !== "RAGE_CLICK") {
            setTrajectory([...clicks.current]);
            
            sendSignalToCortex(clicks.current, "RAGE_CLICK");
            setTimeout(() => { setSignal("NONE"); setTrajectory([]); }, 2000);
            return "RAGE_CLICK";
          }
          return prev;
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [handleMouseMove, handleClick]);

  return { signal, trajectory };
}