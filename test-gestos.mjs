// Chequeo de classify() de index.html con manos sintéticas (las mismas que tests/test_gestures.py de gesture-tracking).
// Uso: node test-gestos.mjs
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const code = html.split('// GESTOS-BEGIN')[1].split('// GESTOS-END')[0];
const classify = new Function(`${code}; return classify;`)();

const X = { index: 0.42, middle: 0.50, ring: 0.58, pinky: 0.65 };
const IDX = { index: [5, 6, 7, 8], middle: [9, 10, 11, 12], ring: [13, 14, 15, 16], pinky: [17, 18, 19, 20] };

function hand(up = [], thumb = 'tucked') {
  const lm = Array.from({ length: 21 }, () => ({ x: 0, y: 0 }));
  lm[0] = { x: 0.50, y: 0.90 };
  for (const [name, [mcp, pip, dip, tip]] of Object.entries(IDX)) {
    const x = X[name];
    lm[mcp] = { x, y: 0.60 };
    [lm[pip], lm[dip], lm[tip]] = (up.includes(name) ? [0.48, 0.40, 0.32] : [0.52, 0.58, 0.66]).map(y => ({ x, y }));
  }
  lm[1] = { x: 0.44, y: 0.84 }; lm[2] = { x: 0.38, y: 0.76 };
  [lm[3], lm[4]] = { out: [{ x: 0.30, y: 0.70 }, { x: 0.22, y: 0.66 }], up: [{ x: 0.36, y: 0.62 }, { x: 0.35, y: 0.48 }] }[thumb]
    ?? [{ x: 0.40, y: 0.70 }, { x: 0.44, y: 0.66 }];
  return lm;
}

const ALL = ['index', 'middle', 'ring', 'pinky'];
for (const [up, thumb, expected] of [
  [ALL, 'out', 'mano abierta'], [[], 'tucked', 'puño'], [[], 'up', 'pulgar arriba'], [['index'], 'tucked', 'señalar'],
  [['index', 'middle'], 'tucked', 'paz'], [['index', 'pinky'], 'tucked', 'rock'], [['middle', 'ring'], 'tucked', 'desconocido'],
]) assert.equal(classify(hand(up, thumb)), expected, `${up} / ${thumb}`);
assert.throws(() => classify(Array(5).fill({ x: 0, y: 0 })));
console.log('gestos OK');
