import Icon from "@/components/ui/icon";

type Page = "catalog" | "cart" | "orders" | "profile" | "delivery" | "reviews" | "support" | "admin" | "auth";

interface Props {
  onNavigate: (page: Page) => void;
}

const services = [
  {
    id: "cdek",
    name: "СДЭК",
    logo: "📦",
    description: "Курьерская доставка по всей России",
    price: "от 350 ₽",
    time: "2–5 дней",
    coverage: "Более 2500 пунктов",
    features: ["Курьер до двери", "Пункты выдачи", "Постаматы", "Отслеживание в реальном времени"],
    color: "#2DCB70",
  },
  {
    id: "post",
    name: "Почта России",
    logo: "📮",
    description: "Государственная почтовая служба",
    price: "от 180 ₽",
    time: "7–14 дней",
    coverage: "42 000+ отделений",
    features: ["Доставка по всей РФ", "Отделения в каждом городе", "Заказные отправления", "EMS-экспресс"],
    color: "#0057A8",
  },
  {
    id: "5post",
    name: "5POST",
    logo: "🏪",
    description: "Доставка в пункты выдачи Пятёрочка",
    price: "от 280 ₽",
    time: "3–7 дней",
    coverage: "18 000+ пунктов",
    features: ["Пункты в Пятёрочке", "Удобный график", "Быстрое получение", "SMS-оповещение"],
    color: "#E94B3C",
  },
  {
    id: "ozon",
    name: "OZON Rocket",
    logo: "🚀",
    description: "Экспресс-доставка от маркетплейса",
    price: "от 220 ₽",
    time: "1–3 дня",
    coverage: "200+ городов",
    features: ["Экспресс-доставка", "Постаматы OZON", "Курьер на следующий день", "Гарантия сроков"],
    color: "#005BFF",
  },
];

const faq = [
  {
    q: "Когда начнётся доставка?",
    a: "Доставка начинается после подтверждения готовности модели исполнителем и оплаты заказа.",
  },
  {
    q: "Как отследить посылку?",
    a: "Трек-номер отправляется на email и в личный кабинет сразу после передачи заказа в службу доставки.",
  },
  {
    q: "Что если модель повреждена при доставке?",
    a: "Мы компенсируем стоимость или переотправим заказ. Все отправления застрахованы.",
  },
  {
    q: "Можно ли сменить службу доставки после оплаты?",
    a: "Возможно до момента передачи заказа в службу. Обратитесь в поддержку.",
  },
];

export default function Delivery({ onNavigate }: Props) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-2">Логистика</p>
        <h1 className="font-display text-4xl mb-4">Доставка</h1>
        <div className="gold-line w-24 mb-4" />
        <p className="font-body text-sm text-muted-foreground max-w-xl">
          Выбирайте удобный способ получения при оформлении заказа. Работаем с ведущими транспортными компаниями России.
        </p>
      </div>

      {/* Services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {services.map((s, i) => (
          <div
            key={s.id}
            className="surface-card p-5 hover:border-gold/30 transition-all animate-fade-in"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{s.logo}</span>
                <div>
                  <h3 className="font-display text-xl">{s.name}</h3>
                  <p className="font-body text-xs text-muted-foreground">{s.description}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: "Стоимость", val: s.price },
                { label: "Срок", val: s.time },
                { label: "Покрытие", val: s.coverage },
              ].map(item => (
                <div key={item.label} className="border border-border p-2 text-center">
                  <div className="font-body text-[9px] text-muted-foreground tracking-widest uppercase mb-0.5">{item.label}</div>
                  <div className="font-body text-xs text-foreground font-medium">{item.val}</div>
                </div>
              ))}
            </div>

            <ul className="space-y-1">
              {s.features.map(f => (
                <li key={f} className="flex items-center gap-2 font-body text-xs text-muted-foreground">
                  <div className="w-1 h-1 bg-gold flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="mb-12">
        <h2 className="font-display text-3xl mb-6">Как это работает</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: "01", title: "Выбор модели", desc: "Найдите нужную модель в каталоге" },
            { step: "02", title: "Оплата", desc: "Оформите заказ и выберите доставку" },
            { step: "03", title: "Создание", desc: "Мастер работает над вашей моделью" },
            { step: "04", title: "Доставка", desc: "Получите заказ удобным способом" },
          ].map((step, i) => (
            <div key={step.step} className="relative animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="font-display text-5xl text-gold/20 mb-2">{step.step}</div>
              <h3 className="font-display text-lg mb-1">{step.title}</h3>
              <p className="font-body text-xs text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="font-display text-3xl mb-6">Частые вопросы</h2>
        <div className="space-y-3">
          {faq.map((item, i) => (
            <div key={i} className="surface-card p-4 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-start gap-3">
                <Icon name="HelpCircle" size={16} className="text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-body text-sm font-medium mb-1">{item.q}</h4>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
        <button onClick={() => onNavigate("catalog")} className="btn-gold">
          Перейти к заказу
        </button>
      </div>
    </div>
  );
}
