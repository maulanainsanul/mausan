import React from 'react';
import type { DiagramSpec } from '../types/physics';

interface SVGPhysicsDiagramProps {
  spec: DiagramSpec;
}

export const SVGPhysicsDiagram: React.FC<SVGPhysicsDiagramProps> = ({ spec }) => {
  if (spec.jenis === 'tiga_grafik_s1') {
    return (
      <div className="my-3 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] p-3">
        {spec.judul && (
          <p className="text-xs font-bold text-[var(--text-secondary)] mb-2 text-center">{spec.judul}</p>
        )}
        <svg viewBox="0 0 420 135" className="w-full max-w-lg mx-auto h-auto" role="img" aria-label={spec.judul || 'Tiga grafik jarak terhadap waktu'}>
          {[
            { label: 'Mobil 1', ox: 12, type: 'curve' as const, color: '#FF7A1A' },
            { label: 'Mobil 2', ox: 148, type: 'flat' as const, color: '#2F6BFF' },
            { label: 'Mobil 3', ox: 284, type: 'line' as const, color: '#16A36E' },
          ].map((g) => (
            <g key={g.label} transform={`translate(${g.ox}, 8)`}>
              <rect width="122" height="118" rx="12" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.16" />
              <line x1="22" y1="22" x2="22" y2="92" stroke="currentColor" strokeWidth="1.8" />
              <line x1="22" y1="92" x2="108" y2="92" stroke="currentColor" strokeWidth="1.8" />
              <text x="12" y="28" fontSize="10" fontWeight="700" fill="currentColor">s</text>
              <text x="104" y="105" fontSize="10" fontWeight="700" fill="currentColor" textAnchor="end">t</text>
              {g.type === 'curve' && (
                <path d="M22 92 Q64 88 102 28" fill="none" stroke={g.color} strokeWidth="3" strokeLinecap="round" />
              )}
              {g.type === 'flat' && (
                <line x1="22" y1="54" x2="102" y2="54" stroke={g.color} strokeWidth="3" strokeLinecap="round" />
              )}
              {g.type === 'line' && (
                <line x1="22" y1="92" x2="102" y2="32" stroke={g.color} strokeWidth="3" strokeLinecap="round" />
              )}
              <text x="61" y="112" fontSize="11" fontWeight="700" fill={g.color} textAnchor="middle">
                {g.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  if (spec.jenis === 'grafik_kalor_abcd') {
    return (
      <div className="my-3 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] p-3">
        {spec.judul && (
          <p className="text-xs font-bold text-[var(--text-secondary)] mb-2 text-center">{spec.judul}</p>
        )}
        <svg viewBox="0 0 360 185" className="w-full max-w-md mx-auto h-auto" role="img" aria-label={spec.judul || 'Grafik pemanasan es A B C D'}>
          {/* Axes */}
          <line x1="56" y1="18" x2="56" y2="152" stroke="currentColor" strokeWidth="2" />
          <line x1="56" y1="152" x2="335" y2="152" stroke="currentColor" strokeWidth="2" />
          {/* 0 C dashed guide */}
          <line x1="56" y1="108" x2="320" y2="108" stroke="currentColor" strokeOpacity="0.22" strokeDasharray="4 4" />
          {/* A(-5) -> B(0) -> C(0) -> D(80) */}
          <polyline points="72,134 114,108 198,108" fill="none" stroke="#2F6BFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="198" y1="108" x2="306" y2="36" stroke="#FF7A1A" strokeWidth="3.5" strokeLinecap="round" />
          {/* Points */}
          {[
            { x: 72, y: 134, label: 'A (-5°C)', dx: 6, dy: 14 },
            { x: 114, y: 108, label: 'B (0°C)', dx: -4, dy: -10 },
            { x: 198, y: 108, label: 'C (0°C)', dx: 6, dy: 16 },
            { x: 306, y: 36, label: 'D (80°C)', dx: -12, dy: -10 },
          ].map((pt) => (
            <g key={pt.label}>
              <circle cx={pt.x} cy={pt.y} r="4.5" fill="#FF7A1A" stroke="#FFFFFF" strokeWidth="1.5" />
              <text x={pt.x + pt.dx} y={pt.y + pt.dy} fontSize="10" fontWeight="700" fill="currentColor">
                {pt.label}
              </text>
            </g>
          ))}
          <text x="14" y="28" fontSize="11" fontWeight="700" fill="currentColor">T (°C)</text>
          <text x="330" y="172" fontSize="11" fontWeight="700" fill="currentColor" textAnchor="end">Kalor (Q)</text>
        </svg>
      </div>
    );
  }

  if (spec.jenis === 'empat_katrol') {
    return (
      <div className="my-3 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] p-3">
        {spec.judul && (
          <p className="text-xs font-bold text-[var(--text-secondary)] mb-2 text-center">{spec.judul}</p>
        )}
        <svg viewBox="0 0 420 140" className="w-full max-w-lg mx-auto h-auto" role="img" aria-label={spec.judul || 'Empat model katrol'}>
          {/* Model I: Tetap */}
          <g transform="translate(8, 8)">
            <rect width="94" height="122" rx="12" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.16" />
            <line x1="18" y1="14" x2="76" y2="14" stroke="currentColor" strokeWidth="3" />
            <line x1="47" y1="14" x2="47" y2="34" stroke="currentColor" strokeWidth="2" />
            <circle cx="47" cy="34" r="11" fill="#2F6BFF" fillOpacity="0.2" stroke="#2F6BFF" strokeWidth="2" />
            <line x1="36" y1="34" x2="36" y2="74" stroke="currentColor" strokeWidth="1.8" />
            <line x1="58" y1="34" x2="58" y2="82" stroke="#FF7A1A" strokeWidth="2" />
            <rect x="25" y="74" width="22" height="16" rx="3" fill="#FF7A1A" />
            <text x="47" y="112" fontSize="10" fontWeight="700" fill="currentColor" textAnchor="middle">I. Tetap</text>
          </g>
          {/* Model II: Bergerak */}
          <g transform="translate(110, 8)">
            <rect width="94" height="122" rx="12" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.16" />
            <line x1="18" y1="14" x2="76" y2="14" stroke="currentColor" strokeWidth="3" />
            <line x1="34" y1="14" x2="34" y2="54" stroke="currentColor" strokeWidth="1.8" />
            <line x1="56" y1="54" x2="56" y2="20" stroke="#FF7A1A" strokeWidth="2" />
            <circle cx="45" cy="54" r="11" fill="#2F6BFF" fillOpacity="0.2" stroke="#2F6BFF" strokeWidth="2" />
            <line x1="45" y1="65" x2="45" y2="76" stroke="currentColor" strokeWidth="2" />
            <rect x="34" y="76" width="22" height="16" rx="3" fill="#FF7A1A" />
            <text x="47" y="112" fontSize="10" fontWeight="700" fill="currentColor" textAnchor="middle">II. Bergerak</text>
          </g>
          {/* Model III: Ganda (2 roda) */}
          <g transform="translate(212, 8)">
            <rect width="94" height="122" rx="12" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.16" />
            <line x1="18" y1="14" x2="76" y2="14" stroke="currentColor" strokeWidth="3" />
            <line x1="47" y1="14" x2="47" y2="30" stroke="currentColor" strokeWidth="2" />
            <circle cx="47" cy="30" r="9" fill="#2F6BFF" fillOpacity="0.2" stroke="#2F6BFF" strokeWidth="2" />
            <circle cx="47" cy="58" r="9" fill="#2F6BFF" fillOpacity="0.2" stroke="#2F6BFF" strokeWidth="2" />
            <line x1="38" y1="30" x2="38" y2="58" stroke="currentColor" strokeWidth="1.6" />
            <line x1="56" y1="30" x2="56" y2="76" stroke="#FF7A1A" strokeWidth="2" />
            <line x1="47" y1="67" x2="47" y2="78" stroke="currentColor" strokeWidth="2" />
            <rect x="36" y="78" width="22" height="15" rx="3" fill="#FF7A1A" />
            <text x="47" y="112" fontSize="10" fontWeight="700" fill="currentColor" textAnchor="middle">III. Ganda (2)</text>
          </g>
          {/* Model IV: Majemuk (3 roda) */}
          <g transform="translate(314, 8)">
            <rect width="98" height="122" rx="12" fill="#16A36E" fillOpacity="0.08" stroke="#16A36E" strokeOpacity="0.45" />
            <line x1="18" y1="14" x2="80" y2="14" stroke="currentColor" strokeWidth="3" />
            <circle cx="42" cy="29" r="8" fill="#16A36E" fillOpacity="0.25" stroke="#16A36E" strokeWidth="2" />
            <circle cx="58" cy="29" r="8" fill="#16A36E" fillOpacity="0.25" stroke="#16A36E" strokeWidth="2" />
            <circle cx="50" cy="56" r="9" fill="#16A36E" fillOpacity="0.25" stroke="#16A36E" strokeWidth="2" />
            <line x1="34" y1="29" x2="41" y2="56" stroke="currentColor" strokeWidth="1.5" />
            <line x1="50" y1="29" x2="50" y2="47" stroke="currentColor" strokeWidth="1.5" />
            <line x1="59" y1="56" x2="66" y2="29" stroke="currentColor" strokeWidth="1.5" />
            <line x1="72" y1="29" x2="72" y2="76" stroke="#FF7A1A" strokeWidth="2" />
            <rect x="39" y="77" width="22" height="15" rx="3" fill="#16A36E" />
            <text x="49" y="112" fontSize="10" fontWeight="700" fill="#16A36E" textAnchor="middle">IV. Majemuk (3)</text>
          </g>
        </svg>
      </div>
    );
  }

  if (spec.jenis === 'kotak_asap') {
    return (
      <div className="my-3 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] p-3">
        {spec.judul && (
          <p className="text-xs font-bold text-[var(--text-secondary)] mb-2 text-center">{spec.judul}</p>
        )}
        <svg viewBox="0 0 340 165" className="w-full max-w-md mx-auto h-auto" role="img" aria-label={spec.judul || 'Kotak kaca konveksi asap'}>
          {/* Chimneys A, B, C */}
          <rect x="64" y="24" width="26" height="44" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="157" y="24" width="26" height="44" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="250" y="24" width="26" height="44" fill="none" stroke="currentColor" strokeWidth="2" />
          {/* Glass box */}
          <rect x="44" y="68" width="252" height="78" rx="8" fill="#38BDF8" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" />
          {/* Labels */}
          <text x="77" y="17" fontSize="12" fontWeight="700" fill="currentColor" textAnchor="middle">Pipa A ↑</text>
          <text x="170" y="17" fontSize="12" fontWeight="700" fill="#FF7A1A" textAnchor="middle">Pipa B ↓</text>
          <text x="263" y="17" fontSize="12" fontWeight="700" fill="currentColor" textAnchor="middle">Pipa C ↑</text>
          {/* Smoke paths */}
          <path d="M170 28 V110 Q170 124 125 124 H90 Q77 124 77 104 V32" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="5 4" />
          <path d="M170 96 Q170 124 215 124 H250 Q263 124 263 104 V32" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="5 4" />
          <text x="170" y="138" fontSize="10" fontWeight="600" fill="currentColor" textAnchor="middle">Asap masuk lewat B, mengalir lalu naik keluar lewat A &amp; C</text>
        </svg>
      </div>
    );
  }

  if (spec.jenis === 'bidang_miring') {
    const isBola = spec.bendaBidang === 'bola';
    return (
      <div className="my-3 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] p-3">
        {spec.judul && (
          <p className="text-xs font-bold text-[var(--text-secondary)] mb-2 text-center">{spec.judul}</p>
        )}
        <svg viewBox="0 0 340 165" className="w-full max-w-md mx-auto h-auto" role="img" aria-label={spec.judul || 'Bidang miring'}>
          {/* Right triangle */}
          <polygon points="48,136 276,136 276,36" fill="#2F6BFF" fillOpacity="0.12" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
          {isBola ? (
            <circle cx="176" cy="70" r="14" fill="#FF7A1A" stroke="#FFFFFF" strokeWidth="1.5" />
          ) : (
            <g transform="translate(162, 62) rotate(-23.7)">
              <rect x="-18" y="-22" width="36" height="22" rx="4" fill="#FF7A1A" stroke="#FFFFFF" strokeWidth="1.5" />
              <line x1="18" y1="-11" x2="54" y2="-11" stroke="#16A36E" strokeWidth="3" />
              <polygon points="54,-16 64,-11 54,-6" fill="#16A36E" />
              <text x="42" y="-17" fontSize="10" fontWeight="700" fill="#16A36E">F</text>
            </g>
          )}
          {spec.beratBenda && (
            <text x="148" y="42" fontSize="11" fontWeight="700" fill="#FF7A1A">W = {spec.beratBenda} N</text>
          )}
          {spec.panjangBidang && (
            <text x="150" y="106" fontSize="11" fontWeight="700" fill="currentColor">s = {spec.panjangBidang} m</text>
          )}
          {spec.tinggiBidang && (
            <text x="284" y="92" fontSize="11" fontWeight="700" fill="currentColor">h = {spec.tinggiBidang} m</text>
          )}
        </svg>
      </div>
    );
  }

  if (spec.jenis === 'tabung_resonansi') {
    return (
      <div className="my-3 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] p-3">
        {spec.judul && (
          <p className="text-xs font-bold text-[var(--text-secondary)] mb-2 text-center">{spec.judul}</p>
        )}
        <svg viewBox="0 0 320 175" className="w-full max-w-sm mx-auto h-auto" role="img" aria-label={spec.judul || 'Tabung resonansi kolom udara'}>
          {/* Tuning fork */}
          <path d="M138 14 V34 Q138 42 148 42 Q158 42 158 34 V14 M148 42 V54" fill="none" stroke="#FF7A1A" strokeWidth="3" strokeLinecap="round" />
          <text x="172" y="30" fontSize="10" fontWeight="700" fill="#FF7A1A">Garpu tala (425 Hz)</text>
          {/* Cylinder */}
          <rect x="122" y="62" width="52" height="98" fill="none" stroke="currentColor" strokeWidth="2.2" />
          {/* Water */}
          <rect x="123" y="114" width="50" height="45" fill="#38BDF8" fillOpacity="0.45" />
          <text x="148" y="140" fontSize="11" fontWeight="700" fill="currentColor" textAnchor="middle">Air</text>
          {/* Air column bracket */}
          <line x1="106" y1="62" x2="106" y2="114" stroke="#2F6BFF" strokeWidth="2" />
          <line x1="101" y1="62" x2="111" y2="62" stroke="#2F6BFF" strokeWidth="2" />
          <line x1="101" y1="114" x2="111" y2="114" stroke="#2F6BFF" strokeWidth="2" />
          <text x="96" y="90" fontSize="10" fontWeight="700" fill="#2F6BFF" textAnchor="end">Udara (30 cm)</text>
        </svg>
      </div>
    );
  }

  if (spec.jenis === 'pasang_surut') {
    const isPurnama = spec.fasePasang === 'purnama';
    return (
      <div className="my-3 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] p-3">
        {spec.judul && (
          <p className="text-xs font-bold text-[var(--text-secondary)] mb-2 text-center">{spec.judul}</p>
        )}
        <svg viewBox="0 0 360 170" className="w-full max-w-md mx-auto h-auto" role="img" aria-label={spec.judul || 'Diagram pasang surut'}>
          <rect width="360" height="170" rx="14" fill="#0F172A" />
          <circle cx="48" cy="85" r="24" fill="#FFBE2E" />
          <text x="48" y="126" fill="#F8FAFC" fontSize="11" textAnchor="middle">Matahari</text>
          <circle cx="210" cy="85" r="56" fill="none" stroke="#475569" strokeDasharray="4 4" strokeWidth="1.5" />
          <ellipse
            cx="210"
            cy="85"
            rx={isPurnama ? 34 : 26}
            ry={isPurnama ? 22 : 28}
            fill="#38BDF8"
            fillOpacity="0.32"
            stroke="#38BDF8"
            strokeWidth="1.5"
          />
          <circle cx="210" cy="85" r="16" fill="#2F6BFF" />
          <text x="210" y="148" fill="#F8FAFC" fontSize="11" textAnchor="middle">Bumi</text>
          {isPurnama ? (
            <>
              <circle cx="266" cy="85" r="10" fill="#E2E8F0" />
              <text x="295" y="89" fill="#F8FAFC" fontSize="11">Bulan</text>
              <line x1="74" y1="85" x2="254" y2="85" stroke="#FFBE2E" strokeWidth="1.5" strokeDasharray="3 3" />
            </>
          ) : (
            <>
              <circle cx="210" cy="29" r="10" fill="#E2E8F0" />
              <text x="234" y="33" fill="#F8FAFC" fontSize="11">Bulan</text>
              <path d="M210 66 V41 M74 85 H191" stroke="#FFBE2E" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M196 85 V71 H210" fill="none" stroke="#FF7A1A" strokeWidth="1.5" />
            </>
          )}
        </svg>
      </div>
    );
  }

  // Grafik koordinat s-t, v-t, kalor
  const pts = spec.points ?? [];
  if (pts.length === 0) return null;

  const maxX = Math.max(...pts.map((p) => p.x), 1);
  const maxY = Math.max(...pts.map((p) => p.y), 1);
  const padL = 46;
  const padR = 20;
  const padT = 18;
  const padB = 34;
  const w = 320;
  const h = 180;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const mapX = (x: number) => padL + (x / maxX) * plotW;
  const mapY = (y: number) => padT + plotH - (y / maxY) * plotH;
  const polyPoints = pts.map((p) => `${mapX(p.x).toFixed(1)},${mapY(p.y).toFixed(1)}`).join(' ');

  return (
    <div className="my-3 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] p-3">
      {spec.judul && (
        <p className="text-xs font-bold text-[var(--text-secondary)] mb-1 text-center">{spec.judul}</p>
      )}
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-md mx-auto h-auto" role="img" aria-label={spec.judul || 'Grafik fisika'}>
        {[0.25, 0.5, 0.75, 1].map((f) => {
          const gy = padT + plotH * (1 - f);
          return <line key={f} x1={padL} y1={gy} x2={w - padR} y2={gy} stroke="currentColor" strokeOpacity="0.12" strokeDasharray="3 3" />;
        })}
        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="currentColor" strokeWidth="2" />
        <line x1={padL} y1={padT + plotH} x2={w - padR} y2={padT + plotH} stroke="currentColor" strokeWidth="2" />
        {spec.jenis === 'grafik_vt' && (
          <polygon
            points={`${mapX(pts[0].x)},${padT + plotH} ${polyPoints} ${mapX(pts[pts.length - 1].x)},${padT + plotH}`}
            fill="#2F6BFF"
            fillOpacity="0.16"
          />
        )}
        <polyline fill="none" stroke="#FF7A1A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={polyPoints} />
        {pts.map((p, idx) => (
          <g key={idx}>
            <circle cx={mapX(p.x)} cy={mapY(p.y)} r="4.5" fill="#2F6BFF" stroke="#FFFFFF" strokeWidth="1.5" />
            <text
              x={mapX(p.x)}
              y={mapY(p.y) - 8}
              fontSize="10"
              fontFamily="JetBrains Mono, monospace"
              fill="currentColor"
              textAnchor={idx === pts.length - 1 ? 'end' : 'start'}
            >
              ({p.x}, {p.y})
            </text>
          </g>
        ))}
        <text x={w - padR} y={padT + plotH + 24} fontSize="11" fontWeight="700" fill="currentColor" textAnchor="end">
          {spec.xLabel || 'x'}
        </text>
        <text x={14} y={padT + 10} fontSize="11" fontWeight="700" fill="currentColor">
          {spec.yLabel || 'y'}
        </text>
      </svg>
    </div>
  );
};
