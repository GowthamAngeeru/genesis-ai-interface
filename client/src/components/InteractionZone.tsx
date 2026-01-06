"use client";

import { ReactNode, useState } from "react";

export function InteractionZone({ children }: { children: ReactNode }) {
    const [isRepairing, setIsRepairing] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    
    const handleInteraction = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        const btn = target.closest('button[data-action="reset"]') as HTMLButtonElement;

        if (btn && !isRepairing) {
        setIsRepairing(true);
        
        const sequence = [
            "Analyzing Variance Vectors...",
            "Detected Entropy Spike: 98.4%",
            "Recompiling UI Components...",
            "Flushing Python Cache...",
            "Injecting Dopamine Protocols...",
            "SYSTEM_RESTORE_COMPLETE"
        ];

        sequence.forEach((log, index) => {
            setTimeout(() => {
            setLogs(prev => [...prev, log]);
            }, index * 400); 
        });

        setTimeout(() => {
            window.location.reload();
        }, 2500);
        }
    };

    return (
        <div onClick={handleInteraction} className="relative w-full flex justify-center">
        
        {!isRepairing && children}

        {isRepairing && (
            <div className="bg-black/95 border border-emerald-500/30 p-8 rounded-lg w-96 font-mono text-xs shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-2 mb-4 text-emerald-500">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="tracking-widest uppercase">AI REPAIR SEQUENCE</span>
            </div>
            
            <div className="space-y-2 h-40 overflow-hidden flex flex-col justify-end">
                {logs.map((log, i) => (
                <div key={i} className="text-emerald-400/80 border-l-2 border-emerald-500/20 pl-2 animate-in slide-in-from-left-2">
                    {"> "}{log}
                </div>
                ))}
                <div className="w-3 h-4 bg-emerald-500 animate-pulse mt-2" />
            </div>
            
            <div className="mt-4 w-full bg-emerald-900/20 h-1 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 animate-[width_2s_ease-out_forwards] w-full origin-left" />
            </div>
            </div>
        )}
        </div>
    );
}