import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "catalog" | "cart" | "orders" | "profile" | "delivery" | "reviews" | "support" | "admin" | "auth";

interface Props {
  onNavigate: (page: Page) => void;
}

const orders = [
  {
    id: "ФМ-240815",
    date: "15 февраля 2026",
    status: "delivered",
    statusLabel: "Доставлен",
    items: [{ name: "Архитектурный фасад", qty: 1, price: 12500 }],
    delivery: "СДЭК",
    total: 12850,
    trackingNumber: "1234567890",
  },
  {
    id: "ФМ-240802",
    date: "2 февраля 2026",
    status: "in_work",
    statusLabel: "В работе",
    items: [{ name: "Ювелирное кольцо", qty: 2, price: 5400 }, { name: "Интерьерная ваза", qty: 1, price: 3200 }],
    delivery: "Почта России",
    total: 14180,
    trackingNumber: null,
  },
  {
    id: "ФМ-240120",
    date: "20 января 2026",
    status: "cancelled",
    statusLabel: "Отменён",
    items: [{ name: "Промышленная деталь", qty: 1, price: 8900 }],
    delivery: "5POST",
    total: 9180,
    trackingNumber: null,
  },
];

const statusStyles: Record<string, string> = {
  delivered: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
  in_work: "text-gold border-gold/30 bg-gold/5",
  cancelled: "text-muted-foreground border-border bg-muted/30",
  pending: "text-blue-400 border-blue-400/30 bg-blue-400/5",
};

const statusSteps = [
  { key: "created", label: "Создан" },
  { key: "confirmed", label: "Подтверждён" },
  { key: "in_work", label: "В работе" },
  { key: "shipping", label: "Отправлен" },
  { key: "delivered", label: "Доставлен" },
];

export default function Orders({ onNavigate }: Props) {
  const [selected, setSelected] = useState<typeof orders[0] | null>(null);

  const getStepIndex = (status: string) => {
    const map: Record<string, number> = { created: 0, confirmed: 1, in_work: 2, shipping: 3, delivered: 4 };
    return map[status] ?? -1;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-2">Личный кабинет</p>
        <h1 className="font-display text-4xl">Мои заказы</h1>
        <div className="gold-line w-24 mt-3" />
      </div>

      {selected ? (
        <div className="animate-fade-in">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-2 font-body text-xs text-muted-foreground hover:text-gold transition-colors tracking-wider mb-6"
          >
            <Icon name="ArrowLeft" size={14} />
            Назад к заказам
          </button>

          <div className="surface-card p-6 mb-4">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-2xl mb-1">Заказ {selected.id}</h2>
                <p className="font-body text-xs text-muted-foreground">{selected.date} · {selected.delivery}</p>
              </div>
              <span className={`font-body text-xs tracking-widest uppercase border px-3 py-1 ${statusStyles[selected.status]}`}>
                {selected.statusLabel}
              </span>
            </div>

            {/* Progress */}
            {selected.status !== "cancelled" && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  {statusSteps.map((step, i) => {
                    const current = getStepIndex(selected.status);
                    const done = i <= current;
                    return (
                      <div key={step.key} className="flex flex-col items-center gap-1 flex-1">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${done ? "border-gold bg-gold" : "border-border bg-background"}`}>
                          {done && <Icon name="Check" size={10} className="text-background" />}
                        </div>
                        <span className={`font-body text-[9px] tracking-wider text-center hidden sm:block ${done ? "text-gold" : "text-muted-foreground"}`}>{step.label}</span>
                        {i < statusSteps.length - 1 && (
                          <div className={`absolute hidden`} />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="h-px bg-border mt-1 relative">
                  <div
                    className="h-px bg-gold transition-all"
                    style={{ width: `${(getStepIndex(selected.status) / (statusSteps.length - 1)) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 mb-4">
              {selected.items.map((item, i) => (
                <div key={i} className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">{item.name} × {item.qty}</span>
                  <span>{(item.price * item.qty).toLocaleString()} ₽</span>
                </div>
              ))}
            </div>
            <div className="gold-line mb-4" />
            <div className="flex justify-between font-body">
              <span className="text-sm text-muted-foreground">Итого</span>
              <span className="font-display text-xl text-gold">{selected.total.toLocaleString()} ₽</span>
            </div>

            {selected.trackingNumber && (
              <div className="mt-4 p-3 border border-gold/20 bg-gold/5 flex items-center gap-3">
                <Icon name="Truck" size={16} className="text-gold" />
                <div>
                  <div className="font-body text-xs text-muted-foreground">Трек-номер</div>
                  <div className="font-body text-sm font-medium text-gold">{selected.trackingNumber}</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button className="btn-outline-gold flex items-center gap-2">
              <Icon name="MessageCircle" size={14} />
              Написать в поддержку
            </button>
            {selected.status === "delivered" && (
              <button onClick={() => onNavigate("reviews")} className="btn-gold flex items-center gap-2">
                <Icon name="Star" size={14} />
                Оставить отзыв
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => (
            <button
              key={order.id}
              onClick={() => setSelected(order)}
              className="surface-card w-full p-4 text-left hover:border-gold/30 transition-all animate-fade-in group"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-display text-lg">{order.id}</span>
                    <span className={`font-body text-[10px] tracking-widest uppercase border px-2 py-0.5 ${statusStyles[order.status]}`}>
                      {order.statusLabel}
                    </span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">{order.date} · {order.delivery}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    {order.items.map(i => i.name).join(", ")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-xl text-gold">{order.total.toLocaleString()} ₽</span>
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-gold transition-colors" />
                </div>
              </div>
            </button>
          ))}

          <button
            onClick={() => onNavigate("catalog")}
            className="w-full border border-dashed border-border hover:border-gold/40 p-6 flex items-center justify-center gap-2 text-muted-foreground hover:text-gold transition-all font-body text-xs tracking-widest uppercase"
          >
            <Icon name="Plus" size={14} />
            Заказать новую модель
          </button>
        </div>
      )}
    </div>
  );
}
