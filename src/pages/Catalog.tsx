import { useState } from "react";
import Icon from "@/components/ui/icon";
import ModelViewer from "@/components/ModelViewer";

type Page = "catalog" | "cart" | "orders" | "profile" | "delivery" | "reviews" | "support" | "admin" | "auth";

interface Props {
  onNavigate: (page: Page) => void;
  onAddToCart: () => void;
}

const categories = ["Все", "Архитектура", "Промышленность", "Ювелирные", "Персонажи", "Интерьер", "Авто"];

const products = [
  { id: 1, name: "Архитектурный фасад", category: "Архитектура", price: 12500, complexity: "Высокая", format: "STL / OBJ / FBX", time: "5–7 дней", rating: 4.9, reviews: 24, color: "#C4A35A" },
  { id: 2, name: "Промышленная деталь", category: "Промышленность", price: 8900, complexity: "Средняя", format: "STEP / STL", time: "3–5 дней", rating: 4.7, reviews: 18, color: "#7A8B99" },
  { id: 3, name: "Ювелирное кольцо", category: "Ювелирные", price: 5400, complexity: "Высокая", format: "STL / 3DM", time: "2–4 дня", rating: 5.0, reviews: 31, color: "#E8C97A" },
  { id: 4, name: "Игровой персонаж", category: "Персонажи", price: 18700, complexity: "Очень высокая", format: "FBX / OBJ", time: "7–14 дней", rating: 4.8, reviews: 12, color: "#8B5CF6" },
  { id: 5, name: "Интерьерная ваза", category: "Интерьер", price: 3200, complexity: "Низкая", format: "STL / OBJ", time: "1–2 дня", rating: 4.6, reviews: 47, color: "#5C8A7A" },
  { id: 6, name: "Кузов автомобиля", category: "Авто", price: 24000, complexity: "Очень высокая", format: "STEP / IGES / STL", time: "10–14 дней", rating: 4.9, reviews: 8, color: "#C0392B" },
];

export default function Catalog({ onNavigate, onAddToCart }: Props) {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [addedIds, setAddedIds] = useState<number[]>([]);

  const filtered = activeCategory === "Все"
    ? products
    : products.filter(p => p.category === activeCategory);

  const handleAddToCart = (id: number) => {
    setAddedIds(prev => [...prev, id]);
    onAddToCart();
    setTimeout(() => setAddedIds(prev => prev.filter(i => i !== id)), 2000);
  };

  const handleView3D = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setViewerOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="mb-12 animate-fade-in">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-3">Профессиональный маркетплейс</p>
        <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-4 leading-tight">
          3D-модели<br />
          <span className="text-gold italic">любой сложности</span>
        </h1>
        <div className="gold-line w-32 mb-4" />
        <p className="font-body text-sm text-muted-foreground max-w-lg leading-relaxed">
          Заказывайте профессиональные 3D-модели от лучших мастеров. Гарантия качества, быстрые сроки, удобная доставка по всей России.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-px border border-border mb-10 animate-fade-in">
        {[
          { val: "500+", label: "Моделей" },
          { val: "98%", label: "Довольных клиентов" },
          { val: "24ч", label: "Поддержка" },
        ].map(s => (
          <div key={s.label} className="bg-card px-4 py-5 text-center">
            <div className="font-display text-2xl text-gold">{s.val}</div>
            <div className="font-body text-xs text-muted-foreground mt-1 tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`font-body text-xs tracking-widest uppercase px-4 py-2 border transition-all ${
              activeCategory === cat
                ? "border-gold text-gold bg-gold/5"
                : "border-border text-muted-foreground hover:border-gold/50 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product, i) => (
          <div
            key={product.id}
            className="surface-card group hover:border-gold/30 transition-all duration-300 animate-fade-in flex flex-col"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {/* 3D Preview Area */}
            <div className="model-viewer-container h-48 flex items-center justify-center relative overflow-hidden">
              <div className="w-28 h-28" style={{ perspective: "400px" }}>
                <div
                  className="w-full h-full relative"
                  style={{
                    transformStyle: "preserve-3d",
                    animation: "rotateCube 8s linear infinite",
                  }}
                >
                  {[
                    { transform: "translateZ(56px)", bg: product.color },
                    { transform: "rotateY(180deg) translateZ(56px)", bg: product.color + "CC" },
                    { transform: "rotateY(90deg) translateZ(56px)", bg: product.color + "99" },
                    { transform: "rotateY(-90deg) translateZ(56px)", bg: product.color + "AA" },
                    { transform: "rotateX(90deg) translateZ(56px)", bg: product.color + "BB" },
                    { transform: "rotateX(-90deg) translateZ(56px)", bg: product.color + "88" },
                  ].map((face, fi) => (
                    <div
                      key={fi}
                      className="absolute inset-0 border"
                      style={{
                        transform: face.transform,
                        backgroundColor: face.bg + "22",
                        borderColor: face.bg + "66",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleView3D(product)}
                  className="btn-gold text-xs flex items-center gap-2"
                >
                  <Icon name="Eye" size={13} />
                  3D-просмотр
                </button>
              </div>

              {/* Category badge */}
              <div className="absolute top-3 left-3">
                <span className="font-body text-[10px] tracking-widest uppercase bg-background/80 text-muted-foreground border border-border px-2 py-1">
                  {product.category}
                </span>
              </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-display text-xl text-foreground mb-1">{product.name}</h3>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon
                      key={i}
                      name="Star"
                      size={11}
                      className={i < Math.floor(product.rating) ? "text-gold" : "text-muted-foreground/30"}
                    />
                  ))}
                </div>
                <span className="font-body text-xs text-muted-foreground">{product.rating} ({product.reviews})</span>
              </div>

              <div className="space-y-1.5 mb-4 flex-1">
                {[
                  { label: "Формат", val: product.format },
                  { label: "Сложность", val: product.complexity },
                  { label: "Срок", val: product.time },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="font-body text-xs text-muted-foreground tracking-wider">{row.label}</span>
                    <span className="font-body text-xs text-foreground">{row.val}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 flex items-center justify-between">
                <div>
                  <div className="font-display text-xl text-gold">{product.price.toLocaleString()} ₽</div>
                </div>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className={`flex items-center gap-1.5 transition-all ${
                    addedIds.includes(product.id) ? "btn-outline-gold" : "btn-gold"
                  }`}
                >
                  <Icon name={addedIds.includes(product.id) ? "Check" : "ShoppingCart"} size={13} />
                  {addedIds.includes(product.id) ? "Добавлено" : "В корзину"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3D Viewer Modal */}
      {viewerOpen && selectedProduct && (
        <ModelViewer
          product={selectedProduct}
          onClose={() => setViewerOpen(false)}
          onAddToCart={() => { handleAddToCart(selectedProduct.id); }}
        />
      )}
    </div>
  );
}
