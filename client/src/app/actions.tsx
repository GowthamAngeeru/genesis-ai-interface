"use server";

import { streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export async function generateHelpUI(context: string) {
    const result = await streamUI({
        model: openai("gpt-4o"),
        prompt: `
        ANALYSIS: User is frustrated (Context: ${context}).
        
        INSTRUCTION: 
        1. If "RAGE", deploy 'showSystemOverride'.
        2. If "CONFUSION", deploy 'showZenMode'.
        
        TONE: CYBERPUNK PIRATE (e.g., "Ahoy Netrunner", "Hull Breach").
        
        CRITICAL RULES:
        - The 'actionBtn' parameter must be PLAIN TEXT only. 
        - DO NOT add <button> tags or brackets inside the text.
        - Example: "PURGE SYSTEM", not "<button>PURGE</button>".
        `,
        text: ({ content }) => <div className="text-zinc-500 text-xs font-mono">{content}</div>,
        tools: {
        showSystemOverride: {
            description: "Show a cyberpunk system override console",
            parameters: z.object({
            alertTitle: z.string(),
            statusLog: z.string(),
            actionBtn: z.string(),
            }),
            generate: async ({ alertTitle, statusLog, actionBtn }) => {
            return (
                <div className="bg-black/90 border-2 border-red-500/50 p-6 rounded-none w-96 shadow-[0_0_40px_rgba(239,68,68,0.4)] animate-in slide-in-from-bottom-10 duration-500">
                <div className="flex justify-between text-red-500 font-mono text-xs mb-4 uppercase tracking-widest">
                    <span>⚠ Security Breach</span>
                    <span className="animate-pulse">Live</span>
                </div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">
                    {alertTitle}
                </h2>
                <p className="font-mono text-red-400 text-sm mb-6 border-l-2 border-red-500 pl-3 leading-relaxed">
                    {statusLog}
                </p>
                
                {/* CLEAN BUTTON */}
                <button 
                    data-action="reset"
                    className="group relative w-full bg-red-600 hover:bg-red-700 text-black font-bold py-3 px-4 uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_15px_rgba(220,38,38,0.5)] cursor-pointer overflow-hidden"
                >
                    <div className="absolute inset-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <span className="relative z-10">[ {actionBtn} ]</span>
                </button>
                </div>
            );
            },
        },
        
        showZenMode: {
            description: "Show a calming card",
            parameters: z.object({
            calmMessage: z.string(),
            suggestion: z.string(),
            }),
            generate: async ({ calmMessage, suggestion }) => {
            return (
                <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-full w-96 h-96 flex flex-col items-center justify-center text-center backdrop-blur-xl animate-in fade-in zoom-in duration-1000 shadow-2xl">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full animate-pulse blur-xl mb-4" />
                <h3 className="text-blue-200 font-light text-xl mb-2">{calmMessage}</h3>
                <p className="text-zinc-500 text-sm max-w-[200px] leading-relaxed">{suggestion}</p>
                
                <button 
                    data-action="reset"
                    className="mt-6 text-xs text-white/50 hover:text-white underline decoration-blue-500/50 underline-offset-4 transition-colors cursor-pointer"
                >
                    <span>Realign Systems</span>
                </button>
                </div>
            );
            },
        },
        },
    });

    return { ui: result.value };
}