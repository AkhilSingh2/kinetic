import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'

const ivory = '#f3ecdf'
const copper = '#c47a4a'
const bg = '#0e0d0c'
const muted = '#9c958a'

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
  }
  return ~c >>> 0
}

function chunk(type, data) {
  const t = Buffer.from(type)
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([t, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function writeNoise(size = 160) {
  const raw = Buffer.alloc(size * (size * 3 + 1))
  let o = 0
  for (let y = 0; y < size; y++) {
    raw[o++] = 0
    for (let x = 0; x < size; x++) {
      const n = 80 + Math.floor(Math.random() * 160)
      raw[o++] = n
      raw[o++] = n
      raw[o++] = n
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
  writeFileSync('public/noise.png', png)
}

function svg(body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
  <rect width="1200" height="1500" fill="${bg}"/>
  ${body}
</svg>
`
}

function ring() {
  const circles = []
  for (let i = 1; i <= 18; i++) {
    const r = 40 + i * 32
    const copperRing = i === 11
    circles.push(
      `<circle cx="600" cy="750" r="${r}" fill="none" stroke="${copperRing ? copper : ivory}" stroke-opacity="${copperRing ? 0.95 : 0.14 + (i % 3) * 0.04}" stroke-width="${copperRing ? 3 : i % 4 === 0 ? 1.4 : 0.6}"/>`,
    )
  }
  return svg(`
    ${circles.join('\n')}
    <circle cx="600" cy="750" r="18" fill="${copper}"/>
    <path d="M600 70 V180 M600 1320 V1430 M70 750 H180 M1020 750 H1130" stroke="${ivory}" stroke-opacity="0.35" stroke-width="1"/>
  `)
}

function coil() {
  let d = ''
  const turns = 16
  const steps = turns * 80
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 * turns
    const r = 16 + (i / steps) * 460
    const x = 600 + Math.cos(t) * r
    const y = 760 + Math.sin(t) * r * 0.92
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `
  }
  return svg(`
    <path d="${d}" fill="none" stroke="${copper}" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="600" cy="760" r="10" fill="${ivory}"/>
    <path d="M80 140 H520" stroke="${ivory}" stroke-opacity="0.3" stroke-width="1"/>
  `)
}

function grain() {
  const lines = []
  for (let y = 80; y < 1420; y += 6) {
    const wobble = Math.sin(y * 0.07) * 8
    const opacity = 0.08 + (y % 24 === 0 ? 0.18 : 0)
    const stroke = y % 48 === 0 ? copper : ivory
    lines.push(
      `<path d="M${80 + wobble} ${y} C 360 ${y + wobble * 0.2}, 760 ${y - wobble * 0.15}, ${1120 - wobble} ${y}" fill="none" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="${y % 48 === 0 ? 1.4 : 0.7}"/>`,
    )
  }
  return svg(`
    <rect x="90" y="90" width="1020" height="1320" fill="none" stroke="${ivory}" stroke-opacity="0.2"/>
    ${lines.join('\n')}
  `)
}

function leather() {
  const blobs = []
  const tones = ['#2a211c', '#3a2b22', '#4a3428', '#1a1411', '#5c4032']
  for (let i = 0; i < 14; i++) {
    const cx = 200 + ((i * 173) % 860)
    const cy = 180 + ((i * 211) % 1140)
    const rx = 160 + (i % 5) * 40
    const ry = 120 + (i % 4) * 50
    blobs.push(
      `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${tones[i % tones.length]}" fill-opacity="0.85" transform="rotate(${i * 18} ${cx} ${cy})"/>`,
    )
  }
  return svg(`
    <rect width="1200" height="1500" fill="#241c17"/>
    ${blobs.join('\n')}
    <rect width="1200" height="1500" fill="none" stroke="${copper}" stroke-opacity="0.35"/>
  `)
}

function night() {
  return svg(`
    <defs>
      <radialGradient id="glow" cx="50%" cy="48%" r="50%">
        <stop offset="0%" stop-color="${copper}" stop-opacity="0.55"/>
        <stop offset="18%" stop-color="${copper}" stop-opacity="0.08"/>
        <stop offset="46%" stop-color="${bg}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="1500" fill="url(#glow)"/>
    <circle cx="600" cy="720" r="280" fill="none" stroke="${ivory}" stroke-opacity="0.18" stroke-width="1"/>
    <circle cx="600" cy="720" r="188" fill="none" stroke="${copper}" stroke-width="2"/>
    <circle cx="600" cy="720" r="8" fill="${ivory}"/>
    <circle cx="600" cy="720" r="2.5" fill="${bg}"/>
    <path d="M600 400 V470 M600 970 V1040" stroke="${ivory}" stroke-opacity="0.25" stroke-width="1"/>
  `)
}

function section() {
  return svg(`
    <g fill="none" stroke="${ivory}" stroke-opacity="0.75" stroke-width="1.25">
      <path d="M430 980 C430 620, 500 430, 600 390 C700 430, 770 620, 770 980"/>
      <path d="M470 960 C470 660, 530 500, 600 470 C670 500, 730 660, 730 960"/>
      <path d="M520 930 C530 720, 560 600, 600 570 C640 600, 670 720, 680 930"/>
      <path d="M560 900 C566 760, 578 680, 600 660 C622 680, 634 760, 640 900"/>
    </g>
    <path d="M470 960 H730" stroke="${copper}" stroke-width="2"/>
    <g stroke="${muted}" stroke-width="1" fill="none" stroke-opacity="0.7">
      <path d="M300 390 H390 M810 390 H900"/>
      <path d="M300 390 V470 M900 390 V470"/>
      <path d="M250 980 H390 M810 980 H950"/>
    </g>
    <g fill="${ivory}" font-family="ui-monospace, monospace" font-size="22" opacity="0.7">
      <text x="250" y="360">40 mm</text>
      <text x="250" y="1040">labyrinth</text>
      <text x="820" y="1040">seal</text>
    </g>
    <circle cx="600" cy="700" r="16" fill="none" stroke="${copper}" stroke-width="2"/>
  `)
}

mkdirSync('public/gallery', { recursive: true })
writeNoise()
writeFileSync('public/gallery/ring.svg', ring())
writeFileSync('public/gallery/coil.svg', coil())
writeFileSync('public/gallery/grain.svg', grain())
writeFileSync('public/gallery/leather.svg', leather())
writeFileSync('public/gallery/night.svg', night())
writeFileSync('public/gallery/section.svg', section())
console.log('assets written')
