/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { getOrders, updateOrder, getProducts, createProduct, updateProduct, getUsers, getReviews, updateReview } from "@/lib/api";

type Page = "catalog" | "cart" | "orders" | "profile" | "delivery" | "reviews" | "support" | "admin" | "auth";
type AdminTab = "dashboard" | "orders" | "catalog" | "users" | "reviews";

interface Props {
  onNavigate: (page: Page) => void;
}

const statusColors: Record<string, string> = {
  delivered: "text-emerald-400 border-emerald-400/30",
  in_work: "text-gold border-gold/30",
  pending: "text-blue-400 border-blue-400/30",
  cancelled: "text-muted-foreground border-border",
};
const statusLabels: Record<string, string> = {
  delivered: "Доставлен", in_work: "В работе", pending: "Ожидает", cancelled: "Отменён",
};

const CATEGORIES = ["Архитектура", "Промышленность", "Ювелирные", "Персонажи", "Интерьер", "Авто", "Другое"];

const emptyProduct = {
  name: "", category: "Архитектура", price: "", complexity: "Средняя",
  formats: "STL", delivery_time: "3–5 дней", color: "#C4A35A", description: "", in_stock: true,
};

export default function Admin({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
   
  const [orders, setOrders] = useState<any[]>([]);
   
  const [products, setProducts] = useState<any[]>([]);
   
  const [users, setUsers] = useState<any[]>([]);
   
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([getOrders(), getProducts(), getUsers(), getReviews("all")])
      .then(([o, p, u, r]) => { setOrders(o); setProducts(p); setUsers(u); setReviews(r); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleOrderStatus = async (id: number, status: string) => {
    await updateOrder(id, { status });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...productForm, price: Number(productForm.price) };
      if (editingProduct) {
        await updateProduct(editingProduct, data);
        setProducts(prev => prev.map(p => p.id === editingProduct ? { ...p, ...data } : p));
      } else {
        const result = await createProduct(data);
        setProducts(prev => [...prev, { id: result.id, ...data, rating: 5.0, reviews: 0 }]);
      }
      setShowProductForm(false);
      setProductForm(emptyProduct);
      setEditingProduct(null);
    } catch (e: any) {
      alert(e.message || "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStock = async (id: number, inStock: boolean) => {
    await updateProduct(id, { in_stock: !inStock });
    setProducts(prev => prev.map(p => p.id === id ? { ...p, in_stock: !inStock } : p));
  };

  const handleReview = async (id: number, status: string) => {
    await updateReview(id, status);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleEditProduct = (product: any) => {
    setProductForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      complexity: product.complexity || "Средняя",
      formats: product.format || "STL",
      delivery_time: product.time || "3–5 дней",
      color: product.color || "#C4A35A",
      description: product.description || "",
      in_stock: product.in_stock !== false,
    });
    setEditingProduct(product.id);
    setShowProductForm(true);
    setActiveTab("catalog");
  };

  const revenue = orders.filter(o => o.status === "delivered").reduce((s: number, o: any) => s + (o.total || 0), 0);

  const tabs = [
    { id: "dashboard", label: "Дашборд", icon: "LayoutDashboard" },
    { id: "orders", label: "Заказы", icon: "Package" },
    { id: "catalog", label: "Каталог", icon: "Grid3X3" },
    { id: "users", label: "Клиенты", icon: "Users" },
    { id: "reviews", label: "Отзывы", icon: "Star" },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-2">Reufer Studio</p>
          <h1 className="font-display text-4xl">Панель администратора</h1>
          <div className="gold-line w-32 mt-3" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 border border-gold/30 bg-gold/5">
          <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="font-body text-xs text-gold tracking-wider">В сети</span>
        </div>
      </div>

      <div className="flex gap-1 mb-8 border-b border-border overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 font-body text-xs tracking-widest uppercase whitespace-nowrap transition-all border-b-2 -mb-px ${
              activeTab === tab.id ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon name={tab.icon as "Package"} size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="surface-card h-24 animate-pulse" />)}</div>}

      {/* Dashboard */}
      {!loading && activeTab === "dashboard" && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Заказов", val: orders.length, icon: "Package" },
              { label: "Выручка", val: revenue.toLocaleString() + " ₽", icon: "TrendingUp" },
              { label: "Клиентов", val: users.length, icon: "Users" },
              { label: "Товаров", val: products.length, icon: "Grid3X3" },
            ].map((s, i) => (
              <div key={s.label} className="surface-card p-4 animate-fade-in" style={{ animationDelay: `${i * 0.07}s` }}>
                <Icon name={s.icon as "Package"} size={18} className="text-muted-foreground mb-3" />
                <div className="font-display text-2xl text-gold mb-1">{s.val}</div>
                <div className="font-body text-xs text-muted-foreground tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="surface-card p-4">
              <h3 className="font-display text-xl mb-4">Последние заказы</h3>
              <div className="space-y-2">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <div className="font-body text-sm">{order.order_number}</div>
                      <div className="font-body text-xs text-muted-foreground">{order.client_name}</div>
                    </div>
                    <div className="text-right">
                      <span className={`font-body text-[10px] tracking-wider border px-2 py-0.5 ${statusColors[order.status] || statusColors.pending}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                      <div className="font-body text-xs text-gold mt-1">{(order.total || 0).toLocaleString()} ₽</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="surface-card p-4">
                <h3 className="font-display text-xl mb-3">Быстрые действия</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { setActiveTab("catalog"); setShowProductForm(true); setEditingProduct(null); setProductForm(emptyProduct); }} className="flex items-center gap-2 p-3 border border-gold/30 bg-gold/5 hover:bg-gold/10 text-gold transition-all font-body text-xs">
                    <Icon name="Plus" size={13} />
                    Добавить модель
                  </button>
                  <button onClick={() => setActiveTab("orders")} className="flex items-center gap-2 p-3 border border-border hover:border-gold/40 hover:text-gold transition-all font-body text-xs text-muted-foreground">
                    <Icon name="Package" size={13} />
                    Управление заказами
                  </button>
                  <button onClick={() => setActiveTab("reviews")} className="flex items-center gap-2 p-3 border border-border hover:border-gold/40 hover:text-gold transition-all font-body text-xs text-muted-foreground">
                    <Icon name="Star" size={13} />
                    Отзывы на модерации
                  </button>
                  <button onClick={() => setActiveTab("users")} className="flex items-center gap-2 p-3 border border-border hover:border-gold/40 hover:text-gold transition-all font-body text-xs text-muted-foreground">
                    <Icon name="Users" size={13} />
                    Клиенты
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders */}
      {!loading && activeTab === "orders" && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl">Все заказы ({orders.length})</h2>
          </div>
          <div className="surface-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Номер", "Клиент", "Доставка", "Сумма", "Дата", "Статус"].map(h => (
                      <th key={h} className="font-body text-[10px] tracking-widest uppercase text-muted-foreground text-left px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-body text-sm text-gold">{order.order_number}</td>
                      <td className="px-4 py-3 font-body text-sm">{order.client_name}</td>
                      <td className="px-4 py-3 font-body text-xs text-muted-foreground">{order.delivery_service}</td>
                      <td className="px-4 py-3 font-body text-sm">{(order.total || 0).toLocaleString()} ₽</td>
                      <td className="px-4 py-3 font-body text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("ru")}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={e => handleOrderStatus(order.id, e.target.value)}
                          className={`bg-transparent border text-xs font-body px-2 py-1 focus:outline-none cursor-pointer ${statusColors[order.status] || statusColors.pending}`}
                        >
                          <option value="pending" className="bg-background text-foreground">Ожидает</option>
                          <option value="in_work" className="bg-background text-foreground">В работе</option>
                          <option value="delivered" className="bg-background text-foreground">Доставлен</option>
                          <option value="cancelled" className="bg-background text-foreground">Отменён</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {orders.length === 0 && (
              <div className="text-center py-12 text-muted-foreground font-body text-sm">Заказов пока нет</div>
            )}
          </div>
        </div>
      )}

      {/* Catalog */}
      {!loading && activeTab === "catalog" && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl">Каталог ({products.length} товаров)</h2>
            <button
              onClick={() => { setShowProductForm(true); setEditingProduct(null); setProductForm(emptyProduct); }}
              className="btn-gold flex items-center gap-2"
            >
              <Icon name="Plus" size={14} />
              Добавить модель
            </button>
          </div>

          {/* Product Form */}
          {showProductForm && (
            <div className="surface-card p-6 mb-6 border-gold/30 animate-fade-in">
              <h3 className="font-display text-xl mb-5">
                {editingProduct ? "Редактировать модель" : "Новая 3D-модель"}
              </h3>
              <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">Название *</label>
                  <input
                    required
                    type="text"
                    value={productForm.name}
                    onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ювелирное кольцо"
                    className="w-full bg-muted border border-border px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">Категория *</label>
                  <select
                    value={productForm.category}
                    onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-muted border border-border px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:border-gold transition-colors"
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">Цена (₽) *</label>
                  <input
                    required
                    type="number"
                    value={productForm.price}
                    onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="5000"
                    className="w-full bg-muted border border-border px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">Сложность</label>
                  <select
                    value={productForm.complexity}
                    onChange={e => setProductForm(f => ({ ...f, complexity: e.target.value }))}
                    className="w-full bg-muted border border-border px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:border-gold transition-colors"
                  >
                    {["Низкая", "Средняя", "Высокая", "Очень высокая"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">Форматы файлов</label>
                  <input
                    type="text"
                    value={productForm.formats}
                    onChange={e => setProductForm(f => ({ ...f, formats: e.target.value }))}
                    placeholder="STL / OBJ / FBX"
                    className="w-full bg-muted border border-border px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">Срок выполнения</label>
                  <input
                    type="text"
                    value={productForm.delivery_time}
                    onChange={e => setProductForm(f => ({ ...f, delivery_time: e.target.value }))}
                    placeholder="3–5 дней"
                    className="w-full bg-muted border border-border px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">Цвет превью</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={productForm.color}
                      onChange={e => setProductForm(f => ({ ...f, color: e.target.value }))}
                      className="w-10 h-10 border border-border bg-muted cursor-pointer"
                    />
                    <span className="font-body text-xs text-muted-foreground">{productForm.color}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">В наличии</label>
                  <button
                    type="button"
                    onClick={() => setProductForm(f => ({ ...f, in_stock: !f.in_stock }))}
                    className={`w-10 h-5 relative transition-colors ${productForm.in_stock ? "bg-gold" : "bg-muted"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-background transition-transform ${productForm.in_stock ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                  <span className={`font-body text-xs ${productForm.in_stock ? "text-gold" : "text-muted-foreground"}`}>
                    {productForm.in_stock ? "Да" : "Нет"}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">Описание</label>
                  <textarea
                    value={productForm.description}
                    onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Описание модели..."
                    rows={3}
                    className="w-full bg-muted border border-border px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors resize-none"
                  />
                </div>

                <div className="sm:col-span-2 flex gap-3">
                  <button type="submit" disabled={saving} className="btn-gold flex items-center gap-2">
                    {saving && <Icon name="Loader2" size={14} className="animate-spin" />}
                    <Icon name="Save" size={14} />
                    {editingProduct ? "Сохранить изменения" : "Добавить модель"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowProductForm(false); setEditingProduct(null); setProductForm(emptyProduct); }}
                    className="btn-outline-gold"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products table */}
          <div className="surface-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Превью", "Название", "Категория", "Цена", "Сложность", "Статус", "Действия"].map(h => (
                      <th key={h} className="font-body text-[10px] tracking-widest uppercase text-muted-foreground text-left px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div
                          className="w-8 h-8 border flex items-center justify-center"
                          style={{ borderColor: product.color + "44", background: product.color + "11" }}
                        >
                          <span className="font-display text-[10px]" style={{ color: product.color + "CC" }}>3D</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-body text-sm">{product.name}</td>
                      <td className="px-4 py-3 font-body text-xs text-muted-foreground">{product.category}</td>
                      <td className="px-4 py-3 font-body text-sm text-gold">{(product.price || 0).toLocaleString()} ₽</td>
                      <td className="px-4 py-3 font-body text-xs text-muted-foreground">{product.complexity}</td>
                      <td className="px-4 py-3">
                        <span className={`font-body text-[10px] tracking-widest uppercase border px-2 py-0.5 ${
                          product.in_stock !== false ? "text-emerald-400 border-emerald-400/30" : "text-muted-foreground border-border"
                        }`}>
                          {product.in_stock !== false ? "В наличии" : "Снят"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleEditProduct(product)} className="p-1 text-muted-foreground hover:text-gold transition-colors">
                            <Icon name="Pencil" size={14} />
                          </button>
                          <button onClick={() => handleToggleStock(product.id, product.in_stock !== false)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                            <Icon name={product.in_stock !== false ? "EyeOff" : "Eye"} size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Users */}
      {!loading && activeTab === "users" && (
        <div className="animate-fade-in">
          <h2 className="font-display text-2xl mb-6">Клиенты ({users.length})</h2>
          <div className="surface-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Клиент", "Email", "Роль", "Город", "Регистрация"].map(h => (
                      <th key={h} className="font-body text-[10px] tracking-widest uppercase text-muted-foreground text-left px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-gold/10 border border-gold/20 flex items-center justify-center">
                            <span className="font-display text-xs text-gold">{(user.name || "А").charAt(0)}</span>
                          </div>
                          <span className="font-body text-sm">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-body text-xs text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`font-body text-[10px] tracking-widest uppercase border px-2 py-0.5 ${
                          user.role === "admin" ? "border-gold/30 text-gold" : "border-border text-muted-foreground"
                        }`}>
                          {user.role === "admin" ? "Админ" : "Клиент"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-body text-xs text-muted-foreground">{user.city || "—"}</td>
                      <td className="px-4 py-3 font-body text-xs text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString("ru")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      {!loading && activeTab === "reviews" && (
        <div className="animate-fade-in">
          <h2 className="font-display text-2xl mb-6">Модерация отзывов</h2>
          <div className="space-y-3">
            {reviews.filter((r: any) => r.status === "pending").length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <Icon name="CheckCircle" size={32} className="mx-auto mb-2 opacity-30" />
                <p className="font-body text-sm">Нет отзывов на модерации</p>
              </div>
            )}
            {reviews.filter((r: any) => r.status === "pending").map((r: any, i: number) => (
              <div key={r.id} className="surface-card p-4 flex items-start justify-between gap-4 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-body text-sm font-medium">{r.author}</span>
                    {r.city && <span className="font-body text-xs text-muted-foreground">{r.city}</span>}
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Icon key={si} name="Star" size={11} className={si < r.rating ? "text-gold" : "text-muted-foreground/30"} />
                      ))}
                    </div>
                  </div>
                  {r.product && <div className="font-body text-xs text-gold mb-1">{r.product}</div>}
                  <p className="font-body text-sm text-muted-foreground">{r.text}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleReview(r.id, "approved")} className="flex items-center gap-1 px-3 py-1.5 border border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10 font-body text-xs transition-all">
                    <Icon name="Check" size={12} />
                    Одобрить
                  </button>
                  <button onClick={() => handleReview(r.id, "rejected")} className="flex items-center gap-1 px-3 py-1.5 border border-destructive/30 text-destructive hover:bg-destructive/10 font-body text-xs transition-all">
                    <Icon name="X" size={12} />
                    Отклонить
                  </button>
                </div>
              </div>
            ))}

            {/* All reviews */}
            {reviews.filter((r: any) => r.status !== "pending").length > 0 && (
              <>
                <h3 className="font-display text-lg mt-6 mb-3 text-muted-foreground">Обработанные</h3>
                {reviews.filter((r: any) => r.status !== "pending").map((r: any) => (
                  <div key={r.id} className="surface-card p-3 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-body text-sm">{r.author}</span>
                      <span className="font-body text-xs text-muted-foreground ml-2">{r.product}</span>
                    </div>
                    <span className={`font-body text-[10px] tracking-widest uppercase border px-2 py-0.5 ${
                      r.status === "approved" ? "text-emerald-400 border-emerald-400/30" : "text-muted-foreground border-border"
                    }`}>
                      {r.status === "approved" ? "Одобрен" : "Отклонён"}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}