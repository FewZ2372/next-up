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
  accentDeep: "#8AA600",
  accentSoft: "#2A3410",
  danger: "#FF6767",
  success: "#4BE58A",
  warning: "#FFBD59",
  shadow: "#000000",
};

const out = [];
let height = 0;
const width = 1800;
const margin = 64;
const colGap = 36;
const rowGap = 42;
const cardW = 260;

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

function push(markup) {
  out.push(markup);
}

function text(x, y, value, options = {}) {
  const {
    size = 14,
    fill = colors.text,
    weight = 400,
    family = "Inter",
    anchor = "start",
    letterSpacing,
    transform,
    fillOpacity,
  } = options;
  const extra = [
    `font-family="${family}"`,
    `font-size="${size}"`,
    `font-weight="${weight}"`,
    `fill="${fill}"`,
    `text-anchor="${anchor}"`,
    letterSpacing ? `letter-spacing="${letterSpacing}"` : "",
    transform ? `transform="${transform}"` : "",
    fillOpacity ? `fill-opacity="${fillOpacity}"` : "",
  ]
    .filter(Boolean)
    .join(" ");
  return `<text x="${x}" y="${y}" ${extra}>${esc(value)}</text>`;
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

function line(x1, y1, x2, y2, stroke = colors.border, strokeWidth = 1) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
}

function group(groupId, body, label) {
  return `<g id="${id(groupId)}">${label ? `<title>${esc(label)}</title>` : ""}${body}</g>`;
}

function sectionTitle(y, title) {
  push(group(`section-${title}`, [
    line(margin, y - 22, width - margin, y - 22),
    text(margin, y, title.toUpperCase(), {
      size: 12,
      fill: colors.accent,
      weight: 800,
      letterSpacing: 1.1,
    }),
  ].join("")));
  return y + 34;
}

function itemLabel(x, y, label) {
  return text(x, y, label, { size: 12, fill: colors.textMuted, weight: 400 });
}

function button(x, y, label, variant = "primary", options = {}) {
  const width = Math.max(options.width || 0, label.length * 8 + 48, 104);
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
    w: width,
    h: 52,
    svg: group(`button-${variant}-${label}`, [
      rect(x, y, width, 52, { rx: 26, fill, stroke }),
      text(x + width / 2, y + 32, label, {
        size: 15,
        fill: labelFill,
        weight: 700,
        anchor: "middle",
      }),
    ].join(""), `Button ${variant} ${label}`),
  };
}

function chip(x, y, label, selected = false) {
  const width = Math.max(label.length * 7.4 + 32, 72);
  return {
    w: width,
    h: 42,
    svg: group(`chip-${selected ? "selected" : "idle"}-${label}`, [
      rect(x, y, width, 42, {
        rx: 21,
        fill: selected ? colors.accentSoft : colors.surface,
        stroke: selected ? colors.accent : colors.border,
      }),
      text(x + width / 2, y + 27, label, {
        size: 14,
        fill: selected ? colors.accent : colors.textMuted,
        weight: 600,
        anchor: "middle",
      }),
    ].join(""), `ChoiceChip ${label}`),
  };
}

function pill(x, y, label) {
  const width = Math.max(label.length * 6.8 + 20, 54);
  return {
    w: width,
    h: 28,
    svg: group(`pill-${label}`, [
      rect(x, y, width, 28, { rx: 14, fill: colors.surface }),
      text(x + width / 2, y + 18, label, {
        size: 11,
        fill: colors.textMuted,
        weight: 700,
        anchor: "middle",
      }),
    ].join(""), `Genre pill ${label}`),
  };
}

function inputField(x, y, label, value, search = false) {
  const icon = search ? searchIcon(x + 18, y + 19, colors.textMuted) : "";
  const textX = search ? x + 44 : x + 16;
  return group(`field-${label}-${value}`, [
    label ? text(x, y - 12, label, { size: 15, fill: colors.text, weight: 700 }) : "",
    rect(x, y, 280, 56, { rx: 18, fill: colors.surface, stroke: colors.border }),
    icon,
    text(textX, y + 35, value, { size: 16, fill: colors.textMuted }),
  ].join(""), `Field ${label || value}`);
}

function platformBadge(x, y, platform, logoText) {
  const labelW = platform.length * 7 + 18;
  const w = 86 + labelW;
  return {
    w,
    h: 34,
    svg: group(`platform-badge-${platform}`, [
      rect(x, y, w, 34, { rx: 17, fill: colors.surface, stroke: colors.border }),
      rect(x + 5, y + 5, 62, 24, { rx: 12, fill: "#FFFFFF" }),
      text(x + 36, y + 21, logoText, {
        size: logoText.length > 7 ? 8 : 10,
        fill: "#111111",
        weight: 800,
        anchor: "middle",
      }),
      text(x + 76, y + 22, platform, { size: 11, fill: colors.text, weight: 700 }),
    ].join(""), `Platform badge ${platform}`),
  };
}

function searchIcon(x, y, stroke = colors.text) {
  return group("icon-search", [
    `<circle cx="${x + 7}" cy="${y + 7}" r="6.5" fill="none" stroke="${stroke}" stroke-width="1.8"/>`,
    `<path d="M${x + 12} ${y + 12} ${x + 16} ${y + 16}" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round"/>`,
  ].join(""), "Search icon");
}

function backIcon(x, y, stroke = colors.text) {
  return group("icon-back", `<path d="M${x + 15} ${y + 5} ${x + 8} ${y + 12} ${x + 15} ${y + 19}" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`, "Back icon");
}

function chevronIcon(x, y, open = false, stroke = colors.text) {
  const d = open
    ? `M${x + 6} ${y + 14} ${x + 12} ${y + 8} ${x + 18} ${y + 14}`
    : `M${x + 6} ${y + 10} ${x + 12} ${y + 16} ${x + 18} ${y + 10}`;
  return group(`icon-chevron-${open ? "up" : "down"}`, `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`, `Chevron ${open ? "up" : "down"}`);
}

function tabHomeIcon(x, y, stroke) {
  return group("icon-tab-home", `<path d="M${x + 12} ${y + 3.5} ${x + 13.9} ${y + 8.1} ${x + 18.5} ${y + 10} ${x + 13.9} ${y + 11.9} ${x + 12} ${y + 16.5} ${x + 10.1} ${y + 11.9} ${x + 5.5} ${y + 10} ${x + 10.1} ${y + 8.1} ${x + 12} ${y + 3.5}Z" fill="none" stroke="${stroke}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`, "Home tab icon");
}

function tabWatchIcon(x, y, stroke) {
  return group("icon-tab-watchlist", `<path d="M${x + 8} ${y + 4.5}h8a1.5 1.5 0 0 1 1.5 1.5v13l-5.5-3-5.5 3V6A1.5 1.5 0 0 1 ${x + 8} ${y + 4.5}Z" fill="none" stroke="${stroke}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`, "Watchlist tab icon");
}

function tabProfileIcon(x, y, stroke) {
  return group("icon-tab-profile", [
    `<circle cx="${x + 12}" cy="${y + 8}" r="3.2" fill="none" stroke="${stroke}" stroke-width="1.9"/>`,
    `<path d="M${x + 6.5} ${y + 19}c1.2-3 3.1-4.5 5.5-4.5s4.3 1.5 5.5 4.5" fill="none" stroke="${stroke}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`,
  ].join(""), "Profile tab icon");
}

function swatch(x, y, name, value) {
  return group(`color-${name}`, [
    rect(x, y, 180, 76, { rx: 18, fill: value, stroke: colors.border }),
    text(x, y + 106, name, { size: 13, fill: colors.textMuted, weight: 700 }),
    text(x, y + 126, value, { size: 12, fill: colors.textMuted }),
  ].join(""), `Color ${name}`);
}

function drawWrapped(items, y, draw) {
  let x = margin;
  let currentY = y;
  let rowH = 0;
  for (const item of items) {
    const size = draw(item, x, currentY);
    if (x + size.w > width - margin && x > margin) {
      x = margin;
      currentY += rowH + rowGap;
      rowH = 0;
      const retry = draw(item, x, currentY);
      push(retry.svg);
      x += retry.w + colGap;
      rowH = Math.max(rowH, retry.h);
    } else {
      push(size.svg);
      x += size.w + colGap;
      rowH = Math.max(rowH, size.h);
    }
  }
  return currentY + rowH + 72;
}

function drawLabeledItems(items, y, draw) {
  let x = margin;
  let currentY = y;
  let rowH = 0;
  for (const item of items) {
    const size = draw(item, x, currentY + 22);
    const totalW = Math.max(size.w, cardW);
    if (x + totalW > width - margin && x > margin) {
      x = margin;
      currentY += rowH + rowGap;
      rowH = 0;
      const retry = draw(item, x, currentY + 22);
      push(group(`item-${item.label}`, [
        itemLabel(x, currentY, item.label),
        retry.svg,
      ].join("")));
      x += Math.max(retry.w, cardW) + colGap;
      rowH = Math.max(rowH, retry.h + 22);
    } else {
      push(group(`item-${item.label}`, [
        itemLabel(x, currentY, item.label),
        size.svg,
      ].join("")));
      x += totalW + colGap;
      rowH = Math.max(rowH, size.h + 22);
    }
  }
  return currentY + rowH + 74;
}

function drawTypographySample(item, x, y) {
  const sizes = {
    brand: [13, 800, colors.accent, 3],
    eyebrow: [12, 800, colors.accent, 1.1],
    titleLarge: [30, 800, colors.text],
    titleMedium: [24, 800, colors.text],
    titleSmall: [17, 800, colors.text],
    body: [15, 400, colors.textMuted],
    bodySmall: [14, 400, colors.textMuted],
    caption: [12, 400, colors.textMuted],
    captionBold: [13, 700, colors.textMuted],
  };
  const [size, weight, fill, letterSpacing] = sizes[item.kind];
  return {
    w: 360,
    h: Math.max(40, size + 14),
    svg: group(`type-${item.kind}-${item.value}`, text(x, y + size, item.value, {
      size,
      weight,
      fill,
      letterSpacing,
    }), `Typography ${item.kind}`),
  };
}

function titleCard(x, y) {
  const w = 360;
  const h = 430;
  return {
    w,
    h,
    svg: group("title-card-dune-part-two", [
      rect(x, y, w, h, { rx: 24, fill: colors.surfaceRaised, stroke: colors.border }),
      rect(x, y, w, 150, { rx: 24, fill: "url(#duneGradient)" }),
      rect(x, y + 118, w, 32, { fill: "#050505", fillOpacity: 0.75 }),
      rect(x + 16, y + 60, 72, 24, { rx: 12, fill: "#000000", fillOpacity: 0.35 }),
      text(x + 52, y + 76, "Pelicula", { size: 11, fill: colors.text, weight: 700, anchor: "middle" }),
      text(x + 16, y + 116, "Dune: Part Two", { size: 20, fill: colors.text, weight: 800 }),
      text(x + 16, y + 138, "2024 / 2 h 46 min", { size: 12, fill: colors.text, fillOpacity: 0.86 }),
      text(x + 16, y + 182, "Una tormenta de arena de profecia, guerra y", { size: 13, fill: colors.text }),
      text(x + 16, y + 200, "presencia cinematografica descomunal.", { size: 13, fill: colors.text }),
      pill(x + 16, y + 224, "Ciencia ficcion").svg,
      pill(x + 146, y + 224, "Drama").svg,
      pill(x + 216, y + 224, "Accion").svg,
      text(x + 16, y + 278, "Dir. Denis Villeneuve", { size: 12, fill: colors.text }),
      text(x + 16, y + 300, "Con Timothee Chalamet, Zendaya, Rebecca Ferguson", { size: 12, fill: colors.text }),
      text(x + 16, y + 336, "Disponible en", { size: 11, fill: colors.accent, weight: 700 }),
      platformBadge(x + 16, y + 354, "Max", "MAX").svg,
      platformBadge(x + 164, y + 354, "Prime Video", "PRIME").svg,
    ].join(""), "TitleCard Dune Part Two"),
  };
}

function axisSlider(x, y) {
  return {
    w: 420,
    h: 76,
    svg: group("axis-slider-relajante-emocionante", [
      text(x, y + 13, "Relajante", { size: 13, fill: colors.text, weight: 700 }),
      text(x + 210, y + 13, "50% / 50%", { size: 12, fill: colors.textMuted, anchor: "middle" }),
      text(x + 420, y + 13, "Emocionante", { size: 13, fill: colors.text, weight: 700, anchor: "end" }),
      rect(x, y + 34, 420, 8, { rx: 4, fill: colors.surface, stroke: colors.border }),
      rect(x, y + 34, 210, 8, { rx: 4, fill: colors.accent }),
      `<circle cx="${x + 210}" cy="${y + 38}" r="11" fill="${colors.text}" stroke="${colors.border}"/>`,
    ].join(""), "Axis slider"),
  };
}

function dropdown(x, y) {
  return {
    w: 342,
    h: 56,
    svg: group("dropdown-generos", [
      rect(x, y, 342, 56, { rx: 18, fill: colors.surface, stroke: colors.border }),
      text(x + 16, y + 21, "Generos", { size: 13, fill: colors.textMuted, weight: 700 }),
      text(x + 16, y + 42, "Seleccion multiple", { size: 14, fill: colors.text }),
      chevronIcon(x + 306, y + 16, false).replace('id="icon-chevron-down"', 'id="icon-chevron-down-dropdown"'),
    ].join(""), "Dropdown generos"),
  };
}

function iconButton(x, y) {
  return {
    w: 42,
    h: 42,
    svg: group("back-icon-button", [
      rect(x, y, 42, 42, { rx: 21, fill: colors.surfaceRaised, stroke: colors.border }),
      backIcon(x + 12, y + 9),
    ].join(""), "Back icon button"),
  };
}

function tabItem(x, y, label, active, iconKind) {
  const stroke = active ? colors.accent : colors.textMuted;
  const iconSvg =
    iconKind === "home" ? tabHomeIcon(x + 37, y, stroke) :
    iconKind === "watch" ? tabWatchIcon(x + 37, y, stroke) :
    tabProfileIcon(x + 37, y, stroke);
  return {
    w: 96,
    h: 48,
    svg: group(`tab-item-${label}`, [
      iconSvg,
      text(x + 48, y + 42, label, {
        size: 12,
        fill: stroke,
        weight: 600,
        anchor: "middle",
      }),
    ].join(""), `Tab item ${label}`),
  };
}

function tabBar(x, y) {
  return {
    w: 390,
    h: 76,
    svg: group("bottom-tab-bar", [
      rect(x, y, 390, 76, { fill: colors.surface, stroke: colors.border }),
      tabItem(x + 18, y + 10, "Inicio", true, "home").svg,
      tabItem(x + 147, y + 10, "Mi lista", false, "watch").svg,
      tabItem(x + 276, y + 10, "Perfil", false, "profile").svg,
    ].join(""), "Bottom tab bar"),
  };
}

let y = 58;
push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="__HEIGHT__" viewBox="0 0 ${width} __HEIGHT__">`);
push(`<defs><linearGradient id="duneGradient" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#5D432C"/><stop offset="1" stop-color="#0F0A07"/></linearGradient></defs>`);
push(rect(0, 0, width, "__HEIGHT__", { fill: colors.background }));
push(group("document-title", [
  text(margin, y, "NEXT UP", { size: 13, fill: colors.accent, weight: 800, letterSpacing: 3 }),
  text(margin, y + 46, "UI Kit editable para Illustrator", { size: 30, fill: colors.text, weight: 800 }),
  text(margin, y + 78, "Elementos vectoriales nativos: rect, text, path, circle y grupos con id.", { size: 15, fill: colors.textMuted }),
].join("")));
y += 132;

y = sectionTitle(y, "Color Tokens");
const colorEntries = Object.entries(colors);
y = drawWrapped(colorEntries, y, ([name, value], x, itemY) => ({
  w: 200,
  h: 136,
  svg: swatch(x, itemY, name, value),
}));

y = sectionTitle(y, "Textos y estilos tipograficos");
y = drawLabeledItems([
  { label: "brand", kind: "brand", value: "NEXT UP" },
  { label: "sectionEyebrow / Inicio", kind: "eyebrow", value: "Inicio" },
  { label: "sectionEyebrow / Perfil", kind: "eyebrow", value: "Perfil" },
  { label: "titleLarge", kind: "titleLarge", value: "Resumen de hoy, Invitado." },
  { label: "titleLarge", kind: "titleLarge", value: "Tus plataformas y tus generos." },
  { label: "titleMedium", kind: "titleMedium", value: "Tu proxima eleccion" },
  { label: "titleSmall", kind: "titleSmall", value: "Actividad reciente" },
  { label: "body", kind: "body", value: "Peliculas, series y novedades de catalogo reunidas en un solo lugar." },
  { label: "bodySmall", kind: "bodySmall", value: "La pelicula quedo disponible esta semana." },
  { label: "caption", kind: "caption", value: "27 abr" },
  { label: "captionBold", kind: "captionBold", value: "2 titulos guardados" },
], y, drawTypographySample);

y = sectionTitle(y, "Botones individuales");
const buttons = [
  ["Ingresar", "primary"], ["Continuar", "primary"], ["Que ver hoy?", "primary"],
  ["Guardar", "primary"], ["Ya lo vi", "primary"], ["Abrir recomendaciones", "primary"],
  ["Volver", "secondary"], ["Ya vistas", "secondary"], ["Pasar", "secondary"],
  ["Aun no", "secondary"], ["Quitar", "secondary"], ["Editar perfil", "secondary"],
  ["Restablecer descartes", "secondary"], ["Vaciar mi lista", "secondary"],
  ["Ya la vi", "ghost"], ["Reconfigurar onboarding", "ghost"],
  ["Cerrar sesion", "danger"], ["Ya la vi", "success"], ["Ingresar disabled", "primary"],
];
y = drawLabeledItems(buttons.map(([label, variant]) => ({ label: `${variant} / ${label}`, value: label, variant })), y, (item, x, itemY) => {
  const disabled = item.value.endsWith(" disabled");
  const label = item.value.replace(" disabled", "");
  const made = button(x, itemY, label, item.variant);
  return disabled ? { ...made, svg: `<g opacity="0.45">${made.svg}</g>` } : made;
});

y = sectionTitle(y, "Chips y pills individuales");
y = drawLabeledItems([
  ["Netflix", true], ["Max", false], ["Prime Video", false], ["Disney+", false], ["Apple TV+", false], ["MUBI", false],
  ["Ciencia ficcion", false], ["Drama", true], ["Suspenso", false], ["Comedia", false], ["Accion", true], ["Animacion", false],
  ["Denis Villeneuve", true], ["Zendaya", true],
].map(([label, selected]) => ({ label: `ChoiceChip / ${label}`, value: label, selected })), y, (item, x, itemY) => chip(x, itemY, item.value, item.selected));
y = drawLabeledItems(["Drama", "Accion", "Ciencia ficcion"].map((value) => ({ label: `Genre pill / ${value}`, value })), y - 24, (item, x, itemY) => pill(x, itemY, item.value));

y = sectionTitle(y, "Campos individuales");
y = drawLabeledItems([
  { label: "Input / Nombre", fieldLabel: "Nombre", value: "Tu nombre" },
  { label: "Input / Mail", fieldLabel: "Mail", value: "tu@email.com" },
  { label: "Search / Buscar director", fieldLabel: "", value: "Buscar director", search: true },
  { label: "Search / Buscar actor o actriz", fieldLabel: "", value: "Buscar actor o actriz", search: true },
], y, (item, x, itemY) => ({ w: 300, h: item.fieldLabel ? 76 : 56, svg: inputField(x, itemY + (item.fieldLabel ? 12 : 0), item.fieldLabel, item.value, item.search) }));

y = sectionTitle(y, "Elementos de contenido individuales");
y = drawLabeledItems([
  { label: "Card container / raised", draw: (x, itemY) => ({ w: 260, h: 120, svg: group("panel-container", rect(x, itemY, 260, 120, { rx: 24, fill: colors.surfaceRaised, stroke: colors.border })) }) },
  { label: "Card container / surface", draw: (x, itemY) => ({ w: 260, h: 120, svg: group("surface-container", rect(x, itemY, 260, 120, { rx: 18, fill: colors.surface, stroke: colors.border })) }) },
  { label: "Avatar", draw: (x, itemY) => ({ w: 80, h: 56, svg: group("avatar-i", [`<circle cx="${x + 28}" cy="${itemY + 28}" r="28" fill="${colors.accent}"/>`, text(x + 28, itemY + 34, "I", { size: 17, fill: colors.background, weight: 800, anchor: "middle" })].join("")) }) },
  { label: "Hero tag", draw: (x, itemY) => ({ w: 84, h: 24, svg: group("hero-tag-pelicula", [rect(x, itemY, 84, 24, { rx: 12, fill: "#000000", fillOpacity: 0.35 }), text(x + 42, itemY + 16, "Pelicula", { size: 11, fill: colors.text, weight: 700, anchor: "middle" })].join("")) }) },
  { label: "Overlay / PASAR", draw: (x, itemY) => ({ w: 94, h: 38, svg: group("overlay-pasar", [rect(x, itemY, 94, 38, { rx: 19, fill: colors.danger, fillOpacity: 0.12, stroke: colors.danger, strokeWidth: 2 }), text(x + 47, itemY + 25, "PASAR", { size: 13, fill: colors.text, weight: 800, anchor: "middle", letterSpacing: 1.2 })].join("")) }) },
  { label: "Overlay / GUARDAR", draw: (x, itemY) => ({ w: 118, h: 38, svg: group("overlay-guardar", [rect(x, itemY, 118, 38, { rx: 19, fill: colors.accent, fillOpacity: 0.14, stroke: colors.accent, strokeWidth: 2 }), text(x + 59, itemY + 25, "GUARDAR", { size: 13, fill: colors.text, weight: 800, anchor: "middle", letterSpacing: 1.2 })].join("")) }) },
  { label: "News title", draw: (x, itemY) => ({ w: 380, h: 36, svg: text(x, itemY + 20, "Furiosa ya se incorporo al catalogo de Max", { size: 17, fill: colors.text, weight: 800 }) }) },
  { label: "News summary", draw: (x, itemY) => ({ w: 420, h: 42, svg: text(x, itemY + 18, "La pelicula quedo disponible esta semana y volvio a empujar las busquedas.", { size: 14, fill: colors.textMuted }) }) },
], y, (item, x, itemY) => item.draw(x, itemY));

y = sectionTitle(y, "Logos y badges individuales");
y = drawLabeledItems([
  ["Netflix", "NETFLIX"], ["Max", "MAX"], ["Prime Video", "PRIME"], ["Disney+", "DISNEY+"], ["Apple TV+", "APPLE TV+"], ["MUBI", "MUBI"],
].map(([platform, logoText]) => ({ label: `PlatformBadge / ${platform}`, platform, logoText })), y, (item, x, itemY) => platformBadge(x, itemY, item.platform, item.logoText));

y = sectionTitle(y, "Controles e iconos individuales");
y = drawLabeledItems([
  { label: "AxisSlider", draw: axisSlider },
  { label: "Dropdown trigger", draw: dropdown },
  { label: "Back icon button", draw: iconButton },
  { label: "Search icon", draw: (x, itemY) => ({ w: 40, h: 40, svg: searchIcon(x, itemY, colors.textMuted) }) },
  { label: "Chevron down", draw: (x, itemY) => ({ w: 40, h: 40, svg: chevronIcon(x, itemY, false) }) },
  { label: "Chevron up", draw: (x, itemY) => ({ w: 40, h: 40, svg: chevronIcon(x, itemY, true) }) },
  { label: "Tab icon home", draw: (x, itemY) => ({ w: 44, h: 44, svg: tabHomeIcon(x, itemY, colors.accent) }) },
  { label: "Tab icon watchlist", draw: (x, itemY) => ({ w: 44, h: 44, svg: tabWatchIcon(x, itemY, colors.textMuted) }) },
  { label: "Tab icon profile", draw: (x, itemY) => ({ w: 44, h: 44, svg: tabProfileIcon(x, itemY, colors.textMuted) }) },
], y, (item, x, itemY) => item.draw(x, itemY));

y = sectionTitle(y, "Navegacion individual");
y = drawLabeledItems([
  { label: "Tab item / Inicio active", draw: (x, itemY) => tabItem(x, itemY, "Inicio", true, "home") },
  { label: "Tab item / Mi lista idle", draw: (x, itemY) => tabItem(x, itemY, "Mi lista", false, "watch") },
  { label: "Tab item / Perfil idle", draw: (x, itemY) => tabItem(x, itemY, "Perfil", false, "profile") },
  { label: "Bottom tab bar", draw: tabBar },
], y, (item, x, itemY) => item.draw(x, itemY));

y = sectionTitle(y, "Componentes compuestos unicos");
y = drawLabeledItems([{ label: "TitleCard / Dune Part Two", draw: titleCard }], y, (item, x, itemY) => item.draw(x, itemY));

height = Math.ceil(y + 80);
push("</svg>");

const svg = out.join("\n").replaceAll("__HEIGHT__", String(height));
fs.writeFileSync("ui-kit-components-editable.svg", svg);
console.log(`Wrote ui-kit-components-editable.svg (${width}x${height})`);
