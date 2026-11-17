if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then((reg) => console.log("SW зарегистрирован, scope:", reg.scope))
            .catch((err) => console.error("SW ошибка:", err));
    });
}

const clockEl = document.getElementById("clock");
const tzEl = document.getElementById("timezone");
const toggleEl = document.getElementById("formatToggle");
const refreshBtn = document.getElementById("refreshBtn");
const statusEl = document.getElementById("status");

function getTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function is12h() {
    return toggleEl ? toggleEl.checked : false;
}

async function fetchTime() {
    const fmt = is12h() ? "12" : "24";
    try {
        const res = await fetch(`/api/time?format=${fmt}`, { cache: "no-store" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();

        renderLocalTime(is12h());

        statusEl.textContent = `Сервер: ${data.format}, OK`;
        statusEl.className = "status online";
    } catch (err) {
        console.warn("Сервер недоступен, показываем локальное время:", err);
        renderLocalTime(is12h());
        statusEl.textContent = "Офлайн — локальное время";
        statusEl.className = "status offline";
    }
}

function renderLocalTime(use12h) {
    const now = new Date();
    const opts = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: use12h,
    };
    clockEl.textContent = now.toLocaleTimeString([], opts);
    tzEl.textContent = `Часовой пояс: ${getTimezone()}`;
}

function tick() {
    renderLocalTime(is12h());
}

if (clockEl) {
    fetchTime();

    setInterval(tick, 1000);

    if (toggleEl) {
        toggleEl.addEventListener("change", fetchTime);
    }
    if (refreshBtn) {
        refreshBtn.addEventListener("click", fetchTime);
    }
}

window.addEventListener("online", () => {
    statusEl.textContent = "Снова онлайн";
    statusEl.className = "status online";
    fetchTime();
});
window.addEventListener("offline", () => {
    statusEl.textContent = "Офлайн-режим";
    statusEl.className = "status offline";
});