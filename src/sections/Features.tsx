import { FeatureGrid } from "@/components/FeatureGrid";

const mockFeatures = [
  {
    id: "speed",
    icon: "./assets/lottie/vroom.lottie",
    title: "Высокая скорость",
    description: "Серверы по всему миру обеспечивают стабильное и быстрое соединение без потери скорости.",
  },
  {
    id: "easy",
    icon: "./assets/lottie/click.lottie",
    title: "Подключение в 1 клик",
    description: "Никаких сложных настроек — просто нажми кнопку и пользуйся безопасным интернетом.",
  },
  {
    id: "security",
    icon: "./assets/lottie/stars.lottie",
    title: "Полная безопасность",
    description: "Шифрование трафика и защита данных, чтобы никто не мог отследить твою активность.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="!p-0 !m-0">
    <FeatureGrid
      features={mockFeatures}
      sectionTitle="Почему стоит выбрать SlashVPN?"
      sectionSubtitle="Мы создали сервис, который не нужно «настраивать» — им нужно просто пользоваться."
    />
    </section>
  );
};