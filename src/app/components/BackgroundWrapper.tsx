interface BackgroundProps {
  position: number;
  distantPosition: number;
}

export default function BackgroundWrapper({ position, distantPosition }: BackgroundProps) {
    return (
    <>
        <div
        className="absolute inset-0 w-full h-full"
        style={{
          overflow: "hidden",
          backgroundImage: "url('/images/background/mountains.svg')",
          backgroundSize: 'cover',
          backgroundRepeat: "repeat-x", // Ensure seamless tiling
          backgroundPosition: `${distantPosition}px 0px`, // Move background infinitely
       }}
      />
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          overflow: "hidden",
          backgroundImage: "url('/images/background/background.svg')",
          backgroundSize: 'cover',
          backgroundRepeat: "repeat-x", // Ensure seamless tiling
          backgroundPosition: `${position}px 0px`, // Move background infinitely
        }}
      />

    </>
  );
}