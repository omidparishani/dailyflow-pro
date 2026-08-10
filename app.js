const $ = id => document.getElementById(id);
const fa = n => String(n).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);

let order = [];
let current = 0;
let drawing = false;
let times = {};          // { name: seconds }
let timerInterval = null;
let speakStart = null;   // timestamp when current person started
let sessionDone = false;
let barColors = {};      // random colors per person for summary

const names = $("names");

function getNames() {
  return [...new Set(names.value.split(/\r?\n/).map(x => x.trim()).filter(Boolean))];
}

function updateCount() {
  $("count").textContent = fa(getNames().length) + " نفر";
}

function shuffle(a) {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function esc(s) {
  return s.replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[c]));
}

function toast(t) {
  let x = $("toast");
  x.textContent = t;
  x.classList.add("show");
  setTimeout(() => x.classList.remove("show"), 1800);
}

function formatTime(sec) {
  sec = Math.max(0, Math.floor(sec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return fa(String(m).padStart(2, "0")) + ":" + fa(String(s).padStart(2, "0"));
}

function randomColor() {
  const hues = [210, 250, 280, 160, 30, 340, 190, 45];
  const h = hues[Math.floor(Math.random() * hues.length)];
  return `hsl(${h} 70% 55%)`;
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  if (speakStart !== null && order[current]) {
    const name = order[current];
    const elapsed = (Date.now() - speakStart) / 1000;
    times[name] = (times[name] || 0) + elapsed;
  }
  speakStart = null;
}

function startTimer() {
  stopTimer();
  speakStart = Date.now();
  $("timer").textContent = "۰۰:۰۰";
  timerInterval = setInterval(() => {
    if (speakStart === null) return;
    const elapsed = (Date.now() - speakStart) / 1000;
    $("timer").textContent = formatTime(elapsed);
  }, 250);
}

function renderOrderList() {
  $("order").innerHTML = order.map((n, i) => {
    let cls = "";
    if (i === current && !sessionDone) cls = "current";
    else if (i < current || (sessionDone && i <= current)) cls = "done";
    const timeStr = times[n] ? formatTime(times[n]) : "";
    return `<li class="${cls}" style="animation-delay:${i * 35}ms">
      <span class="num">${fa(i + 1)}</span>
      <span class="person">${esc(n)}</span>
      ${timeStr ? `<span class="time-badge">${timeStr}</span>` : ""}
      ${i === current && !sessionDone ? '<span class="badge">در حال صحبت</span>' : ""}
      ${i < current || (sessionDone && i <= current) ? '<span class="badge done-badge">✓ تمام شد</span>' : ""}
    </li>`;
  }).join("");
}

function render() {
  if (!order.length) {
    $("empty").classList.remove("hidden");
    $("order").innerHTML = "";
    $("speakingPanel").classList.add("hidden");
    $("summaryPanel").classList.add("hidden");
    $("status").textContent = "برای شروع قرعه‌کشی کن.";
    return;
  }

  $("empty").classList.add("hidden");
  renderOrderList();

  if (sessionDone) {
    $("speakingPanel").classList.add("hidden");
    $("status").textContent = "همه صحبت کردند 🎉";
    showSummary();
    return;
  }

  $("summaryPanel").classList.add("hidden");

  if (current < order.length) {
    $("speakingPanel").classList.remove("hidden");
    $("currentSpeaker").textContent = order[current];

    // نفر بعدی واقعی
    if (current + 1 < order.length) {
      $("nextPreview").classList.remove("hidden");
      $("nextName").textContent = order[current + 1];
    } else {
      $("nextPreview").classList.add("hidden");
      $("nextName").textContent = "—";
    }

    $("status").textContent = `${fa(current + 1)} از ${fa(order.length)} نفر`;
  } else {
    $("speakingPanel").classList.add("hidden");
    $("status").textContent = "همه صحبت کردند 🎉";
    showSummary();
  }
}

function showSummary() {
  stopTimer();
  sessionDone = true;
  $("summaryPanel").classList.remove("hidden");

  const total = Object.values(times).reduce((a, b) => a + b, 0) || 1;
  const namesInOrder = [...order];

  $("summaryBars").innerHTML = namesInOrder.map(n => {
    if (!barColors[n]) barColors[n] = randomColor();
    const sec = times[n] || 0;
    const pct = Math.max(2, (sec / total) * 100);
    return `<div class="summary-row">
      <div class="summary-label">
        <span>${esc(n)}</span>
        <span class="summary-time">${formatTime(sec)}</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width:${pct}%;background:${barColors[n]}"></div>
      </div>
    </div>`;
  }).join("");

  $("summaryTotal").textContent = `مجموع زمان: ${formatTime(total)}`;
  renderOrderList();
}

function historyRender() {
  let h = JSON.parse(localStorage.getItem("df_history") || "[]");
  $("history").innerHTML = h.length
    ? h.map(x => {
        // برای RTL از فلش ← استفاده می‌کنیم
        const orderStr = x.order.join(" ← ");
        return `<div class="history-item">
          <strong>${esc(orderStr)}</strong>
          <span>${esc(x.date)}</span>
        </div>`;
      }).join("")
    : "<p>هنوز قرعه‌کشی‌ای ثبت نشده.</p>";
}

function saveHistory() {
  let h = JSON.parse(localStorage.getItem("df_history") || "[]");
  h.unshift({
    order: [...order],
    date: new Date().toLocaleString("fa-IR", { dateStyle: "short", timeStyle: "short" })
  });
  localStorage.setItem("df_history", JSON.stringify(h.slice(0, 12)));
}

async function draw() {
  if (drawing) return;
  let n = getNames();
  if (n.length < 2) {
    toast("حداقل دو نفر وارد کن.");
    return;
  }

  drawing = true;
  stopTimer();
  times = {};
  barColors = {};
  sessionDone = false;
  current = 0;

  $("empty").classList.add("hidden");
  $("order").innerHTML = "";
  $("speakingPanel").classList.add("hidden");
  $("summaryPanel").classList.add("hidden");
  $("roulette").classList.remove("hidden");

  let pool = shuffle(n);
  let last = JSON.parse(localStorage.getItem("df_last") || "null");
  if ($("avoidRepeat").checked && last && pool[0] === last.first && pool.length > 1) {
    [pool[0], pool[1]] = [pool[1], pool[0]];
  }

  let cycles = Math.min(22, Math.max(10, n.length * 4));
  let i = 0;
  let timer = setInterval(() => {
    $("rouletteName").textContent = pool[i % n.length];
    i++;
  }, 70);

  await new Promise(r => setTimeout(r, Math.max(1200, cycles * 70)));
  clearInterval(timer);

  order = pool;
  drawing = false;
  $("roulette").classList.add("hidden");

  localStorage.setItem("df_last", JSON.stringify({ first: order[0], date: new Date().toISOString() }));
  saveHistory();
  render();
  startTimer();
  historyRender();
  toast("ترتیب امروز آماده شد ✨");
}

function finishCurrent(skip = false) {
  if (sessionDone || !order.length || current >= order.length) return;

  stopTimer();

  if (skip) {
    // زمان صفر یا خیلی کم برای اسکیپ
    times[order[current]] = times[order[current]] || 0;
    toast(order[current] + " رد شد");
  }

  current++;

  if (current >= order.length) {
    sessionDone = true;
    render();
    toast("همه صحبت کردند 🎉");
  } else {
    render();
    startTimer();
  }
}

// Event listeners
$("drawBtn").onclick = draw;
$("doneBtn").onclick = () => finishCurrent(false);
$("skipBtn").onclick = () => finishCurrent(true);

$("resetBtn").onclick = () => {
  if (!order.length) return;
  stopTimer();
  current = 0;
  times = {};
  barColors = {};
  sessionDone = false;
  $("summaryPanel").classList.add("hidden");
  render();
  startTimer();
  toast("از اول شروع شد");
};

names.oninput = () => {
  updateCount();
  localStorage.setItem("df_names", names.value);
};

$("clearBtn").onclick = () => {
  names.value = "";
  updateCount();
  stopTimer();
  order = [];
  current = 0;
  times = {};
  sessionDone = false;
  render();
  localStorage.removeItem("df_names");
};

$("sampleBtn").onclick = () => {
  names.value = "علی\nمحمد\nسارا\nرضا\nامیر";
  updateCount();
  localStorage.setItem("df_names", names.value);
};

$("clearHistory").onclick = () => {
  localStorage.removeItem("df_history");
  historyRender();
  toast("تاریخچه حذف شد");
};

$("themeBtn").onclick = () => {
  document.documentElement.classList.toggle("dark");
  let dark = document.documentElement.classList.contains("dark");
  localStorage.setItem("df_dark", dark);
  $("themeBtn").textContent = dark ? "☀" : "☾";
};

// Init
if (localStorage.getItem("df_names")) names.value = localStorage.getItem("df_names");
if (localStorage.getItem("df_dark") === "true") {
  document.documentElement.classList.add("dark");
  $("themeBtn").textContent = "☀";
}
$("today").textContent = new Date().toLocaleDateString("fa-IR", {
  weekday: "long", year: "numeric", month: "long", day: "numeric"
});
updateCount();
render();
historyRender();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
