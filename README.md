# CANCIONESparaDIAZRIO

Reproductor de canciones en vídeo controlado **con gestos de mano** frente a la cámara web. Todo funciona en el navegador, sin instalación ni servidor: la detección de gestos se hace en tiempo real con [MediaPipe Hands](https://developers.google.com/mediapipe).

## Características

- 6 vídeos integrados, seleccionables desde la lista lateral.
- Control total sin teclado ni ratón: manos.
- Detección de la mano con esqueleto dibujado sobre la cámara (espejo).
- Barra de progreso que indica cuándo se activa el gesto.
- Diseño oscuro, responsive y a pantalla completa.
- Código organizado: HTML, CSS (`styles/`) y JavaScript (`script/`) por separado.

## Gestos

| Gesto | Acción | Desbloqueado |
| --- | --- | --- |
| 🤟 Tres dedos | **Activar gestos** | Siempre |
| ✋ Mano abierta | ▶ Reproducir | Tras activar |
| ✊ Puño cerrado | ⏸ Pausar | Tras activar |
| ☝️ Un dedo | ⏭ Siguiente canción | Tras activar |
| ✌️ Dos dedos | ⏮ Canción anterior | Tras activar |

**Cómo funciona:** mantén el gesto quieto hasta que se complete la barra de progreso. Tras ejecutar una acción, los gestos se bloquean (🔒) y hay que volver a hacer 🤟 tres dedos para reactivarlos. Esto evita saltos y reproducciones accidentales.

## Requisitos

- Navegador moderno (Chrome, Edge, Firefox...) con webcam.
- Conexión a internet: MediaPipe y las tipografías se cargan desde CDN.
- Permiso de cámara del navegador.

## Cómo usarlo

Entra en este enlace: **<https://diaz827.github.io/CANCIONESparaDIAZRIO/>**

Pulsa **📷 Activar cámara**, da permiso y controla los vídeos con los gestos de la tabla de arriba.

## Estructura

```
index.html                   # página principal
styles/styles.css            # estilos
script/script.js             # lógica: reproductor y gestos
videos/                      # canciones (videoi1, video2, video3, video5, video6, video7)
README.md                    # este archivo
.gitignore                   # excluye videos/video4.mp4
```

## Tecnologías

- HTML, CSS y JavaScript puros (sin frameworks).
- [MediaPipe Hands](https://developers.google.com/mediapipe) y `camera_utils`/`drawing_utils` vía CDN de jsDelivr.
- Tipografías Syne y DM Mono (Google Fonts).
