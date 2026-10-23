# reproductor-asci

Visualizador ASCII de lo que suena en Spotify. Todo está en `index.html`, sin build ni dependencias (salvo `g`, que carga MediaPipe del CDN recién al usarse).

## Correr

1. En https://developer.spotify.com/dashboard creá una app (Web API) con redirect URI `http://127.0.0.1:8888/` (tiene que ser `127.0.0.1`, Spotify no acepta `localhost`).
2. Pegá el Client ID en `CLIENT_ID` en `index.html`.
3. `python3 -m http.server 8888 --bind 127.0.0.1` y abrí http://127.0.0.1:8888/

Sin Spotify: `http://127.0.0.1:8888/?img=<imagen>` renderiza esa imagen (tiene que ser del mismo origen o tener CORS).

## Teclas

`espacio` play/pausa, `←`/`→` tema, `m` micrófono (beat), `v` capturar una pestaña con video, `g` gestos con la cámara
(puño = pausa, mano abierta = play, señalar = siguiente, paz = anterior; hay que sostener la pose 0,6 s).
`classify()` es un port de `gestures.py` de github.com/SebaAq/gesture-tracking: si cambia uno, cambiar el otro.

## Chequeo

`sed -n '/<script>/,/<\/script>/p' index.html | sed '1d;$d' > /tmp/s.js && node --check /tmp/s.js`

Gestos (sin cámara, manos sintéticas): `node test-gestos.mjs`

## Modelo de los agentes
- Al lanzar un agente, elegir el modelo según qué se toca, no qué tan difícil parece.
- Solo mirar, leer o listar (`disenador`, `test-engineer`, agentes de lectura): `sonnet`. `haiku` solo para búsquedas mecánicas.
- Seguridad, autenticación, migraciones o datos (`security-auditor`, `code-reviewer`): `opus`.
- Ante la duda: `opus`.
- Los agentes de plugins (agent-skills) no se editan: el modelo se indica al lanzarlos.
