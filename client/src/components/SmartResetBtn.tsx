"use client";

import { useState } from "react";

export function SmartResetBtn({ label, color }: { label: string, color: "red" | "blue" }) {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true);
        setTimeout(() => {
        window.location.reload();
        }, 1500);
    };

    if (color === "red") {
        return (
        <button 
            onClick={handleClick}
            disabled={loading}
            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-black font-bold py-3 px-4 uppercase tracking-widest transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(220,38,38,0.5)]"
        >
            {loading ? "PURGING SYSTEM..." : `[ ${label} ]`}
        </button>
        );
    }

    return (
        <button 
        onClick={handleClick}
        disabled={loading}
        className="mt-6 text-xs text-white/50 hover:text-white underline decoration-blue-500/50 underline-offset-4 disabled:opacity-50 transition-colors"
        >
        {loading ? "Realigning Systems..." : label}
        </button>
    );
}