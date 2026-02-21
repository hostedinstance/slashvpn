'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/logotextgrd.png';
import { auroraFooterConfig } from '@/config/theme.config';

// ── Inline Aurora WebGL ───────────────────────────────────────────────────────

function AuroraCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const cfg  = auroraFooterConfig.aurora;

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const VERT = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

    const FRAG = `#version 300 es
precision highp float;
uniform float uTime;
uniform float uAmplitude;
uniform vec3  uColorStops[3];
uniform vec2  uResolution;
uniform float uBlend;
out vec4 fragColor;

vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
  i=mod(i,289.0);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m; m=m*m;
  vec3 x2=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x2)-0.5;
  vec3 ox=floor(x2+0.5);
  vec3 a0=x2-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uResolution;
  uv.y = 1.0 - uv.y;
  vec3 c0 = uColorStops[0];
  vec3 c1 = uColorStops[1];
  vec3 c2 = uColorStops[2];
  vec3 ramp = uv.x < 0.5
    ? mix(c0, c1, uv.x * 2.0)
    : mix(c1, c2, (uv.x - 0.5) * 2.0);
  float noise   = snoise(vec2(uv.x * 3.0, uTime * 0.18));
  float wave    = uv.y - noise * 0.14 * uAmplitude;
  float fade    = smoothstep(0.0, 0.4, uv.y);
  wave          = mix(uv.y, wave, fade);
  float core    = 0.5;
  float intensity = smoothstep(core - uBlend, core + uBlend, wave);
  vec3 color    = intensity * ramp;
  fragColor     = vec4(color * intensity, intensity);
}`;

    const renderer = new Renderer({ alpha: true, antialias: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const geometry = new Triangle(gl);
    if ((geometry.attributes as any).uv) delete (geometry.attributes as any).uv;

    const stops = cfg.colorStops.map(hex => {
      const c = new Color(hex); return [c.r, c.g, c.b];
    });

    const program = new Program(gl, {
      vertex: VERT, fragment: FRAG,
      uniforms: {
        uTime:       { value: 0 },
        uAmplitude:  { value: cfg.amplitude },
        uBlend:      { value: cfg.blend },
        uResolution: { value: [container.offsetWidth, container.offsetHeight] },
        uColorStops: { value: stops },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    container.appendChild(gl.canvas);

    const resize = () => {
      const w = container.offsetWidth, h = container.offsetHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
    };
    window.addEventListener('resize', resize);
    resize();

    let rafId: number;
    const animate = (t: number) => {
      rafId = requestAnimationFrame(animate);
      program.uniforms.uTime.value = t * 0.001 * cfg.speed;
      renderer.render({ scene: mesh });
    };
    animate(0);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen', opacity: 0.95 }}
    />
  );
}

// ── Иконки соц.сетей ─────────────────────────────────────────────────────────

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path fill="currentColor" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0m4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

function BotIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path fill="currentColor" d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A2.5 2.5 0 0 0 5 15.5 2.5 2.5 0 0 0 7.5 18 2.5 2.5 0 0 0 10 15.5 2.5 2.5 0 0 0 7.5 13m9 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5z"/>
    </svg>
  );
}

const ICON_COMPONENTS: Record<string, React.ComponentType> = {
  telegram: TelegramIcon,
  bot:      BotIcon,
};

// ── Footer ────────────────────────────────────────────────────────────────────

export function AuroraFooter() {
  const year = new Date().getFullYear();
  const cfg  = auroraFooterConfig;

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: '#000', minHeight: '320px' }}>

      <AuroraCanvas />

      <footer className="relative z-10 py-16 md:py-24 select-none">
        <div className="mx-auto max-w-5xl px-6 flex flex-col items-center gap-8">

          {/* Logo */}
          <Link href="/" aria-label="Главная">
            <Image
              src={logo}
              alt="SLASH VPN"
              width={cfg.logoWidth}
              height={cfg.logoHeight}
              className="h-10 w-auto transition-opacity duration-300"
              style={{ opacity: cfg.logoOpacity }}
              onMouseEnter={e => ((e.target as HTMLElement).style.opacity = String(cfg.logoHoverOpacity))}
              onMouseLeave={e => ((e.target as HTMLElement).style.opacity = String(cfg.logoOpacity))}
            />
          </Link>

          {/* Social icons */}
          <div className="flex items-center gap-6 md:gap-8">
            {cfg.socials.map(s => {
              const Icon = ICON_COMPONENTS[s.icon];
              return (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="block transition-all duration-200 hover:scale-110 w-8 h-8 md:w-11 md:h-11"
                  style={{ color: cfg.socialColor }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = cfg.socialHoverColor)}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = cfg.socialColor)}
                >
                  {Icon && <Icon />}
                </Link>
              );
            })}
          </div>

          {/* Legal links */}
          <div className="flex flex-wrap justify-center gap-5 md:gap-8">
            {cfg.legalLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-inter-tight text-xs md:text-sm transition-colors duration-200"
                style={{ color: cfg.legalColor }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = cfg.legalHoverColor)}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = cfg.legalColor)}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="font-inter-tight text-xs" style={{ color: cfg.copyrightColor }}>
            © {year} {cfg.copyrightText}
          </p>

        </div>
      </footer>
    </div>
  );
}
