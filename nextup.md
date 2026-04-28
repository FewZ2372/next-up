Documentación de Proyecto: Next up (MVP)
1. Visión General del Producto
Next up es una aplicación móvil diseñada para solucionar la "fatiga de decisión" al momento de elegir qué película o serie ver. Funciona como un recomendador hiper-personalizado que cruza los gustos del usuario (directores, actores, géneros), las plataformas de streaming a las que está suscrito y su estado de ánimo ("mood") actual. Además, actúa como un hub de noticias y notificaciones sobre el ecosistema del entretenimiento (transferencias de licencias, cambios de precios, nuevos lanzamientos).

2. Sistema de Diseño (UI/UX)
La identidad visual busca transmitir modernidad y mantener el foco en el contenido audiovisual.

Tema Principal: Dark Mode nativo.

Color de Fondo: Negro puro o gris ultra-oscuro para reducir la fatiga visual y destacar los pósters de películas.

Color de Acento: Amarillo casi verde flúor. Se utiliza para generar alto contraste en los llamados a la acción (CTAs), navegación activa y feedback de interacciones.

Interacción Principal: Mecánica de tarjetas deslizables (swipe) para agilizar la clasificación de contenido de forma intuitiva.

3. Arquitectura de la Información y Flujo de Usuario
3.1. Autenticación y Onboarding
Registro / Login: Pantallas de acceso básicas.

Configuración de Preferencias: Selección de plataformas suscritas, categorías/géneros de interés, directores y actores favoritos.

Recap (Puesta al día): Un filtro inicial para evitar recomendar lo que el usuario ya conoce.

Se le presentan al menos 10 películas/series por plataforma suscrita que encajen con sus intereses.

Gestos: Deslizar a un lado para "Ya visto", al otro para "No la vi" (apoyado por botones visuales claros).

3.2. Vistas Principales (Navegación Inferior / Bottom Tabs)
Home: * Feed de novedades: avisos de nuevas temporadas, secuelas de películas vistas, transferencias de contenido entre plataformas y cambios de políticas/precios.

CTA Principal: Un botón destacado ("¿Qué veo hoy?") que redirige a la sección de recomendación.

Qué ver: * Selector de Mood: Consulta inicial del estado de ánimo para afinar el algoritmo.

Recomendador: Interfaz de swipe con películas no vistas. Deslizar a la derecha guarda el título en la Watchlist; deslizar a la izquierda lo descarta.

Watchlist: Lista de títulos guardados con información básica y logos de las plataformas donde están disponibles actualmente.

Notificaciones: Historial de alertas enviadas por la app (cambios de catálogo, estrenos). Al tocar una notificación, se expande la información detallada.

Configuración: Perfil del usuario, gestión de preferencias de contenido, actualización de plataformas suscritas y ajustes de cuenta.

4. Stack Tecnológico (Front-end MVP)
Para lograr un desarrollo ágil y compilar rápidamente en un archivo APK instalable, el MVP se construirá con las siguientes tecnologías:

Framework Mobile: React Native.

Entorno y Herramientas: Expo (permite desarrollo rápido y testeo en vivo mediante Expo Go).

Navegación: React Navigation (Stack Navigator para onboarding/login y Bottom Tab Navigator para la app principal).

Manejo de Estado Global: Zustand o React Context API (para almacenar el mood, la watchlist y las preferencias del usuario sin necesidad de backend).

Animaciones y Gestos: react-native-deck-swiper (para las tarjetas tipo Tinder) o la combinación de react-native-reanimated y react-native-gesture-handler.

Base de Datos (Simulada): Archivos JSON locales estructurados que actuarán como Mock Data (catálogo de películas, noticias simuladas y notificaciones).

Compilación / Deploy: Expo Application Services (EAS Build) configurado para generar un artefacto .apk directo para Android.

5. Roadmap de Desarrollo
Hito 1: Setup y Estructura (Semana 1)

Inicialización del proyecto en Expo.

Configuración del Custom Theme (Negro y Flúor).

Estructuración de rutas de navegación (Login -> Onboarding -> Tabs Principales).

Hito 2: Mock Data y Estado (Semana 1)

Creación de los JSON de películas (con pósters, plataformas y géneros) y noticias.

Implementación del store global (Zustand/Context).

Hito 3: Flujo de Onboarding y Recap (Semana 2)

Desarrollo de las vistas de selección de intereses.

Implementación de la librería de swipe para la etapa de "Recap" y filtrado inicial.

Hito 4: Desarrollo de Vistas Principales (Semana 3)

Maquetado del "Home" y el feed de noticias.

Desarrollo del flujo "¿Qué ver?" (Selector de Mood + Swipe de Recomendación + Watchlist).

Maquetado de las pestañas de "Notificaciones" y "Configuración".

Hito 5: QA, Refinamiento y Compilación (Semana 4)

Revisión de contraste visual y respuesta de interacciones táctiles.

Configuración de eas.json.

Ejecución de EAS Build y generación del archivo APK final para distribución y pruebas.