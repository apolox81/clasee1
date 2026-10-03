(() => {
  const CHAT_URL = "https://copilotstudio.microsoft.com/environments/fcb908f6-0b5b-e8c8-aeff-53f2c0aa0618/bots/cr9a0_avalestics_g4cDe9/webchat?__version__=2&enableFileAttachment=false&cliAgent=true";
  const $ = id => document.getElementById(id);
  const frame = $("chat"), loader = $("loader"), errBox = $("error");
  const dot = $("statusDot"), statusText = $("statusText"), statusSub = $("statusSub");
  let timer;

  function setStatus(kind, text, sub) {
    dot.className = "dot " + kind;
    statusText.textContent = text;
    statusSub.textContent = sub;
  }

  function load() {
    clearTimeout(timer);
    frame.classList.remove("ready");
    loader.classList.remove("done");
    errBox.classList.add("hidden");
    setStatus("", "Conectando…", "Microsoft Copilot Studio");
    frame.src = "about:blank";
    setTimeout(() => { frame.src = CHAT_URL; }, 50);
    timer = setTimeout(() => {
      if (!frame.classList.contains("ready")) fail();
    }, 30000);
  }

  function fail() {
    errBox.classList.remove("hidden");
    setStatus("err", "Sin conexión", "No se pudo cargar");
  }

  frame.addEventListener("load", () => {
    if (frame.src === "about:blank" || !frame.src.includes("copilotstudio")) return;
    clearTimeout(timer);
    frame.classList.add("ready");
    loader.classList.add("done");
    setStatus("ok", "En línea", "Avalestics listo");
  });

  window.addEventListener("offline", fail);
  window.addEventListener("online", load);

  // Pantalla completa (modo inmersivo)
  function toggleFull() {
    const app = $("app");
    app.classList.toggle("full");
    if (app.classList.contains("full")) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  }
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") $("app").classList.remove("full");
  });
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) $("app").classList.remove("full");
  });

  // Tema
  const saved = localStorage.getItem("avalestic-theme");
  if (saved) document.documentElement.dataset.theme = saved;
  function toggleTheme() {
    const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = t;
    localStorage.setItem("avalestic-theme", t);
  }

  // Reloj
  function tick() {
    $("clock").textContent = new Date().toLocaleString("es-CO", {
      weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit"
    });
  }
  tick(); setInterval(tick, 30000);
  $("year").textContent = new Date().getFullYear();

  $("btnReload").onclick = $("btnReloadTop").onclick = $("btnRetry").onclick = load;
  $("btnFullscreen").onclick = $("btnFullscreenTop").onclick = toggleFull;
  $("btnTheme").onclick = toggleTheme;
  $("btnNewTab").onclick = () => window.open(CHAT_URL, "_blank", "noopener");
  $("btnMenu").onclick = () => $("sidebar").classList.toggle("open");

  load();
})();
