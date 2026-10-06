# CANCIONESparaDIAZRIO

Reproductor de canciones en vídeo controlado **con gestos de mano** frente a la cámara web. Todo funciona en el navegador, sin instalación ni servidor: la detección de gestos se hace en tiempo real con [MediaPipe Hands](https://developers.google.com/mediapipe).

## Características

- 6 vídeos integrados, seleccionables desde la lista lateral.
- Control total sin teclado ni ratón: manos.
- Detección de la mano con esqueleto dibujado sobre la cámara (espejo).
- Barra de progreso que indica cuándo se activa el gesto.
- Diseño oscuro, responsive y a pantalla completa.
- Un único archivo HTML: `CANCIONESparaDIAZRIO.html`.

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

La cámara solo funciona en contextos seguros (`https://` o `localhost`). Por eso es mejor servir la carpeta con un servidor local que abrir el archivo con doble clic:

```bash
# Con Python (viene con la mayoría de sistemas)
python -m http.server 8000
```

Luego abre <http://localhost:8000/CANCIONESparaDIAZRIO.html> y pulsa **📷 Activar cámara**.

Alternativas: usar la extensión *Live Server* de VS Code, o publicar el repositorio con **GitHub Pages** (al ser `https://`, la cámara funciona directamente).

## Estructura

```
CANCIONESparaDIAZRIO.html   # aplicación completa (HTML + CSS + JS)
videoi1.mp4, video2..3, video5..7.mp4   # canciones
README.md                   # este archivo
.gitignore                  # excluye video4.mp4
```

## Nota sobre video4.mp4

`video4.mp4` (131 MB) **no está incluida** en el repositorio porque supera el límite de 100 MB por archivo de GitHub; tampoco aparece en el reproductor. El archivo sigue disponible en local. Para añadirlo algún día hay dos opciones:

1. Subirlo con [Git LFS](https://git-lfs.com).
2. Comprimirlo por debajo de 100 MB.

## Tecnologías

- HTML, CSS y JavaScript puros (sin frameworks).
- [MediaPipe Hands](https://developers.google.com/mediapipe) y `camera_utils`/`drawing_utils` vía CDN de jsDelivr.
- Tipografías Syne y DM Mono (Google Fonts).
