import type { Point } from "./cursor-math";

const CORTEX_URL = "http://localhost:8000";

export async function sendSignalToCortex(history: Point[], type: "THRASHING" | "RAGE_CLICK") {
    try {
        const payload = {
        history: history, 
        type: type        
        };

        const response = await fetch(`${CORTEX_URL}/analyze`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Cortex rejected signal");

        const data = await response.json();
        console.log("🧠 Cortex Response:", data);
        return data;

    } catch (error) {
        console.error("⚠️ Cortex Connection Failed:", error);
        return null;
    }
}