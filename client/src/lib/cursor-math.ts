export interface Point {
    x: number;
    y: number;
    t: number; // Timestamp
}

/**
 * DETECT THRASHING (Confusion)
 * Concept: "High Effort, Low Progress"
 * If a user moves their mouse 500px but stays within a 100px box, they are lost.
 */
export function detectThrashing(history: Point[]): boolean {
    if (history.length < 10) return false;

    let totalDist = 0;
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    for (let i = 1; i < history.length; i++) {
        const p1 = history[i - 1];
        const p2 = history[i];
        
        // Euclidean Distance (Pythagorean Theorem)
        const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        totalDist += dist;

        // Update Bounding Box
        minX = Math.min(minX, p2.x);
        maxX = Math.max(maxX, p2.x);
        minY = Math.min(minY, p2.y);
        maxY = Math.max(maxY, p2.y);
    }

    const area = (maxX - minX) * (maxY - minY);
    
    // THE FORMULA: Density = Area / Distance
    // Low Density means the user is scribbling in a small spot (Frustrated).
    const density = area / (totalDist + 1); 

    return totalDist > 300 && area < 10000 && density < 20;
}

/**
 * DETECT RAGE CLICKS (Anger)
 * Concept: >3 clicks in <1 second within a 50px radius.
 */
export function detectRageClicks(clicks: Point[]): boolean {
    if (clicks.length < 3) return false;
    
    const now = Date.now();
    // Filter only clicks from the last 1000ms
    const recent = clicks.filter(c => now - c.t < 1000);

    if (recent.length < 3) return false;

    const origin = recent[0];
    const isConcentrated = recent.every(c => 
        Math.hypot(c.x - origin.x, c.y - origin.y) < 50
    );

    return isConcentrated;
}