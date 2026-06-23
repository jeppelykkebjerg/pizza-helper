import { useState } from 'react';

const SERIF = '"Iowan Old Style", "Palatino Linotype", Palatino, "URW Palladio L", Georgia, serif';
const SANS = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

const RECIPE_URL = 'https://jonsmadklub.dk/blogs/opskrifter/italiensk-pizzadej';

// Jons opskrift som basis
const BASE = {
  flour: 600,
  water: 415, // 69% hydrering
  salt: 16,
  yeastDry: 1, // præcis: 1 g (≈ 1/3 tsk)
  yeastFresh: 1.75,
  sourdough: 80,
};

// Baker's percentages – alle ingredienser relativt til mel-mængden
const RATIO = {
  salt: BASE.salt / BASE.flour,
  yeastDry: BASE.yeastDry / BASE.flour,
  yeastFresh: BASE.yeastFresh / BASE.flour,
  sourdough: BASE.sourdough / BASE.flour,
};

const JON_HYDRATION = 69;

function formatYeastTsp(grams) {
  const tsp = grams / 3;
  if (tsp < 0.18) return '⅛ tsk';
  if (tsp < 0.29) return '¼ tsk';
  if (tsp < 0.42) return '⅓ tsk';
  if (tsp < 0.62) return '½ tsk';
  if (tsp < 0.87) return '¾ tsk';
  if (tsp < 1.12) return '1 tsk';
  if (tsp < 1.37) return '1¼ tsk';
  if (tsp < 1.62) return '1⅓ tsk';
  if (tsp < 1.87) return '1½ tsk';
  if (tsp < 2.5) return '2 tsk';
  return `${tsp.toFixed(1)} tsk`;
}

function formatGrams(g, oneDecimalBelow = 10) {
  if (g < oneDecimalBelow) return (Math.round(g * 10) / 10).toFixed(1).replace('.', ',');
  return Math.round(g).toString();
}

// Yeast i gram: vis som heltal hvis tæt på heltal, ellers 1 decimal
function formatYeastGrams(g) {
  const rounded = Math.round(g);
  if (Math.abs(g - rounded) < 0.05) return rounded.toString();
  return (Math.round(g * 10) / 10).toFixed(1).replace('.', ',');
}

export default function App() {
  const [numPizzas, setNumPizzas] = useState(4);
  const [ballWeight, setBallWeight] = useState(260);
  const [hydration, setHydration] = useState(JON_HYDRATION);

  const totalDough = numPizzas * ballWeight;
  const H = hydration / 100;

  // Total dej = mel × (1 + H + saltRatio + gærRatio)
  const flourGrams = totalDough / (1 + H + RATIO.salt + RATIO.yeastDry);

  const flour = Math.round(flourGrams);
  const water = Math.round(flourGrams * H);
  const salt = formatGrams(flourGrams * RATIO.salt);
  const yeastDryRaw = flourGrams * RATIO.yeastDry;
  const yeastDryG = formatYeastGrams(yeastDryRaw);
  const yeastDryTsp = formatYeastTsp(yeastDryRaw);
  const yeastFresh = formatGrams(flourGrams * RATIO.yeastFresh, 5);
  const sourdough = formatGrams(flourGrams * RATIO.sourdough);

  const stepPizza = (d) => setNumPizzas((n) => Math.max(1, Math.min(30, n + d)));
  const stepBall = (d) => setBallWeight((w) => Math.max(150, Math.min(400, w + d)));
  const stepHydration = (d) => setHydration((h) => Math.max(55, Math.min(80, h + d)));

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F5EFE3',
        color: '#241B14',
        fontFamily: SANS,
        padding: '32px 20px 80px',
      }}
    >
      <div style={{ maxWidth: '440px', margin: '0 auto' }}>
        {/* Titel */}
        <div style={{ marginBottom: '36px' }}>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#9B3A1F',
              fontWeight: 600,
              marginBottom: '14px',
            }}
          >
            Pizzadej · Beregner
          </div>
          <h1
            style={{
              fontFamily: SERIF,
              fontSize: '44px',
              lineHeight: 1,
              letterSpacing: '-0.01em',
              fontWeight: 400,
              margin: 0,
              color: '#241B14',
            }}
          >
            Jons
            <br />
            <span style={{ fontStyle: 'italic', color: '#9B3A1F' }}>italienske</span> dej
          </h1>
          <p
            style={{
              fontSize: '14px',
              lineHeight: 1.5,
              color: '#6B5742',
              margin: '14px 0 0',
              maxWidth: '320px',
            }}
          >
            Justér antal, bollevægt og hydrering — så regner appen ingredienserne ud.
          </p>
        </div>

        {/* Inputs */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <Stepper
            label="Antal pizzaer"
            value={numPizzas}
            onMinus={() => stepPizza(-1)}
            onPlus={() => stepPizza(1)}
            onChange={(v) => setNumPizzas(Math.max(1, Math.min(30, v || 1)))}
          />
          <Stepper
            label="Vægt pr. dejbolle"
            value={ballWeight}
            suffix="g"
            onMinus={() => stepBall(-5)}
            onPlus={() => stepBall(5)}
            onChange={(v) => setBallWeight(Math.max(150, Math.min(400, v || 150)))}
            hint="Jon anbefaler 250–275 g"
          />
          <Stepper
            label="Hydrering"
            value={hydration}
            suffix="%"
            onMinus={() => stepHydration(-1)}
            onPlus={() => stepHydration(1)}
            onChange={(v) => setHydration(Math.max(55, Math.min(80, v || 55)))}
            hint={
              hydration === JON_HYDRATION
                ? `Jons opskrift: ${JON_HYDRATION} %`
                : `Jons opskrift: ${JON_HYDRATION} % · du har valgt ${hydration} %`
            }
          />
        </div>

        {/* Total */}
        <div
          style={{
            background: '#241B14',
            color: '#F5EFE3',
            borderRadius: '16px',
            padding: '20px 22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                opacity: 0.55,
                fontWeight: 600,
              }}
            >
              Samlet dej
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: '13px',
                opacity: 0.65,
                marginTop: '2px',
              }}
            >
              {numPizzas} × {ballWeight} g · {hydration} % hydr.
            </div>
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: '36px',
              fontFeatureSettings: '"tnum"',
              lineHeight: 1,
            }}
          >
            {totalDough.toLocaleString('da-DK')}
            <span style={{ fontSize: '15px', opacity: 0.55, marginLeft: '4px', fontStyle: 'italic' }}>
              g
            </span>
          </div>
        </div>

        {/* Ingredienser */}
        <div>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#9B3A1F',
              fontWeight: 600,
              marginBottom: '4px',
            }}
          >
            Ingredienser
          </div>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: '24px',
              margin: '0 0 16px',
              color: '#241B14',
            }}
          >
            du skal bruge
          </h2>

          <Row name="Mel" sub="Caputo Tipo 00" value={flour} unit="g" />
          <Row name="Vand" sub="koldt" value={water} unit="g" />
          <Row name="Salt" value={salt} unit="g" />
          <Row
            name="Tørgær"
            sub="rør i vandet først"
            value={yeastDryG}
            unit="g"
            subValue={`≈ ${yeastDryTsp}`}
            hideBorder
          />

          {/* Gær-alternativer – minimeret */}
          <div style={{ paddingTop: '2px', paddingBottom: '6px' }}>
            <AltRow name="eller frisk gær" value={yeastFresh} unit="g" />
            <AltRow name="eller aktiv surdej" value={sourdough} unit="g" last />
          </div>
        </div>

        {/* Kilde-link */}
        <div
          style={{
            marginTop: '36px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(36,27,20,0.12)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#8B7660',
              fontWeight: 600,
              marginBottom: '10px',
            }}
          >
            Original opskrift
          </div>
          <a
            href={RECIPE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: SERIF,
              fontSize: '17px',
              color: '#9B3A1F',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(155,58,31,0.35)',
              paddingBottom: '3px',
            }}
          >
            <span style={{ fontStyle: 'italic' }}>Jons Madklub</span>
            <span
              aria-hidden="true"
              style={{
                fontSize: '13px',
                fontFamily: SANS,
                transform: 'translateY(-1px)',
              }}
            >
              ↗
            </span>
          </a>
          <div
            style={{
              fontSize: '12.5px',
              color: '#8B7660',
              fontStyle: 'italic',
              fontFamily: SERIF,
              marginTop: '14px',
            }}
          >
            minimum 48 timer på køl
          </div>
        </div>
      </div>
    </div>
  );
}

function Stepper({ label, value, suffix, onMinus, onPlus, onChange, hint }) {
  return (
    <div
      style={{
        background: '#FBF6EC',
        border: '1px solid rgba(36,27,20,0.1)',
        borderRadius: '16px',
        padding: '14px 14px 14px 18px',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#6B5742',
          fontWeight: 600,
          marginBottom: '8px',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'baseline' }}>
          <input
            type="number"
            inputMode="numeric"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: SERIF,
              fontSize: '34px',
              color: '#241B14',
              padding: 0,
              fontFeatureSettings: '"tnum"',
              MozAppearance: 'textfield',
            }}
          />
          {suffix && (
            <span
              style={{
                position: 'absolute',
                left: `${String(value).length * 19 + 6}px`,
                top: '52%',
                transform: 'translateY(-50%)',
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: '18px',
                color: '#9B3A1F',
                pointerEvents: 'none',
              }}
            >
              {suffix}
            </span>
          )}
        </div>
        <Btn label="−" onClick={onMinus} />
        <Btn label="+" onClick={onPlus} />
      </div>
      {hint && (
        <div
          style={{
            marginTop: '6px',
            fontSize: '12px',
            color: '#8B7660',
            fontStyle: 'italic',
            fontFamily: SERIF,
          }}
        >
          {hint}
        </div>
      )}
    </div>
  );
}

function Btn({ label, onClick }) {
  const [down, setDown] = useState(false);
  return (
    <button
      onClick={onClick}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      style={{
        width: '46px',
        height: '46px',
        borderRadius: '12px',
        border: '1px solid rgba(155,58,31,0.22)',
        background: down ? '#9B3A1F' : 'rgba(155,58,31,0.08)',
        color: down ? '#F5EFE3' : '#9B3A1F',
        fontSize: '24px',
        fontWeight: 300,
        fontFamily: SERIF,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.1s ease',
        transform: down ? 'scale(0.95)' : 'scale(1)',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
        padding: 0,
      }}
    >
      {label}
    </button>
  );
}

function Row({ name, sub, value, unit, subValue, last, hideBorder }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: '14px 0',
        borderBottom: last || hideBorder ? 'none' : '1px dashed rgba(36,27,20,0.18)',
        gap: '12px',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: '22px',
            color: '#241B14',
            lineHeight: 1.1,
          }}
        >
          {name}
        </div>
        {sub && (
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: '12.5px',
              color: '#8B7660',
              marginTop: '2px',
            }}
          >
            {sub}
          </div>
        )}
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: '24px',
            color: '#9B3A1F',
            fontFeatureSettings: '"tnum"',
            whiteSpace: 'nowrap',
            lineHeight: 1.1,
          }}
        >
          {value}
          {unit && (
            <span style={{ fontSize: '14px', marginLeft: '3px', opacity: 0.65, fontStyle: 'italic' }}>
              {unit}
            </span>
          )}
        </div>
        {subValue && (
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: '12.5px',
              color: '#8B7660',
              marginTop: '4px',
              whiteSpace: 'nowrap',
            }}
          >
            {subValue}
          </div>
        )}
      </div>
    </div>
  );
}

function AltRow({ name, value, unit, last }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: '5px 0',
        paddingLeft: '14px',
        borderLeft: '1px solid rgba(155,58,31,0.18)',
        marginLeft: '2px',
        gap: '12px',
      }}
    >
      <div
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: '13.5px',
          color: '#8B7660',
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: '15px',
          color: '#9B3A1F',
          opacity: 0.85,
          fontFeatureSettings: '"tnum"',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
        {unit && (
          <span style={{ fontSize: '11px', marginLeft: '2px', opacity: 0.7, fontStyle: 'italic' }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
