import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import ModelViewer from "@/components/ModelViewer";
import { getProducts } from "@/lib/api";

type Page = "catalog" | "cart" | "orders" | "profile" | "delivery" | "reviews" | "support" | "admin" | "auth";

interface Props {
  onNavigate: (page: Page) => void;
  onAddToCart: (item: CartItem) => void;
}

export interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  format: string;
  qty: number;
  color: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  complexity: string;
  format: string;
  time: string;
  color: string;
  in_stock: boolean;
  rating: number;
  reviews: number;
}

const ALL_CATEGORIES = "Все";

export default function Catalog({ onNavigate, onAddToCart }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [addedIds, setAddedIds] = useState<number[]>([]);

  const categories = [ALL_CATEGORIES, ...Array.from(new Set(products.map(p => p.category)))];

  useEffect(() => {
    setLoading(true);
    getProducts(activeCategory)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const handleAddToCart = (product: Product) => {
    setAddedIds(prev => [...prev, product.id]);
    onAddToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      format: product.format,
      qty: 1,
      color: product.color,
    });
    setTimeout(() => setAddedIds(prev => prev.filter(i => i !== product.id)), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="mb-12 animate-fade-in">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-3">Reufer Studio</p>
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
      <div className="grid grid-cols-3 gap-px border border-border mb-10 animate-fade-in">
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

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="surface-card h-80 animate-pulse" />
          ))}
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, i) => (
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
                    style={{ transformStyle: "preserve-3d", animation: "rotateCube 8s linear infinite" }}
                  >
                    {[
                      { transform: "translateZ(56px)" },
                      { transform: "rotateY(180deg) translateZ(56px)" },
                      { transform: "rotateY(90deg) translateZ(56px)" },
                      { transform: "rotateY(-90deg) translateZ(56px)" },
                      { transform: "rotateX(90deg) translateZ(56px)" },
                      { transform: "rotateX(-90deg) translateZ(56px)" },
                    ].map((face, fi) => (
                      <div
                        key={fi}
                        className="absolute inset-0 border"
                        style={{
                          transform: face.transform,
                          backgroundColor: product.color + "22",
                          borderColor: product.color + "66",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => { setSelectedProduct(product); setViewerOpen(true); }}
                    className="btn-gold text-xs flex items-center gap-2"
                  >
                    <Icon name="Eye" size={13} />
                    3D-просмотр
                  </button>
                </div>
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
                      <Icon key={i} name="Star" size={11} className={i < Math.floor(product.rating) ? "text-gold" : "text-muted-foreground/30"} />
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
                  <div className="font-display text-xl text-gold">{product.price.toLocaleString()} ₽</div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`flex items-center gap-1.5 transition-all ${addedIds.includes(product.id) ? "btn-outline-gold" : "btn-gold"}`}
                  >
                    <Icon name={addedIds.includes(product.id) ? "Check" : "ShoppingCart"} size={13} />
                    {addedIds.includes(product.id) ? "Добавлено" : "В корзину"}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="col-span-3 text-center py-20 text-muted-foreground">
              <Icon name="Package" size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-display text-xl">Товары не найдены</p>
            </div>
          )}
        </div>
      )}

      {viewerOpen && selectedProduct && (
        <ModelViewer
          product={selectedProduct}
          onClose={() => setViewerOpen(false)}
          onAddToCart={() => { handleAddToCart(selectedProduct); }}
        />
      )}
    </div>
  );
}
