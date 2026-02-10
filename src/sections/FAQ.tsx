import { GridAccordions, GridAccordion } from "@/components/grid-accordion";

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-24 bg-black">
      <div className="container">
        <h2 className="text-5xl md:text-6xl font-medium text-center tracking-tighter text-white">
          Часто задаваемые
        </h2>
        <h2 className="text-5xl md:text-6xl font-medium text-center tracking-tighter text-white mb-5">
          вопросы
        </h2>
        <p className="text-lg md:text-xl font-inter-tight text-white/70 text-center tracking-tight mb-10 max-w-2xl mx-auto">
          Ответы на популярные вопросы о нашем сервисе.
        </p>

        <div className="max-w-component mx-auto">
          <GridAccordions type="single">
            <GridAccordion id="faq-1" title="Как SlashVPN влияет на скорость интернета?">
              <p>Мы используем современные протоколы{/*(VLESS)*/}, которые минимизируют потерю скорости. В большинстве случаев вы даже не заметите разницы при просмотре 4K-видео или в онлайн-играх. Скорость зависит от удаленности сервера: чем ближе сервер, тем быстрее отклик.</p>
            </GridAccordion>
            <GridAccordion id="faq-2" title="Собираете ли вы информацию о том, что я делаю в интернете?">
              <p>Нет. SlashVPN придерживается строгой политики 0-log. Мы не отслеживаем, какие сайты вы посещаете, и не храним историю ваших подключений. Ваша активность в сети — это только ваше дело.</p>
            </GridAccordion>
            <GridAccordion id="faq-3" title="Что делать, если VPN перестал подключаться?">
              <p>Попробуйте сменить локацию (сервер) или протокол в настройках приложения. Если это не помогло — наша служба поддержки работает 24/7. Просто напишите нам в чат, и мы поможем восстановить доступ за пару минут.</p>
            </GridAccordion>
            <GridAccordion id="faq-4" title="Могу ли я вернуть деньги, если мне не понравится?">
              <p>Да, мы уверены в качестве своего сервиса, поэтому предоставляем гарантию возврата средств в течение 3 дней после покупки. Никакого риска — вы либо довольны сервисом, либо получаете деньги назад.</p>
            </GridAccordion>
          </GridAccordions>
        </div>
      </div>
    </section>
  );
}