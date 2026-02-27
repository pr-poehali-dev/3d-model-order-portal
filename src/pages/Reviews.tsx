import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "catalog" | "cart" | "orders" | "profile" | "delivery" | "reviews" | "support" | "admin" | "auth";

interface Props {
  onNavigate: (page: Page) => void;
}

const reviews = [
  {
    id: 1,
    author: "Анна К.",
    city: "Москва",
    rating: 5,
    date: "20 февраля 2026",
    product: "Ювелирное кольцо",
    text: "Потрясающая детализация! Модель кольца получилась именно такой, как я хотела. Исполнитель очень внимательно отнёсся к требованиям, всё сдал раньше срока. Доставка СДЭК — 2 дня.",
    helpful: 12,
  },
  {
    id: 2,
    author: "Дмитрий Р.",
    city: "Санкт-Петербург",
    rating: 5,
    date: "14 февраля 2026",
    product: "Архитектурный фасад",
    text: "Заказывал для архитектурного бюро. Качество на высоте — формат STEP полностью соответствует нашим стандартам. Будем сотрудничать постоянно.",
    helpful: 8,
  },
  {
    id: 3,
    author: "Сергей П.",
    city: "Екатеринбург",
    rating: 4,
    date: "5 февраля 2026",
    product: "Промышленная деталь",
    text: "Хорошая работа, всё точно по чертежу. Небольшая задержка со сроком — 1 день. В остальном без замечаний, рекомендую.",
    helpful: 5,
  },
  {
    id: 4,
    author: "Мария В.",
    city: "Краснодар",
    rating: 5,
    date: "28 января 2026",
    product: "Интерьерная ваза",
    text: "Быстро, качественно и недорого. Доставила Почта России за 9 дней. Модель идеально подошла для печати. Обязательно вернусь!",
    helpful: 15,
  },
];

export default function Reviews({ onNavigate }: Props) {
  const [form, setForm] = useState({ name: "", product: "", rating: 5, text: "" });
  const [submitted, setSubmitted] = useState(false);
  const [helpfulIds, setHelpfulIds] = useState<number[]>([]);

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-2">Репутация</p>
        <h1 className="font-display text-4xl mb-4">Отзывы</h1>
        <div className="gold-line w-24" />
      </div>

      {/* Summary */}
      <div className="surface-card p-6 mb-8 flex flex-wrap gap-8 items-center">
        <div className="text-center">
          <div className="font-display text-6xl text-gold">{avgRating}</div>
          <div className="flex justify-center gap-0.5 my-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon key={i} name="Star" size={16} className={i < Math.floor(Number(avgRating)) ? "text-gold" : "text-muted-foreground/30"} />
            ))}
          </div>
          <div className="font-body text-xs text-muted-foreground">{reviews.length} отзыва</div>
        </div>

        <div className="flex-1 min-w-48 space-y-2">
          {[5, 4, 3, 2, 1].map(star => {
            const count = reviews.filter(r => r.rating === star).length;
            const pct = (count / reviews.length) * 100;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="font-body text-xs text-muted-foreground w-4">{star}</span>
                <Icon name="Star" size={10} className="text-gold" />
                <div className="flex-1 h-1.5 bg-muted">
                  <div className="h-full bg-gold transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="font-body text-xs text-muted-foreground w-4">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4 mb-10">
        {reviews.map((review, i) => (
          <div
            key={review.id}
            className="surface-card p-5 animate-fade-in"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-sm text-gold">{review.author.charAt(0)}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-body text-sm font-medium">{review.author}</span>
                    <span className="font-body text-xs text-muted-foreground">{review.city}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon key={i} name="Star" size={11} className={i < review.rating ? "text-gold" : "text-muted-foreground/30"} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-body text-xs text-muted-foreground">{review.date}</div>
                <div className="font-body text-xs text-gold mt-0.5">{review.product}</div>
              </div>
            </div>

            <p className="font-body text-sm text-foreground/80 leading-relaxed mb-3">{review.text}</p>

            <button
              onClick={() => setHelpfulIds(prev => prev.includes(review.id) ? prev.filter(i => i !== review.id) : [...prev, review.id])}
              className={`flex items-center gap-1.5 font-body text-xs transition-colors ${
                helpfulIds.includes(review.id) ? "text-gold" : "text-muted-foreground hover:text-gold"
              }`}
            >
              <Icon name="ThumbsUp" size={12} />
              Полезно ({review.helpful + (helpfulIds.includes(review.id) ? 1 : 0)})
            </button>
          </div>
        ))}
      </div>

      {/* Leave review */}
      <div className="surface-card p-6">
        <h2 className="font-display text-2xl mb-6">Оставить отзыв</h2>
        {submitted ? (
          <div className="flex items-center gap-3 text-gold animate-fade-in">
            <Icon name="CheckCircle" size={20} />
            <span className="font-body text-sm">Спасибо! Отзыв будет опубликован после проверки.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">Ваше имя</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Иван И."
                  className="w-full bg-muted border border-border px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">Название модели</label>
                <input
                  type="text"
                  value={form.product}
                  onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
                  placeholder="Ювелирное кольцо"
                  className="w-full bg-muted border border-border px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">Оценка</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, rating: star }))}
                    className="transition-transform hover:scale-110"
                  >
                    <Icon
                      name="Star"
                      size={24}
                      className={star <= form.rating ? "text-gold" : "text-muted-foreground/30"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">Ваш отзыв</label>
              <textarea
                value={form.text}
                onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                placeholder="Расскажите о вашем опыте..."
                rows={4}
                className="w-full bg-muted border border-border px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors resize-none"
              />
            </div>

            <button type="submit" className="btn-gold flex items-center gap-2">
              <Icon name="Send" size={14} />
              Отправить отзыв
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
