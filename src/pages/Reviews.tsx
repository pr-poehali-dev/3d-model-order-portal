import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { getReviews, createReview } from "@/lib/api";

type Page = "catalog" | "cart" | "orders" | "profile" | "delivery" | "reviews" | "support" | "admin" | "auth";

interface Props {
  onNavigate: (page: Page) => void;
  userId?: number;
}

interface Review {
  id: number;
  author: string;
  city: string;
  rating: number;
  text: string;
  product: string;
  helpful: number;
  date: string;
}

export default function Reviews({ onNavigate, userId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", product: "", rating: 5, text: "", city: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [helpfulIds, setHelpfulIds] = useState<number[]>([]);

  useEffect(() => {
    getReviews("approved")
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await createReview({ ...form, user_id: userId });
      setSubmitted(true);
    } catch {
      alert("Ошибка отправки отзыва");
    } finally {
      setSending(false);
    }
  };

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" }); }
    catch { return iso; }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-2">Reufer Studio</p>
        <h1 className="font-display text-4xl mb-4">Отзывы</h1>
        <div className="gold-line w-24" />
      </div>

      {/* Summary */}
      {!loading && reviews.length > 0 && (
        <div className="surface-card p-6 mb-8 flex flex-wrap gap-8 items-center">
          <div className="text-center">
            <div className="font-display text-6xl text-gold">{avgRating}</div>
            <div className="flex justify-center gap-0.5 my-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="Star" size={16} className={i < Math.floor(Number(avgRating)) ? "text-gold" : "text-muted-foreground/30"} />
              ))}
            </div>
            <div className="font-body text-xs text-muted-foreground">{reviews.length} {reviews.length === 1 ? "отзыв" : "отзывов"}</div>
          </div>
          <div className="flex-1 min-w-48 space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
              const count = reviews.filter(r => r.rating === star).length;
              const pct = reviews.length ? (count / reviews.length) * 100 : 0;
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
      )}

      {loading && <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="surface-card h-28 animate-pulse" />)}</div>}

      {/* Reviews list */}
      {!loading && (
        <div className="space-y-4 mb-10">
          {reviews.map((review, i) => (
            <div key={review.id} className="surface-card p-5 animate-fade-in" style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-sm text-gold">{(review.author || "А").charAt(0)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-body text-sm font-medium">{review.author}</span>
                      {review.city && <span className="font-body text-xs text-muted-foreground">{review.city}</span>}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icon key={i} name="Star" size={11} className={i < review.rating ? "text-gold" : "text-muted-foreground/30"} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-body text-xs text-muted-foreground">{formatDate(review.date)}</div>
                  {review.product && <div className="font-body text-xs text-gold mt-0.5">{review.product}</div>}
                </div>
              </div>
              <p className="font-body text-sm text-foreground/80 leading-relaxed mb-3">{review.text}</p>
              <button
                onClick={() => setHelpfulIds(prev => prev.includes(review.id) ? prev.filter(i => i !== review.id) : [...prev, review.id])}
                className={`flex items-center gap-1.5 font-body text-xs transition-colors ${helpfulIds.includes(review.id) ? "text-gold" : "text-muted-foreground hover:text-gold"}`}
              >
                <Icon name="ThumbsUp" size={12} />
                Полезно ({(review.helpful || 0) + (helpfulIds.includes(review.id) ? 1 : 0)})
              </button>
            </div>
          ))}
        </div>
      )}

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
              {[
                { key: "name", label: "Ваше имя", placeholder: "Иван И." },
                { key: "city", label: "Город", placeholder: "Москва" },
                { key: "product", label: "Название модели", placeholder: "Ювелирное кольцо" },
              ].map(f => (
                <div key={f.key} className={f.key === "product" ? "sm:col-span-2" : ""}>
                  <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">{f.label}</label>
                  <input
                    type="text"
                    value={form[f.key as keyof typeof form] as string}
                    onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full bg-muted border border-border px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">Оценка</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button" onClick={() => setForm(f => ({ ...f, rating: star }))}>
                    <Icon name="Star" size={24} className={star <= form.rating ? "text-gold" : "text-muted-foreground/30"} />
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
            <button type="submit" disabled={sending} className="btn-gold flex items-center gap-2">
              {sending && <Icon name="Loader2" size={14} className="animate-spin" />}
              <Icon name="Send" size={14} />
              Отправить отзыв
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
