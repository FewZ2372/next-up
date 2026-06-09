import { EmotionalProfile, PlatformName, SelectedMoodId, Title } from "../types/content";

export const PLATFORM_OPTIONS: PlatformName[] = [
  "Netflix",
  "Max",
  "Prime Video",
  "Disney+",
  "Apple TV+",
  "MUBI",
];

export const GENRE_OPTIONS = [
  "Ciencia ficción",
  "Drama",
  "Suspenso",
  "Comedia",
  "Acción",
  "Animación",
  "Crimen",
  "Romance",
  "Fantasía",
  "Documental",
];

export const catalog: Title[] = [
  {
    id: "dune-2",
    name: "Dune: Part Two",
    format: "Película",
    year: 2024,
    duration: "2 h 46 min",
    genres: ["Ciencia ficción", "Drama", "Acción"],
    moods: ["adrenaline", "mind-bending"],
    platforms: ["Max", "Prime Video"],
    director: "Denis Villeneuve",
    cast: ["Timothee Chalamet", "Zendaya", "Rebecca Ferguson"],
    blurb: "Una tormenta de arena de profecía, guerra y presencia cinematográfica descomunal.",
    gradient: ["#5D432C", "#0F0A07"],
  },
  {
    id: "severance",
    name: "Severance",
    format: "Serie",
    year: 2022,
    duration: "2 temporadas",
    genres: ["Ciencia ficción", "Suspenso", "Drama"],
    moods: ["mind-bending", "dark"],
    platforms: ["Apple TV+"],
    director: "Ben Stiller",
    cast: ["Adam Scott", "Britt Lower", "John Turturro"],
    blurb: "La vida de oficina dividida en dos conciencias con una incomodidad impecable.",
    gradient: ["#70A6B8", "#0A1114"],
  },
  {
    id: "the-bear",
    name: "The Bear",
    format: "Serie",
    year: 2022,
    duration: "3 temporadas",
    genres: ["Drama", "Comedia"],
    moods: ["adrenaline", "feel-good"],
    platforms: ["Disney+"],
    director: "Christopher Storer",
    cast: ["Jeremy Allen White", "Ayo Edebiri", "Ebon Moss-Bachrach"],
    blurb: "Caos de cocina, nervios a flor de piel y una cantidad inesperada de corazón.",
    gradient: ["#8B4800", "#160D05"],
  },
  {
    id: "past-lives",
    name: "Past Lives",
    format: "Película",
    year: 2023,
    duration: "1 h 46 min",
    genres: ["Drama", "Romance"],
    moods: ["cozy", "feel-good"],
    platforms: ["MUBI", "Prime Video"],
    director: "Celine Song",
    cast: ["Greta Lee", "Teo Yoo", "John Magaro"],
    blurb: "Anhelo silencioso, romance adulto y una delicadeza devastadora.",
    gradient: ["#B25F73", "#13090D"],
  },
  {
    id: "andor",
    name: "Andor",
    format: "Serie",
    year: 2022,
    duration: "2 temporadas",
    genres: ["Ciencia ficción", "Suspenso", "Drama"],
    moods: ["dark", "mind-bending", "adrenaline"],
    platforms: ["Disney+"],
    director: "Tony Gilroy",
    cast: ["Diego Luna", "Adria Arjona", "Stellan Skarsgard"],
    blurb: "Un thriller de rebelión construido con presión, aspereza y precisión.",
    gradient: ["#6A4A3A", "#0F0A09"],
  },
  {
    id: "challengers",
    name: "Challengers",
    format: "Película",
    year: 2024,
    duration: "2 h 11 min",
    genres: ["Drama", "Romance"],
    moods: ["adrenaline", "dark"],
    platforms: ["Prime Video", "MUBI"],
    director: "Luca Guadagnino",
    cast: ["Zendaya", "Josh O'Connor", "Mike Faist"],
    blurb: "Un triángulo amoroso servido con sudor, ambición y bordes filosos.",
    gradient: ["#9F2500", "#170807"],
  },
  {
    id: "only-murders",
    name: "Only Murders in the Building",
    format: "Serie",
    year: 2021,
    duration: "4 temporadas",
    genres: ["Comedia", "Crimen"],
    moods: ["cozy", "feel-good"],
    platforms: ["Disney+"],
    director: "John Hoffman",
    cast: ["Steve Martin", "Martin Short", "Selena Gomez"],
    blurb: "Crimen, encanto y una energía de edificio impecable.",
    gradient: ["#4E6A39", "#0C110A"],
  },
  {
    id: "silo",
    name: "Silo",
    format: "Serie",
    year: 2023,
    duration: "2 temporadas",
    genres: ["Ciencia ficción", "Suspenso"],
    moods: ["mind-bending", "dark"],
    platforms: ["Apple TV+"],
    director: "Graham Yost",
    cast: ["Rebecca Ferguson", "Common", "Harriet Walter"],
    blurb: "Un misterio subterráneo donde cada respuesta aprieta más el cerrojo.",
    gradient: ["#7C6A55", "#0F0C09"],
  },
  {
    id: "spider-verse",
    name: "Across the Spider-Verse",
    format: "Película",
    year: 2023,
    duration: "2 h 20 min",
    genres: ["Animación", "Acción", "Ciencia ficción"],
    moods: ["adrenaline", "feel-good", "mind-bending"],
    platforms: ["Netflix"],
    director: "Joaquim Dos Santos",
    cast: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac"],
    blurb: "Fuegos artificiales visuales con una gravedad emocional real debajo.",
    gradient: ["#4039B8", "#0A0820"],
  },
  {
    id: "slow-horses",
    name: "Slow Horses",
    format: "Serie",
    year: 2022,
    duration: "4 temporadas",
    genres: ["Suspenso", "Comedia", "Crimen"],
    moods: ["dark", "cozy"],
    platforms: ["Apple TV+"],
    director: "Will Smith",
    cast: ["Gary Oldman", "Jack Lowden", "Kristin Scott Thomas"],
    blurb: "Espías en decadencia, diálogos afilados y caos con café malo.",
    gradient: ["#506146", "#0B1009"],
  },
  {
    id: "blue-eye-samurai",
    name: "Blue Eye Samurai",
    format: "Serie",
    year: 2023,
    duration: "1 temporada",
    genres: ["Animación", "Acción", "Drama"],
    moods: ["adrenaline", "dark"],
    platforms: ["Netflix"],
    director: "Amber Noizumi",
    cast: ["Maya Erskine", "Masi Oka", "Brenda Song"],
    blurb: "Una odisea de venganza con acero, sombras y planos impactantes.",
    gradient: ["#184F6A", "#081017"],
  },
  {
    id: "bottoms",
    name: "Bottoms",
    format: "Película",
    year: 2023,
    duration: "1 h 31 min",
    genres: ["Comedia", "Romance"],
    moods: ["feel-good", "cozy"],
    platforms: ["Prime Video"],
    director: "Emma Seligman",
    cast: ["Rachel Sennott", "Ayo Edebiri", "Kaia Gerber"],
    blurb: "Una comedia adolescente caótica que nunca pide permiso para ser rara.",
    gradient: ["#A63F60", "#18080E"],
  },
  {
    id: "suzume",
    name: "Suzume",
    format: "Película",
    year: 2022,
    duration: "2 h 2 min",
    genres: ["Animación", "Fantasía", "Drama"],
    moods: ["cozy", "mind-bending", "feel-good"],
    platforms: ["Netflix", "MUBI"],
    director: "Makoto Shinkai",
    cast: ["Nanoka Hara", "Hokuto Matsumura", "Eri Fukatsu"],
    blurb: "Un viaje por el duelo, la magia y cielos hermosamente rotos.",
    gradient: ["#1B7C92", "#091116"],
  },
  {
    id: "ripley",
    name: "Ripley",
    format: "Serie",
    year: 2024,
    duration: "1 temporada",
    genres: ["Crimen", "Suspenso", "Drama"],
    moods: ["dark", "mind-bending"],
    platforms: ["Netflix"],
    director: "Steven Zaillian",
    cast: ["Andrew Scott", "Dakota Fanning", "Johnny Flynn"],
    blurb: "Engaño en blanco y negro con una elegancia inquietante.",
    gradient: ["#696969", "#090909"],
  },
  {
    id: "fall-guy",
    name: "The Fall Guy",
    format: "Película",
    year: 2024,
    duration: "2 h 6 min",
    genres: ["Acción", "Comedia", "Romance"],
    moods: ["adrenaline", "feel-good"],
    platforms: ["Prime Video"],
    director: "David Leitch",
    cast: ["Ryan Gosling", "Emily Blunt", "Aaron Taylor-Johnson"],
    blurb: "Carisma de dobles de riesgo con el caos justo para sostener el vuelo.",
    gradient: ["#C46A00", "#150A03"],
  },
  {
    id: "the-studio",
    name: "The Studio",
    format: "Serie",
    year: 2025,
    duration: "1 temporada",
    genres: ["Comedia", "Drama"],
    moods: ["feel-good", "cozy"],
    platforms: ["Apple TV+"],
    director: "Seth Rogen",
    cast: ["Seth Rogen", "Kathryn Hahn", "Chase Sui Wonders"],
    blurb: "Un ataque de pánico de Hollywood convertido en una sátira brillante.",
    gradient: ["#7A5C2B", "#120D05"],
  },
  {
    id: "furiosa",
    name: "Furiosa",
    format: "Película",
    year: 2024,
    duration: "2 h 28 min",
    genres: ["Acción", "Drama"],
    moods: ["adrenaline", "dark"],
    platforms: ["Max"],
    director: "George Miller",
    cast: ["Anya Taylor-Joy", "Chris Hemsworth", "Tom Burke"],
    blurb: "Acción mítica en el desierto, construida con una confianza total.",
    gradient: ["#924F1A", "#120A05"],
  },
  {
    id: "perfect-days",
    name: "Perfect Days",
    format: "Película",
    year: 2023,
    duration: "2 h 4 min",
    genres: ["Drama"],
    moods: ["cozy", "feel-good"],
    platforms: ["MUBI"],
    director: "Wim Wenders",
    cast: ["Koji Yakusho", "Tokio Emoto", "Arisa Nakano"],
    blurb: "Rutinas pequeñas, alma enorme y un silencio usado a la perfección.",
    gradient: ["#4E6B4E", "#0B100B"],
  },
  {
    id: "house-of-dragon",
    name: "House of the Dragon",
    format: "Serie",
    year: 2022,
    duration: "2 temporadas",
    genres: ["Fantasía", "Drama", "Acción"],
    moods: ["dark", "adrenaline"],
    platforms: ["Max"],
    director: "Ryan Condal",
    cast: ["Emma D'Arcy", "Olivia Cooke", "Matt Smith"],
    blurb: "Drama dinástico que escupe fuego con veneno de prestigio puro.",
    gradient: ["#71231B", "#100707"],
  },
];

export const DIRECTOR_OPTIONS = [
  "Denis Villeneuve",
  "Ben Stiller",
  "Christopher Storer",
  "Celine Song",
  "Tony Gilroy",
  "Luca Guadagnino",
  "John Hoffman",
  "Graham Yost",
  "Joaquim Dos Santos",
  "Will Smith",
  "Amber Noizumi",
  "Emma Seligman",
  "Makoto Shinkai",
  "Steven Zaillian",
  "David Leitch",
  "Seth Rogen",
  "George Miller",
  "Wim Wenders",
  "Ryan Condal",
];

export const FEATURED_DIRECTOR_OPTIONS = [
  "Denis Villeneuve",
  "Ben Stiller",
  "Christopher Storer",
  "Celine Song",
  "Luca Guadagnino",
  "George Miller",
  "Wim Wenders",
  "Steven Zaillian",
];

export const ACTOR_OPTIONS = [
  "Zendaya",
  "Timothee Chalamet",
  "Rebecca Ferguson",
  "Adam Scott",
  "Britt Lower",
  "John Turturro",
  "Jeremy Allen White",
  "Ayo Edebiri",
  "Ebon Moss-Bachrach",
  "Greta Lee",
  "Teo Yoo",
  "John Magaro",
  "Diego Luna",
  "Adria Arjona",
  "Stellan Skarsgard",
  "Josh O'Connor",
  "Mike Faist",
  "Steve Martin",
  "Martin Short",
  "Selena Gomez",
  "Gary Oldman",
  "Jack Lowden",
  "Kristin Scott Thomas",
  "Common",
  "Harriet Walter",
  "Maya Erskine",
  "Masi Oka",
  "Brenda Song",
  "Rachel Sennott",
  "Kaia Gerber",
  "Andrew Scott",
  "Dakota Fanning",
  "Johnny Flynn",
  "Ryan Gosling",
  "Emily Blunt",
  "Aaron Taylor-Johnson",
  "Anya Taylor-Joy",
  "Chris Hemsworth",
  "Emma D'Arcy",
  "Olivia Cooke",
  "Matt Smith",
  "Shameik Moore",
  "Hailee Steinfeld",
  "Oscar Isaac",
  "Nanoka Hara",
  "Hokuto Matsumura",
  "Eri Fukatsu",
  "Koji Yakusho",
  "Tokio Emoto",
  "Arisa Nakano",
  "Seth Rogen",
  "Kathryn Hahn",
  "Chase Sui Wonders",
  "Tom Burke",
];

export const FEATURED_ACTOR_OPTIONS = [
  "Zendaya",
  "Timothee Chalamet",
  "Rebecca Ferguson",
  "Adam Scott",
  "Jeremy Allen White",
  "Ayo Edebiri",
  "Andrew Scott",
  "Anya Taylor-Joy",
];

const matchesPlatforms = (title: Title, selectedPlatforms: PlatformName[]) =>
  selectedPlatforms.length === 0 ||
  title.platforms.some((platform) => selectedPlatforms.includes(platform));

const genreOverlap = (title: Title, selectedGenres: string[]) =>
  title.genres.filter((genre) => selectedGenres.includes(genre)).length;

const directorOverlap = (title: Title, selectedDirectors: string[]) =>
  selectedDirectors.includes(title.director) ? 2 : 0;

const actorOverlap = (title: Title, selectedActors: string[]) =>
  title.cast.filter((actor) => selectedActors.includes(actor)).length;

const preferenceScore = (
  title: Title,
  selectedGenres: string[],
  selectedDirectors: string[],
  selectedActors: string[],
) =>
  genreOverlap(title, selectedGenres) * 2 +
  directorOverlap(title, selectedDirectors) +
  actorOverlap(title, selectedActors);

export const getRecapCandidates = (filters: {
  selectedPlatforms: PlatformName[];
  selectedGenres: string[];
  selectedDirectors: string[];
  selectedActors: string[];
}) => {
  const ranked = catalog
    .filter((title) => matchesPlatforms(title, filters.selectedPlatforms))
    .map((title) => ({
      title,
      score: preferenceScore(
        title,
        filters.selectedGenres,
        filters.selectedDirectors,
        filters.selectedActors,
      ),
    }))
    .sort((a, b) => b.score - a.score);

  const withPreferenceHits = ranked.filter((entry) => entry.score > 0).map((entry) => entry.title);
  const fallback = ranked.filter((entry) => entry.score === 0).map((entry) => entry.title);

  return [...withPreferenceHits, ...fallback].slice(0, 12);
};

export const getRecommendedTitles = (filters: {
  selectedPlatforms: PlatformName[];
  selectedGenres: string[];
  selectedDirectors: string[];
  selectedActors: string[];
  hiddenIds: string[];
  mood: SelectedMoodId;
}) => {
  const hiddenIds = new Set(filters.hiddenIds);

  const ranked = catalog
    .filter((title) => matchesPlatforms(title, filters.selectedPlatforms))
    .filter((title) => !hiddenIds.has(title.id))
    .map((title) => {
      const baseScore = preferenceScore(
        title,
        filters.selectedGenres,
        filters.selectedDirectors,
        filters.selectedActors,
      );
      const moodScore = filters.mood && title.moods.includes(filters.mood) ? 4 : 0;

      return {
        title,
        score: baseScore + moodScore,
        moodMatch: filters.mood ? title.moods.includes(filters.mood) : false,
      };
    })
    .sort((a, b) => b.score - a.score);

  const moodMatches = ranked.filter((entry) => entry.moodMatch).map((entry) => entry.title);
  const fallback = ranked.filter((entry) => !entry.moodMatch).map((entry) => entry.title);

  return [...moodMatches, ...fallback];
};

const emotionalScore = (title: Title, profile: EmotionalProfile) => {
  const relaxing = (100 - profile.energy) / 100;
  const exciting = profile.energy / 100;
  const cheerful = (100 - profile.tone) / 100;
  const dark = profile.tone / 100;
  const simple = (100 - profile.complexity) / 100;
  const complex = profile.complexity / 100;
  const shallow = (100 - profile.depth) / 100;
  const moving = profile.depth / 100;

  let score = 0;

  if (title.moods.includes("cozy")) {
    score += relaxing * 2.6 + cheerful * 0.8 + simple * 1.2 + moving * 0.5;
  }

  if (title.moods.includes("adrenaline")) {
    score += exciting * 2.8 + shallow * 0.9 + dark * 0.2;
  }

  if (title.moods.includes("feel-good")) {
    score += cheerful * 2.8 + simple * 1 + moving * 0.8;
  }

  if (title.moods.includes("dark")) {
    score += dark * 2.8 + exciting * 0.4 + complex * 0.5;
  }

  if (title.moods.includes("mind-bending")) {
    score += complex * 3 + dark * 0.5 + moving * 0.3;
  }

  return score;
};

export const getEmotionDrivenTitles = (filters: {
  selectedPlatforms: PlatformName[];
  selectedGenres: string[];
  selectedDirectors: string[];
  selectedActors: string[];
  hiddenIds: string[];
  focusGenres: string[];
  emotionalProfile: EmotionalProfile;
}) => {
  const hiddenIds = new Set(filters.hiddenIds);

  return catalog
    .filter((title) => matchesPlatforms(title, filters.selectedPlatforms))
    .filter((title) => !hiddenIds.has(title.id))
    .map((title) => {
      const baseScore = preferenceScore(
        title,
        filters.selectedGenres,
        filters.selectedDirectors,
        filters.selectedActors,
      );
      const focusGenreScore =
        title.genres.filter((genre) => filters.focusGenres.includes(genre)).length * 3.5;
      const profileScore = emotionalScore(title, filters.emotionalProfile);

      return {
        title,
        score: baseScore + focusGenreScore + profileScore,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.title);
};

export const getTitlesByIds = (ids: string[]) =>
  ids
    .map((id) => catalog.find((title) => title.id === id))
    .filter((title): title is Title => Boolean(title));
