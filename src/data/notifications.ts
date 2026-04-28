import { AppNotification } from "../types/content";

export const notifications: AppNotification[] = [
  {
    id: "alert-1",
    label: "Catálogo",
    title: "Past Lives sale de Prime Video el 1 de mayo",
    body: "La película seguirá disponible en MUBI después de esa fecha.",
    timestamp: "Hoy / 18:10",
  },
  {
    id: "alert-2",
    label: "Estreno",
    title: "Furiosa ya figura disponible en Max",
    body: "La película se incorporó al catálogo y quedó visible entre los destacados de acción.",
    timestamp: "Hoy / 15:20",
  },
  {
    id: "alert-3",
    label: "Serie",
    title: "The Bear volvió a aparecer entre lo más visto",
    body: "La serie escaló entre los destacados de Disney+ y recuperó lugar entre las recomendaciones de la semana.",
    timestamp: "Ayer / 20:30",
  },
  {
    id: "alert-4",
    label: "Calendario",
    title: "House of the Dragon sigue entre los próximos estrenos de Max",
    body: "La serie mantiene visibilidad en la programación destacada del mes dentro de la plataforma.",
    timestamp: "Ayer / 12:05",
  },
];
