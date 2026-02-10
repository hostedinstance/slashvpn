import AuroraShader from "@/components/Aurora";

export const Aurora = () => {
  return (
    <AuroraShader
      flipVertical={true}
      colorStops={["#3700FF", "#000", "#3700FF"]}
      amplitude={0.6}
      blend={0.5}
      speed={2}
    />
  );
};