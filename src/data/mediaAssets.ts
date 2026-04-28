import { PlatformName } from "../types/content";

export const posterUrls: Record<string, string> = {
  "dune-2":
    "https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
  severance:
    "https://m.media-amazon.com/images/M/MV5BZDI5YzJhODQtMzQyNy00YWNmLWIxMjUtNDBjNjA5YWRjMzExXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
  "the-bear":
    "https://m.media-amazon.com/images/M/MV5BYWZhNDZiMzAtZmZlYS00MWFmLWE2MWEtNDAxZTZiN2U4Y2U2XkEyXkFqcGc@._V1_SX300.jpg",
  "past-lives":
    "https://m.media-amazon.com/images/M/MV5BYjQyMTNhNjUtN2VmYy00NWRhLTkwOTctMGVmNTBmNDIxYjZhXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
  andor:
    "https://m.media-amazon.com/images/M/MV5BNGI2MTJjMjUtMTJhOC00YTY2LTg1NjUtMTdmMjg4YTk2YjM5XkEyXkFqcGc@._V1_SX300.jpg",
  challengers:
    "https://m.media-amazon.com/images/M/MV5BZTcyZGIyODctZGJhOS00MWUyLWI5ZWEtMjg4YzhkMDczMDBhXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
  "only-murders":
    "https://m.media-amazon.com/images/M/MV5BMDFjZDg5MzItYmQxYS00ZmJkLWIwZGEtMjc0Y2QwYzRlNzg5XkEyXkFqcGc@._V1_QL75_UY562_CR35,0,380,562_.jpg",
  silo:
    "https://m.media-amazon.com/images/M/MV5BNjA5ODM4YTEtNDcxZi00N2ViLTg0MTgtNGQxNjBjZWY5YTk3XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
  "spider-verse":
    "https://m.media-amazon.com/images/M/MV5BNThiZjA3MjItZGY5Ni00ZmJhLWEwN2EtOTBlYTA4Y2E0M2ZmXkEyXkFqcGc@._V1_SX300.jpg",
  "slow-horses":
    "https://m.media-amazon.com/images/M/MV5BY2NkNTBiYWUtMGFiZS00MGI4LWE3YjMtZTU3NzhhZmEyYzlkXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
  "blue-eye-samurai":
    "https://m.media-amazon.com/images/M/MV5BY2E4ZGIwZWYtMGRiMS00NGI2LTgwYzAtZGY5NGVhNzY3Yjk0XkEyXkFqcGc@._V1_SX300.jpg",
  bottoms:
    "https://m.media-amazon.com/images/M/MV5BNzEyNTNlNDAtNTMxOC00YzMzLWFkM2QtZmRiNGE5ZTQyMWFmXkEyXkFqcGc@._V1_SX300.jpg",
  suzume:
    "https://m.media-amazon.com/images/M/MV5BODhkNDhmNzktODFmMC00NDZiLWEzN2UtY2YwYzgzYTVlMWZmXkEyXkFqcGc@._V1_SX300.jpg",
  ripley:
    "https://m.media-amazon.com/images/M/MV5BMmI0NzgyY2ItODVmMy00YzQzLWI3ODAtMzExZDMxYWU0YmZhXkEyXkFqcGc@._V1_SX300.jpg",
  "fall-guy":
    "https://m.media-amazon.com/images/M/MV5BM2U0MTJiYTItMjNiZS00MzU4LTkxYTAtYTU0ZGY1ODJhMjRhXkEyXkFqcGc@._V1_SX300.jpg",
  "the-studio":
    "https://m.media-amazon.com/images/M/MV5BZDA4MWUyNDYtODNjYi00NjE4LTk0ZTMtZmMzZTU5MzkzMTBlXkEyXkFqcGc@._V1_QL75_UY562_CR35,0,380,562_.jpg",
  furiosa:
    "https://m.media-amazon.com/images/M/MV5BNTcwYWE1NTYtOWNiYy00NzY3LWIwY2MtNjJmZDkxNDNmOWE1XkEyXkFqcGc@._V1_SX300.jpg",
  "perfect-days":
    "https://m.media-amazon.com/images/M/MV5BNGVmODFkM2MtOTEzMy00MjFjLThjZmYtODMxZmI1MzcyNDkyXkEyXkFqcGc@._V1_QL75_UX380_CR0,7,380,562_.jpg",
  "house-of-dragon":
    "https://m.media-amazon.com/images/M/MV5BZGM4MTczODQtNGIxOC00Y2U2LTk1YmItNzA2N2VhYmE0Y2YwXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
};

export const platformBranding: Record<
  PlatformName,
  {
    logoUri: string;
    logoWidth: number;
  }
> = {
  Netflix: {
    logoUri: "https://upload.wikimedia.org/wikipedia/commons/6/69/Netflix_logo.svg",
    logoWidth: 54,
  },
  Max: {
    logoUri: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Max_logo.svg",
    logoWidth: 42,
  },
  "Prime Video": {
    logoUri: "https://upload.wikimedia.org/wikipedia/commons/9/90/Prime_Video_logo_%282024%29.svg",
    logoWidth: 68,
  },
  "Disney+": {
    logoUri: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
    logoWidth: 66,
  },
  "Apple TV+": {
    logoUri: "https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg",
    logoWidth: 70,
  },
  MUBI: {
    logoUri: "https://upload.wikimedia.org/wikipedia/commons/5/51/Mubi_logo.svg",
    logoWidth: 42,
  },
};
