export type DistortHandle = {
  setHover: (value: number) => void
  setMouse: (x: number, y: number) => void
  destroy: () => void
}

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uMouse;
uniform float uHover;
void main() {
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  vec2 toMouse = uv - uMouse;
  float dist = length(toMouse);
  float falloff = smoothstep(0.62, 0.0, dist);
  vec2 warped = uv + toMouse * falloff * uHover * 0.28;
  float shift = 0.012 * uHover * falloff;
  float r = texture2D(uTex, warped + vec2(shift, 0.0)).r;
  float g = texture2D(uTex, warped).g;
  float b = texture2D(uTex, warped - vec2(shift, 0.0)).b;
  float vignette = smoothstep(0.95, 0.35, length(uv - 0.5));
  gl_FragColor = vec4(vec3(r, g, b) * mix(1.0, vignette, 0.15 * uHover), 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function mountDistort(canvas: HTMLCanvasElement, host: HTMLElement, src: string): DistortHandle | null {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    premultipliedAlpha: false,
    powerPreference: 'high-performance',
  })
  if (!gl) return null

  const vs = compile(gl, gl.VERTEX_SHADER, VERT)
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null

  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(program, 'aPos')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  const uTex = gl.getUniformLocation(program, 'uTex')
  const uMouse = gl.getUniformLocation(program, 'uMouse')
  const uHover = gl.getUniformLocation(program, 'uHover')

  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)

  let ready = false
  const image = new Image()
  image.decoding = 'async'
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    ready = true
  }
  image.src = src

  let hover = 0
  let hoverTarget = 0
  let mouseX = 0.5
  let mouseY = 0.5
  let frame = 0
  let dead = false

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const w = Math.max(1, Math.floor(host.clientWidth * dpr))
    const h = Math.max(1, Math.floor(host.clientHeight * dpr))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    gl.viewport(0, 0, canvas.width, canvas.height)
  }

  const draw = () => {
    if (dead) return
    hover += (hoverTarget - hover) * 0.12
    canvas.style.opacity = String(Math.min(1, hover * 1.5))
    if (ready) {
      resize()
      gl.useProgram(program)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.uniform1i(uTex, 0)
      gl.uniform2f(uMouse, mouseX, mouseY)
      gl.uniform1f(uHover, hover)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    frame = requestAnimationFrame(draw)
  }
  frame = requestAnimationFrame(draw)

  return {
    setHover(value) {
      hoverTarget = value
    },
    setMouse(x, y) {
      mouseX = x
      mouseY = 1 - y
    },
    destroy() {
      dead = true
      cancelAnimationFrame(frame)
      gl.deleteTexture(texture)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      const lose = gl.getExtension('WEBGL_lose_context')
      lose?.loseContext()
    },
  }
}
