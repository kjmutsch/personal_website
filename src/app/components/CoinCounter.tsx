// Top-left HUD coin counter rendered in 8-bit pixel style; shown only during the home-page game.
"use client";

interface CoinCounterProps {
  count: number;
}

const CoinCounter = ({ count }: CoinCounterProps) => {
  const padded = String(count).padStart(3, "0");

  return (
    <div
      className="fixed top-4 left-6 flex items-center gap-3 select-none"
      style={{ zIndex: 100 }}
    >
      <img
        src="/images/objects/coin.png"
        alt=""
        aria-hidden
        style={{
          width: 40,
          height: 40,
          imageRendering: "pixelated",
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-press-start), monospace",
          fontSize: 20,
          color: "#FFFFFF",
          letterSpacing: "0.05em",
          textShadow:
            "2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000, 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
        }}
      >
        <span style={{ color: "#FFD93B" }}>x</span> {padded}
      </span>
    </div>
  );
};

export default CoinCounter;
