export function todayISO() {
    return new Date().toISOString().slice(0, 10);
}

export function nowHHMM() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function formatDate(iso) {
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
}

export function diffDaysInclusive(from, to) {
    const a = new Date(from);
    const b = new Date(to);
    return Math.round((b - a) / 86400000) + 1;
}

export function workedHours(checkIn, checkOut) {
    if (!checkIn || !checkOut) return null;
    const [h1, m1] = checkIn.split(":").map(Number);
    const [h2, m2] = checkOut.split(":").map(Number);
    const mins = h2 * 60 + m2 - (h1 * 60 + m1);
    return Math.round((mins / 60) * 10) / 10;
}