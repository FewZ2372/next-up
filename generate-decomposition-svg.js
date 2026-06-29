const fs = require("fs");

const colors = {
  background: "#050505",
  surface: "#111111",
  surfaceRaised: "#181818",
  surfaceMuted: "#202020",
  border: "#2D2D2D",
  text: "#F6F7F2",
  textMuted: "#A3A99D",
  accent: "#D6FF2F",
  accentSoft: "#2A3410",
  danger: "#FF6767",
  success: "#4BE58A",
};

const width = 2200;
const margin = 56;
const columns = [
  { key: "atoms", title: "01 Atomos", x: 220, w: 360 },
  { key: "molecules", title: "02 Moleculas", x: 610, w: 390 },
  { key: "organisms", title: "03 Organismos", x: 1030, w: 470 },
  { key: "page", title: "04 Pantalla completa", x: 1530, w: 390 },
];
const out = [];

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function id(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function text(x, y, value, options = {}) {
  const {
    size = 13,
    fill = colors.text,
    weight = 400,
    anchor = "start",
    letterSpacing,
  } = options;
  return `<text x="${x}" y="${y}" font-family="Inter" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${letterSpacing ? ` letter-spacing="${letterSpacing}"` : ""}>${esc(value)}</text>`;
}

function rect(x, y, w, h, options = {}) {
  const {
    fill = "none",
    stroke = "none",
    strokeWidth = 1,
    rx = 0,
    opacity,
    fillOpacity,
  } = options;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${opacity ? ` opacity="${opacity}"` : ""}${fillOpacity ? ` fill-opacity="${fillOpacity}"` : ""}/>`;
}

function group(name, body) {
  return `<g id="${id(name)}">${body}</g>`;
}

function line(x1, y1, x2, y2) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${colors.border}" stroke-width="1"/>`;
}

function chip(x, y, label, selected = false) {
  const w = Math.max(label.length * 7.2 + 30, 70);
  return {
    w,
    h: 38,
    svg: group(`chip-${label}`, [
      rect(x, y, w, 38, {
        rx: 19,
        fill: selected ? colors.accentSoft : colors.surface,
        stroke: selected ? colors.accent : colors.border,
      }),
      text(x + w / 2, y + 24, label, {
        size: 13,
        fill: selected ? colors.accent : colors.textMuted,
        weight: 600,
        anchor: "middle",
      }),
    ].join("")),
  };
}

function button(x, y, label, variant = "primary", w = null) {
  const bw = w || Math.max(label.length * 8 + 48, 106);
  const fill =
    variant === "primary" ? colors.accent :
    variant === "secondary" ? colors.surfaceRaised :
    variant === "success" ? colors.success :
    "transparent";
  const stroke =
    variant === "primary" ? colors.accent :
    variant === "danger" ? colors.danger :
    variant === "success" ? colors.success :
    colors.border;
  const labelFill = variant === "primary" || variant === "success" ? "#111111" : colors.text;
  return {
    w: bw,
    h: 48,
    svg: group(`button-${label}`, [
      rect(x, y, bw, 48, { rx: 24, fill, stroke }),
      text(x + bw / 2, y + 30, label, {
        size: 14,
        fill: labelFill,
        weight: 700,
        anchor: "middle",
      }),
    ].join("")),
  };
}

function input(x, y, label, placeholder, search = false) {
  const icon = search
    ? `<circle cx="${x + 23}" cy="${y + 27}" r="6.5" fill="none" stroke="${colors.textMuted}" stroke-width="1.8"/><path d="M${x + 28} ${y + 32} ${x + 33} ${y + 37}" stroke="${colors.textMuted}" stroke-width="1.8" stroke-linecap="round"/>`
    : "";
  return {
    w: 300,
    h: label ? 76 : 54,
    svg: group(`input-${label || placeholder}`, [
      label ? text(x, y + 13, label, { size: 14, weight: 700 }) : "",
      rect(x, y + (label ? 22 : 0), 300, 54, { rx: 18, fill: colors.surface, stroke: colors.border }),
      icon,
      text(x + (search ? 46 : 16), y + (label ? 57 : 34), placeholder, { size: 15, fill: colors.textMuted }),
    ].join("")),
  };
}

function atomList(x, y, items) {
  const parts = [];
  let yy = y;
  items.forEach((item) => {
    const label = item.label.toLowerCase();
    const isEyebrow = label.includes("eyebrow");
    const isTitle = label.includes("titulo") || label.includes("title") || label.includes("nombre") || label.includes("card");
    const isButton = label.includes("texto boton");
    const isOverlay = label.includes("overlay");
    const isLabel = label.includes("label") || label.includes("summary") || label.includes("stat");
    const tone = item.tone === "accent" || isEyebrow ? colors.accent : item.tone === "muted" ? colors.textMuted : colors.text;
    const value = isEyebrow || isOverlay || isLabel ? String(item.value).toUpperCase() : item.value;
    const weight = isEyebrow || isTitle || isButton || isOverlay || isLabel || item.tone === "accent" ? 800 : 400;
    const size = isEyebrow ? 12 : isTitle ? 15 : isButton ? 15 : 13;
    const letterSpacing = isEyebrow ? 1.1 : isOverlay ? 1.2 : isLabel ? 0.8 : undefined;
    parts.push(group(`atom-${item.label}-${item.value}`, [
      text(x, yy, item.label.toUpperCase(), { size: 10, fill: colors.textMuted, weight: 800, letterSpacing: 0.7 }),
      text(x, yy + 20, value, { size, fill: tone, weight, letterSpacing }),
    ].join("")));
    yy += item.large ? 58 : 46;
  });
  return { h: yy - y, svg: group("atoms", parts.join("")) };
}

function flowItems(x, y, items) {
  const parts = [];
  let xx = x;
  let yy = y;
  let rowH = 0;
  items.forEach((item) => {
    const made = item.draw(xx, yy);
    if (xx + made.w > x + 360 && xx > x) {
      xx = x;
      yy += rowH + 18;
      rowH = 0;
    }
    const retry = xx === x && rowH === 0 ? item.draw(xx, yy) : made;
    parts.push(retry.svg);
    xx += retry.w + 14;
    rowH = Math.max(rowH, retry.h);
  });
  return { h: yy - y + rowH, svg: group("items", parts.join("")) };
}

function organismPanel(x, y, title, body, buttonLabel) {
  return {
    w: 360,
    h: 150,
    svg: group(`organism-${title}`, [
      rect(x, y, 360, 150, { rx: 24, fill: colors.surfaceRaised, stroke: colors.border }),
      text(x + 20, y + 42, title, { size: 20, weight: 800 }),
      text(x + 20, y + 70, body, { size: 13, fill: colors.textMuted }),
      buttonLabel ? button(x + 20, y + 92, buttonLabel).svg : "",
    ].join("")),
  };
}

function cardMini(x, y, title = "Dune: Part Two") {
  return {
    w: 300,
    h: 230,
    svg: group(`title-card-${title}`, [
      rect(x, y, 300, 230, { rx: 22, fill: colors.surfaceRaised, stroke: colors.border }),
      rect(x, y, 300, 88, { rx: 22, fill: "#5D432C" }),
      rect(x + 14, y + 22, 66, 22, { rx: 11, fill: "#000000", fillOpacity: 0.35 }),
      text(x + 47, y + 37, "Pelicula", { size: 10, weight: 700, anchor: "middle" }),
      text(x + 14, y + 72, title, { size: 17, weight: 800 }),
      text(x + 14, y + 106, "Una tormenta de arena de profecia.", { size: 12, fill: colors.text }),
      chip(x + 14, y + 126, "Drama").svg,
      chip(x + 86, y + 126, "Accion").svg,
      text(x + 14, y + 180, "Disponible en", { size: 11, fill: colors.accent, weight: 700 }),
      rect(x + 14, y + 194, 84, 24, { rx: 12, fill: colors.surface, stroke: colors.border }),
      text(x + 56, y + 210, "Max", { size: 11, weight: 700, anchor: "middle" }),
    ].join("")),
  };
}

function tabBar(x, y) {
  return {
    w: 300,
    h: 60,
    svg: group("tab-bar", [
      rect(x, y, 300, 60, { fill: colors.surface, stroke: colors.border }),
      text(x + 50, y + 38, "Inicio", { size: 12, fill: colors.accent, weight: 600, anchor: "middle" }),
      text(x + 150, y + 38, "Mi lista", { size: 12, fill: colors.textMuted, weight: 600, anchor: "middle" }),
      text(x + 250, y + 38, "Perfil", { size: 12, fill: colors.textMuted, weight: 600, anchor: "middle" }),
    ].join("")),
  };
}

function phonePage(x, y, screen) {
  const parts = [
    rect(x, y, 300, 650, { rx: 30, fill: colors.background, stroke: colors.border }),
    text(x + 24, y + 48, screen.eyebrow, { size: 12, fill: colors.accent, weight: 800, letterSpacing: 1.1 }),
    text(x + 24, y + 84, screen.title, { size: 22, weight: 800 }),
    text(x + 24, y + 112, screen.body, { size: 12, fill: colors.textMuted }),
  ];
  let yy = y + 148;
  screen.pageBlocks.forEach((block) => {
    const made = block(x + 24, yy);
    parts.push(made.svg);
    yy += made.h + 18;
  });
  if (screen.tab) {
    parts.push(tabBar(x, y + 590).svg);
  }
  return { w: 300, h: 650, svg: group(`page-${screen.name}`, parts.join("")) };
}

const screens = [
  {
    name: "AuthScreen",
    eyebrow: "Bienvenido",
    title: "Peliculas y series mejor ordenadas",
    body: "Una seleccion mas precisa segun tus gustos.",
    atoms: [
      ["Brand", "NEXT UP", "accent"], ["Eyebrow", "BIENVENIDO", "accent"], ["Titulo", "Peliculas y series mejor ordenadas"], ["Label", "Nombre"], ["Placeholder", "Tu nombre", "muted"], ["Label", "Mail"], ["Texto boton", "Ingresar"],
    ],
    molecules: [
      { draw: (x, y) => input(x, y, "Nombre", "Tu nombre") },
      { draw: (x, y) => input(x, y, "Mail", "tu@email.com") },
      { draw: (x, y) => button(x, y, "Ingresar", "primary", 300) },
    ],
    organisms: [
      { draw: (x, y) => organismPanel(x, y, "Bienvenido", "Peliculas y series mejor ordenadas.", "Ingresar") },
    ],
    pageBlocks: [(x, y) => organismPanel(x, y, "Bienvenido", "Peliculas y series mejor ordenadas.", "Ingresar")],
  },
  {
    name: "PreferencesScreen",
    eyebrow: "Perfil",
    title: "Tus plataformas y tus generos.",
    body: "Elegi donde podes mirar.",
    atoms: [["Eyebrow", "PERFIL", "accent"], ["Titulo", "Tus plataformas y tus generos."], ["Chip", "Netflix"], ["Chip", "Drama"], ["Summary", "2 plataformas / 2 generos"], ["Texto boton", "Continuar"]],
    molecules: [
      { draw: (x, y) => chip(x, y, "Netflix", true) },
      { draw: (x, y) => chip(x, y, "Disney+") },
      { draw: (x, y) => chip(x, y, "Drama", true) },
      { draw: (x, y) => button(x, y, "Continuar", "primary", 300) },
    ],
    organisms: [{ draw: (x, y) => organismPanel(x, y, "Plataformas suscritas", "Netflix / Max / Disney+", "Continuar") }],
    pageBlocks: [(x, y) => organismPanel(x, y, "Plataformas suscritas", "Netflix / Max / Disney+", "Continuar")],
  },
  {
    name: "PreferencesPeopleScreen",
    eyebrow: "Referentes",
    title: "Directores y actores.",
    body: "Marca algunos nombres clave.",
    atoms: [["Titulo", "Directores y actores."], ["Chip", "Denis Villeneuve"], ["Placeholder", "Buscar director", "muted"], ["Chip", "Zendaya"], ["Texto boton", "Volver"], ["Texto boton", "Continuar"]],
    molecules: [
      { draw: (x, y) => chip(x, y, "Denis Villeneuve", true) },
      { draw: (x, y) => input(x, y, "", "Buscar director", true) },
      { draw: (x, y) => chip(x, y, "Zendaya", true) },
      { draw: (x, y) => button(x, y, "Continuar", "primary", 300) },
    ],
    organisms: [{ draw: (x, y) => organismPanel(x, y, "Directores", "Denis Villeneuve / Celine Song", "Continuar") }],
    pageBlocks: [(x, y) => organismPanel(x, y, "Directores", "Denis Villeneuve / Celine Song", "Continuar")],
  },
  {
    name: "RecapScreen",
    eyebrow: "Puesta al dia",
    title: "Historial reciente",
    body: "1 de 12.",
    atoms: [["Titulo", "Historial reciente"], ["Card titulo", "Dune: Part Two"], ["Overlay", "AUN NO"], ["Overlay", "YA LO VI"], ["Texto boton", "Aun no"], ["Texto boton", "Ya lo vi"]],
    molecules: [
      { draw: (x, y) => cardMini(x, y, "Dune: Part Two") },
      { draw: (x, y) => button(x, y, "Aun no", "secondary") },
      { draw: (x, y) => button(x, y, "Ya lo vi", "primary") },
    ],
    organisms: [{ draw: (x, y) => cardMini(x, y, "Dune: Part Two") }],
    pageBlocks: [(x, y) => cardMini(x, y, "Dune: Part Two")],
  },
  {
    name: "HomeScreen",
    eyebrow: "Inicio",
    title: "Resumen de hoy, Invitado.",
    body: "Peliculas, series y novedades.",
    atoms: [["Hero titulo", "Tu proxima eleccion"], ["Texto boton", "Que ver hoy?"], ["Meta", "2 titulos guardados", "accent"], ["News", "Furiosa ya se incorporo"], ["Tab", "INICIO", "accent"]],
    molecules: [
      { draw: (x, y) => button(x, y, "Que ver hoy?") },
      { draw: (x, y) => organismPanel(x, y, "Estreno", "Furiosa ya se incorporo al catalogo.", null) },
      { draw: (x, y) => tabBar(x, y) },
    ],
    organisms: [{ draw: (x, y) => organismPanel(x, y, "Tu proxima eleccion", "Una seleccion afinada.", "Que ver hoy?") }],
    pageBlocks: [(x, y) => organismPanel(x, y, "Tu proxima eleccion", "Una seleccion afinada.", "Que ver hoy?")],
    tab: true,
  },
  {
    name: "HomeDiscoverScreen",
    eyebrow: "Inicio",
    title: "Que ver hoy",
    body: "Seleccion emocional.",
    atoms: [["Icono", "Back"], ["Slider label", "Relajante"], ["Dropdown", "Generos"], ["Card titulo", "Dune: Part Two"], ["Texto boton", "Guardar"]],
    molecules: [
      { draw: (x, y) => input(x, y, "", "Generos") },
      { draw: (x, y) => cardMini(x, y, "Dune: Part Two") },
      { draw: (x, y) => button(x, y, "Guardar") },
    ],
    organisms: [{ draw: (x, y) => organismPanel(x, y, "Filtros", "Relajante / Emocionante / Generos", null) }],
    pageBlocks: [(x, y) => organismPanel(x, y, "Filtros", "Relajante / Emocionante / Generos", null), (x, y) => cardMini(x, y, "Dune: Part Two")],
  },
  {
    name: "WatchlistScreen",
    eyebrow: "Mi lista",
    title: "Tus titulos guardados.",
    body: "Peliculas y series listas.",
    atoms: [["Titulo", "Tus titulos guardados."], ["Texto boton", "Ya vistas"], ["Card", "Past Lives"], ["Texto boton", "Quitar"], ["Texto boton", "Ya la vi"]],
    molecules: [{ draw: (x, y) => button(x, y, "Ya vistas", "secondary", 300) }, { draw: (x, y) => cardMini(x, y, "Past Lives") }],
    organisms: [{ draw: (x, y) => organismPanel(x, y, "Mi lista", "1 titulo visto", "Ya vistas") }],
    pageBlocks: [(x, y) => organismPanel(x, y, "Mi lista", "1 titulo visto", "Ya vistas"), (x, y) => cardMini(x, y, "Past Lives")],
    tab: true,
  },
  {
    name: "WatchlistSeenScreen",
    eyebrow: "Mi lista",
    title: "Ya vistas",
    body: "Historial visto.",
    atoms: [["Icono", "Back"], ["Titulo", "Ya vistas"], ["Card", "Furiosa"], ["Empty title", "Todavia no marcaste titulos"]],
    molecules: [{ draw: (x, y) => cardMini(x, y, "Furiosa") }],
    organisms: [{ draw: (x, y) => organismPanel(x, y, "Ya vistas", "Todavia no marcaste titulos.", null) }],
    pageBlocks: [(x, y) => cardMini(x, y, "Furiosa")],
  },
  {
    name: "SettingsScreen",
    eyebrow: "Perfil",
    title: "Tu cuenta y tus preferencias.",
    body: "Edita tus datos.",
    atoms: [["Avatar", "I"], ["Nombre", "Invitado"], ["Email", "sin@mail.com"], ["Stat", "2 GUARDADOS"], ["Texto boton", "Cerrar sesion"]],
    molecules: [{ draw: (x, y) => button(x, y, "Editar perfil", "secondary", 300) }, { draw: (x, y) => button(x, y, "Cerrar sesion", "danger", 300) }],
    organisms: [{ draw: (x, y) => organismPanel(x, y, "Invitado", "sin@mail.com / 2 guardados", "Editar perfil") }],
    pageBlocks: [(x, y) => organismPanel(x, y, "Invitado", "sin@mail.com / 2 guardados", "Editar perfil")],
    tab: true,
  },
  {
    name: "NotificationsScreen",
    eyebrow: "Alertas",
    title: "Actividad reciente",
    body: "Cambios de catalogo.",
    atoms: [["Label", "CATALOGO", "accent"], ["Timestamp", "Hoy / 18:10"], ["Titulo", "Past Lives sale de Prime Video"], ["Body", "Seguira disponible en MUBI"]],
    molecules: [{ draw: (x, y) => organismPanel(x, y, "Catalogo", "Past Lives sale de Prime Video.", null) }],
    organisms: [{ draw: (x, y) => organismPanel(x, y, "Actividad reciente", "Catalogo / Estreno / Serie", null) }],
    pageBlocks: [(x, y) => organismPanel(x, y, "Actividad reciente", "Catalogo / Estreno / Serie", null)],
  },
];

function drawHeader() {
  out.push(group("document-title", [
    text(margin, 58, "NEXT UP", { size: 13, fill: colors.accent, weight: 800, letterSpacing: 3 }),
    text(margin, 106, "Descomposicion editable para Illustrator", { size: 30, weight: 800 }),
    text(margin, 138, "Orden ascendente: Atomos -> Moleculas -> Organismos -> Pantalla completa.", { size: 15, fill: colors.textMuted }),
  ].join("")));
  columns.forEach((col) => {
    out.push(group(`column-header-${col.title}`, [
      rect(col.x, 178, col.w, 34, { rx: 17, fill: "#080808", stroke: colors.border }),
      text(col.x + 16, 200, col.title, { size: 12, fill: colors.accent, weight: 800, letterSpacing: 1.1 }),
    ].join("")));
  });
}

function drawScreen(screen, y) {
  out.push(line(margin, y - 28, width - margin, y - 28));
  out.push(text(margin, y + 4, screen.name, { size: 12, fill: colors.accent, weight: 800, letterSpacing: 1.1 }));

  const atoms = atomList(columns[0].x, y + 38, screen.atoms.map(([label, value, tone]) => ({ label, value, tone })));
  out.push(group(`${screen.name}-atoms`, atoms.svg));

  const molecules = flowItems(columns[1].x, y + 38, screen.molecules);
  out.push(group(`${screen.name}-molecules`, molecules.svg));

  const organisms = flowItems(columns[2].x, y + 38, screen.organisms);
  out.push(group(`${screen.name}-organisms`, organisms.svg));

  const page = phonePage(columns[3].x, y + 38, screen);
  out.push(group(`${screen.name}-page`, page.svg));

  return y + Math.max(atoms.h, molecules.h, organisms.h, page.h) + 110;
}

let y = 250;
out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="__HEIGHT__" viewBox="0 0 ${width} __HEIGHT__">`);
out.push(rect(0, 0, width, "__HEIGHT__", { fill: colors.background }));
drawHeader();
screens.forEach((screen) => {
  y = drawScreen(screen, y);
});
out.push("</svg>");

const svg = out.join("\n").replaceAll("__HEIGHT__", String(Math.ceil(y + 40)));
fs.writeFileSync("ui-kit-decomposition-editable.svg", svg);
console.log(`Wrote ui-kit-decomposition-editable.svg (${width}x${Math.ceil(y + 40)})`);

