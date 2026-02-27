import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { getOrders } from "@/lib/api";

type Page = "catalog" | "cart" | "orders" | "profile" | "delivery" | "reviews" | "support" | "admin" | "auth";

interface Props {
  onNavigate: (page: Page) => void;
  userId?: number;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  delivery_service: string;
  total: number;
  client_name: string;
  tracking_number: string | null;
  created_at: string;
  items: { name: string; qty: number; price: number }[];
}

const statusStyles: Record<string, string> = {
  delivered: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
  in_work: "text-gold border-gold/30 bg-gold/5",
  cancelled: "text-muted-foreground border-border bg-muted/30",
  pending: "text-blue-400 border-blue-400/30 bg-blue-400/5",
};

const statusLabels: Record<string, string> = {
  delivered: "Доставлен",
  in_work: "В работе",
  cancelled: "Отменён",
  pending: "Ожидает",
};

const statusSteps = [
  { key: "pending", label: "Создан" },
  { key: "confirmed", label: "Подтверждён" },
  { key: "in_work", label: "В работе" },
  { key: "shipping", label: "Отправлен" },
  { key: "delivered", label: "Доставлен" },
];

const getStepIndex = (status: string) => {
  const map: Record<string, number> = { pending: 0, confirmed: 1, in_work: 2, shipping: 3, delivered: 4 };
  return map[status] ?? 0;
};

export default function Orders({ onNavigate, userId }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    getOrders(userId)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [userId]);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" });
    } catch { return iso; }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-2">Reufer Studio</p>
        <h1 className="font-display text-4xl">Мои заказы</h1>
        <div className="gold-line w-24 mt-3" />
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="surface-card h-20 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && selected ? (
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
                <h2 className="font-display text-2xl mb-1">Заказ {selected.order_number}</h2>
                <p className="font-body text-xs text-muted-foreground">{formatDate(selected.created_at)} · {selected.delivery_service}</p>
              </div>
              <span className={`font-body text-xs tracking-widest uppercase border px-3 py-1 ${statusStyles[selected.status] || statusStyles.pending}`}>
                {statusLabels[selected.status] || selected.status}
              </span>
            </div>

            {selected.status !== "cancelled" && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  {statusSteps.map((step, i) => {
                    const current = getStepIndex(selected.status);
                    const done = i <= current;
                    return (
                      <div key={step.key} className="flex flex-col items-center gap-1 flex-1">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${done ? "border-gold bg-gold" : "border-border bg-background"}`}>
                          {done && <Icon name="Check" size={10} className="text-background" />}
                        </div>
                        <span className={`font-body text-[9px] tracking-wider text-center hidden sm:block ${done ? "text-gold" : "text-muted-foreground"}`}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="h-px bg-border relative">
                  <div className="h-px bg-gold transition-all" style={{ width: `${(getStepIndex(selected.status) / (statusSteps.length - 1)) * 100}%` }} />
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

            {selected.tracking_number && (
              <div className="mt-4 p-3 border border-gold/20 bg-gold/5 flex items-center gap-3">
                <Icon name="Truck" size={16} className="text-gold" />
                <div>
                  <div className="font-body text-xs text-muted-foreground">Трек-номер</div>
                  <div className="font-body text-sm font-medium text-gold">{selected.tracking_number}</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => onNavigate("support")} className="btn-outline-gold flex items-center gap-2">
              <Icon name="MessageCircle" size={14} />
              Поддержка
            </button>
            {selected.status === "delivered" && (
              <button onClick={() => onNavigate("reviews")} className="btn-gold flex items-center gap-2">
                <Icon name="Star" size={14} />
                Оставить отзыв
              </button>
            )}
          </div>
        </div>
      ) : !loading && (
        <div className="space-y-3">
          {orders.length === 0 && (
            <div className="text-center py-20">
              <Icon name="Package" size={40} className="text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-display text-xl text-muted-foreground">Заказов пока нет</p>
            </div>
          )}

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
                    <span className="font-display text-lg">{order.order_number}</span>
                    <span className={`font-body text-[10px] tracking-widest uppercase border px-2 py-0.5 ${statusStyles[order.status] || statusStyles.pending}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">{formatDate(order.created_at)} · {order.delivery_service}</p>
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
