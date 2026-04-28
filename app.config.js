module.exports = ({ config }) => {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL ?? "";

  return {
    ...config,
    web: {
      ...config.web,
      output: "single",
      name: "Next up",
      shortName: "Next up",
      description:
        "Recomendaciones de películas y series según tus plataformas, tus preferencias y el momento del día.",
      themeColor: "#050505",
      backgroundColor: "#050505",
      display: "standalone",
      startUrl: ".",
      scope: ".",
      orientation: "portrait",
      barStyle: "black-translucent",
      splash: {
        image: "./assets/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#050505",
      },
    },
    experiments: {
      ...config.experiments,
      baseUrl,
    },
  };
};
