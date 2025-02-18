interface BackgroundProps {
  position: number;
}

export default function BackgroundWrapper({ position }: BackgroundProps) {
    return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        overflow: "hidden",
        backgroundImage: "url('/images/background.svg')",
        backgroundSize: 'cover',
        backgroundRepeat: "repeat-x", // Ensure seamless tiling
        backgroundPosition: `${position}px 0px`, // Move background infinitely
      }}
    />
  );
}