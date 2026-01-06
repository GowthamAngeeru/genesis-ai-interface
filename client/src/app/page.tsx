"use client";

import { useFrustration } from "@/hooks/use-frustration";
import { generateHelpUI } from "./actions"; 
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { InteractionZone } from "@/components/InteractionZone";
import { SmartResetBtn } from "@/components/SmartResetBtn";

export default function GenesisDemo() {
    const { signal, trajectory } = useFrustration();
    const [mutation, setMutation] = useState<React.ReactNode>(null);

    useEffect(() => {
        if (signal === "RAGE_CLICK" || signal === "THRASHING") {
        async function triggerMutation() {
            const response = await generateHelpUI(signal);
            setMutation(response.ui);
        }
        triggerMutation();
        }
    }, [signal]);

    const getPath = () => {
        if (trajectory.length === 0) return "";
        return `M ${trajectory.map(p => `${p.x} ${p.y}`).join(" L ")}`;
    };

    return (
        <main className={clsx(
        "flex min-h-screen flex-col items-center justify-center p-24 transition-colors duration-500 ease-out overflow-hidden relative",
        signal === "NONE" && "bg-zinc-950",
        signal === "THRASHING" && "bg-orange-900/90",
        signal === "RAGE_CLICK" && "bg-red-900/90"
        )}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <path 
            d={getPath()} 
            fill="none" 
            stroke={signal === "RAGE_CLICK" ? "cyan" : "white"} 
            strokeWidth="2"
            strokeOpacity="0.5"
            className="animate-pulse"
            />
            {trajectory.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3" fill="white" className="opacity-50" />
            ))}
        </svg>
        
        <div className="hidden" aria-hidden="true">
            <SmartResetBtn label="preload" color="red" />
        </div>

        <div className="fixed top-10 w-full max-w-2xl px-6 z-50">
            <div className="flex justify-between items-center border border-white/10 bg-black/50 backdrop-blur-md p-4 rounded-xl text-zinc-400 font-mono text-sm shadow-xl">
            <span>GENESIS SENSOR v1.0</span>
            <div className="flex items-center gap-2">
                STATUS:
                <span className={clsx(
                "font-bold px-2 py-0.5 rounded transition-all",
                signal === "NONE" && "text-emerald-400 bg-emerald-400/10",
                signal === "THRASHING" && "text-orange-400 bg-orange-400/10",
                signal === "RAGE_CLICK" && "text-red-400 bg-red-400/10 animate-pulse"
                )}>
                {signal}
                </span>
            </div>
            </div>
        </div>

        <div className="relative flex flex-col items-center justify-center gap-10 z-10">
            <div className="relative flex items-center justify-center">
                <div className={clsx(
                "absolute w-64 h-64 rounded-full blur-[100px] transition-all duration-300",
                signal === "NONE" && "bg-blue-500/20",
                signal === "THRASHING" && "bg-orange-500/40 scale-125",
                signal === "RAGE_CLICK" && "bg-red-600/50 scale-150"
                )} />
                
                <h1 className="relative z-10 text-6xl font-bold tracking-tighter text-white drop-shadow-2xl">
                {signal === "NONE" && "System Nominal."}
                {signal === "THRASHING" && "⚠️ Confusion Detected"}
                {signal === "RAGE_CLICK" && "🔥 RAGE DETECTED"}
                </h1>
            </div>

            <InteractionZone>
            <div className="min-h-[100px] w-full flex justify-center transition-all duration-500">
                {mutation}
            </div>
            </InteractionZone>

        </div>
        
        <div className="mt-16 text-zinc-500 text-sm space-y-2 text-center font-mono opacity-50 hover:opacity-100 transition-opacity z-10">
            <p>[TEST PROTOCOL]</p>
            <p>1. Shake mouse rapidly in one spot</p>
            <p>2. Click 5 times in 1 second</p>
        </div>
        </main>
    );
}