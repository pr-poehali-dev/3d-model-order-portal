import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "catalog" | "cart" | "orders" | "profile" | "delivery" | "reviews" | "support" | "admin" | "auth";

interface Props {
  onNavigate: (page: Page) => void;
  cartCount: number;
  setCartCount: (n: number | ((prev: number) => number)) => void;
}

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  format: string;
  qty: number;
  color: string;
}

const initialItems: CartItem[] = [
  { id: 1, name: "Архитектурный фасад", category: "Архитектура", price: 12500, format: "STL / OBJ", qty: 1, color: "#C4A35A" },
  { id: 3, name: "Ювелирное кольцо", category: "Ювелирные", price: 5400, format: "STL / 3DM", qty: 2, color: "#E8C97A" },
];

const deliveryOptions = [
  { id: "cdek", name: "СДЭК", price: 350, days: "2–5 дней", icon: "Truck" },
  { id: "post", name: "Почта России", price: 180, days: "7–14 дней", icon: "Mail" },
  { id: "5post", name: "5POST", price: 280, days: "3–7 дней", icon: "MapPin" },
  { id: "ozon", name: "OZON Rocket", price: 220, days: "1–3 дня", icon: "Zap" },
];

export default function Cart({ onNavigate, setCartCount }: Props) {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [selectedDelivery, setSelectedDelivery] = useState("cdek");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = deliveryOptions.find(d => d.id === selectedDelivery)!;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + delivery.price - discount;

  const updateQty = (id: number, delta: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setCartCount((c: number) => Math.max(0, c - 1));
  };

  const handlePromo = () => {
    if (promoCode.toUpperCase() === "FORM3D10") setPromoApplied(true);
  };

  const handleOrder = () => {
    setOrderPlaced(true);
    setCartCount(0);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-16 h-16 bg-gold/10 border border-gold flex items-center justify-center mx-auto mb-6">
          <Icon name="CheckCircle" size={32} className="text-gold" />
        </div>
        <h2 className="font-display text-3xl mb-3">Заказ оформлен!</h2>
        <p className="font-body text-sm text-muted-foreground mb-2">Номер заказа: <span className="text-gold font-medium">#ФМ-{Date.now().toString().slice(-6)}</span></p>
        <p className="font-body text-xs text-muted-foreground mb-8 tracking-wider">Мы свяжемся с вами в течение 30 минут для подтверждения</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => onNavigate("orders")} className="btn-gold">Мои заказы</button>
          <button onClick={() => onNavigate("catalog")} className="btn-outline-gold">Каталог</button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <Icon name="ShoppingCart" size={48} className="text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="font-display text-2xl mb-3 text-muted-foreground">Корзина пуста</h2>
        <button onClick={() => onNavigate("catalog")} className="btn-gold mt-4">Перейти в каталог</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-2">Корзина</p>
        <h1 className="font-display text-4xl">Ваш заказ</h1>
        <div className="gold-line w-24 mt-3" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="surface-card p-4 flex items-start gap-4 animate-fade-in">
              <div
                className="w-16 h-16 flex-shrink-0 flex items-center justify-center border"
                style={{ borderColor: item.color + "44", background: item.color + "11" }}
              >
                <span className="font-display text-lg" style={{ color: item.color + "CC" }}>3D</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg">{item.name}</h3>
                    <p className="font-body text-xs text-muted-foreground">{item.category} · {item.format}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                    <Icon name="Trash2" size={15} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 border border-border">
                    <button onClick={() => updateQty(item.id, -1)} className="px-2.5 py-1 text-muted-foreground hover:text-gold transition-colors">
                      <Icon name="Minus" size={12} />
                    </button>
                    <span className="font-body text-sm w-6 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="px-2.5 py-1 text-muted-foreground hover:text-gold transition-colors">
                      <Icon name="Plus" size={12} />
                    </button>
                  </div>
                  <span className="font-display text-xl text-gold">{(item.price * item.qty).toLocaleString()} ₽</span>
                </div>
              </div>
            </div>
          ))}

          {/* Delivery */}
          <div className="surface-card p-4">
            <h3 className="font-display text-xl mb-4">Способ доставки</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {deliveryOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedDelivery(opt.id)}
                  className={`flex items-start gap-3 p-3 border text-left transition-all ${
                    selectedDelivery === opt.id
                      ? "border-gold bg-gold/5"
                      : "border-border hover:border-gold/40"
                  }`}
                >
                  <Icon name={opt.icon as "Truck"} size={18} className={selectedDelivery === opt.id ? "text-gold" : "text-muted-foreground"} />
                  <div>
                    <div className={`font-body text-sm font-medium ${selectedDelivery === opt.id ? "text-gold" : "text-foreground"}`}>{opt.name}</div>
                    <div className="font-body text-xs text-muted-foreground">{opt.days}</div>
                    <div className="font-body text-xs text-foreground mt-0.5">{opt.price} ₽</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="surface-card p-4">
            <h3 className="font-display text-xl mb-4">Итого</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">Модели</span>
                <span>{subtotal.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">Доставка ({delivery.name})</span>
                <span>{delivery.price} ₽</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between font-body text-sm">
                  <span className="text-gold">Скидка 10%</span>
                  <span className="text-gold">−{discount.toLocaleString()} ₽</span>
                </div>
              )}
            </div>
            <div className="gold-line mb-4" />
            <div className="flex justify-between mb-6">
              <span className="font-body text-sm text-muted-foreground">Итого</span>
              <span className="font-display text-2xl text-gold">{total.toLocaleString()} ₽</span>
            </div>

            {/* Promo */}
            {!promoApplied && (
              <div className="flex gap-2 mb-4">
                <input
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  placeholder="Промокод"
                  className="flex-1 bg-muted border border-border px-3 py-2 font-body text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold"
                />
                <button onClick={handlePromo} className="btn-outline-gold px-3 py-2 text-xs">ОК</button>
              </div>
            )}
            {promoApplied && (
              <div className="flex items-center gap-2 mb-4 font-body text-xs text-gold">
                <Icon name="CheckCircle" size={13} /> Промокод применён
              </div>
            )}

            <button onClick={handleOrder} className="btn-gold w-full py-3 flex items-center justify-center gap-2">
              <Icon name="CreditCard" size={15} />
              Оформить заказ
            </button>
            <p className="font-body text-[10px] text-muted-foreground text-center mt-2 tracking-wider">
              Попробуй промокод FORM3D10 для скидки 10%
            </p>
          </div>

          <div className="surface-card p-4">
            <div className="flex items-start gap-3">
              <Icon name="Shield" size={18} className="text-gold flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-body text-xs font-medium mb-1">Гарантия качества</div>
                <div className="font-body text-xs text-muted-foreground leading-relaxed">Возврат средств в течение 14 дней, если результат не соответствует заданию</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
