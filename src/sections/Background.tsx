import AuroraShader from "@/components/Aurora";

export const Aurora = () => {
  return (
    <AuroraShader
      flipVertical={true}
      colorStops={["#4800ff", "#000", "#4800ff"]}
      amplitude={0.6}
      blend={0.3}
      speed={2}
    />
  );
};