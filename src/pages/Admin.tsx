import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "catalog" | "cart" | "orders" | "profile" | "delivery" | "reviews" | "support" | "admin" | "auth";

interface Props {
  onNavigate: (page: Page) => void;
}

type AdminTab = "dashboard" | "orders" | "catalog" | "users" | "reviews";

const stats = [
  { label: "Заказов за месяц", val: "148", change: "+12%", icon: "Package", up: true },
  { label: "Выручка", val: "1 842 500 ₽", change: "+8%", icon: "TrendingUp", up: true },
  { label: "Клиентов", val: "324", change: "+23%", icon: "Users", up: true },
  { label: "Средний чек", val: "12 450 ₽", change: "-2%", icon: "BarChart3", up: false },
];

const adminOrders = [
  { id: "ФМ-240815", client: "Анна К.", product: "Ювелирное кольцо", status: "delivered", total: 10980, date: "15.02.26", delivery: "СДЭК" },
  { id: "ФМ-240802", client: "Дмитрий Р.", product: "Архитектурный фасад", status: "in_work", total: 12850, date: "02.02.26", delivery: "Почта" },
  { id: "ФМ-240801", client: "Мария В.", product: "Интерьерная ваза", status: "pending", total: 3480, date: "01.02.26", delivery: "5POST" },
  { id: "ФМ-240730", client: "Сергей П.", product: "Промышленная деталь", status: "cancelled", total: 9180, date: "30.01.26", delivery: "ОZON" },
];

const adminUsers = [
  { id: 1, name: "Анна К.", email: "anna@example.ru", role: "client", orders: 5, spent: "54 900 ₽", joined: "01.01.26" },
  { id: 2, name: "Дмитрий Р.", email: "dmitry@example.ru", role: "client", orders: 2, spent: "25 700 ₽", joined: "15.01.26" },
  { id: 3, name: "Мария В.", email: "maria@example.ru", role: "client", orders: 8, spent: "97 200 ₽", joined: "05.12.25" },
  { id: 4, name: "Администратор", email: "admin@form3d.ru", role: "admin", orders: 0, spent: "—", joined: "01.11.25" },
];

const statusColors: Record<string, string> = {
  delivered: "text-emerald-400 border-emerald-400/30",
  in_work: "text-gold border-gold/30",
  pending: "text-blue-400 border-blue-400/30",
  cancelled: "text-muted-foreground border-border",
};

const statusLabels: Record<string, string> = {
  delivered: "Доставлен",
  in_work: "В работе",
  pending: "Ожидает",
  cancelled: "Отменён",
};

export default function Admin({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [orders, setOrders] = useState(adminOrders);

  const changeStatus = (id: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

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
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-2">Управление</p>
          <h1 className="font-display text-4xl">Панель администратора</h1>
          <div className="gold-line w-32 mt-3" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 border border-gold/30 bg-gold/5">
          <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="font-body text-xs text-gold tracking-wider">В сети</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-border overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 font-body text-xs tracking-widest uppercase whitespace-nowrap transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-gold text-gold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon name={tab.icon as "Package"} size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === "dashboard" && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <div key={s.label} className="surface-card p-4 animate-fade-in" style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="flex items-start justify-between mb-3">
                  <Icon name={s.icon as "Package"} size={18} className="text-muted-foreground" />
                  <span className={`font-body text-xs ${s.up ? "text-emerald-400" : "text-destructive"}`}>{s.change}</span>
                </div>
                <div className="font-display text-2xl text-gold mb-1">{s.val}</div>
                <div className="font-body text-xs text-muted-foreground tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent orders */}
            <div className="surface-card p-4">
              <h3 className="font-display text-xl mb-4">Последние заказы</h3>
              <div className="space-y-2">
                {orders.slice(0, 4).map(order => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <div className="font-body text-sm">{order.id}</div>
                      <div className="font-body text-xs text-muted-foreground">{order.client}</div>
                    </div>
                    <div className="text-right">
                      <span className={`font-body text-[10px] tracking-wider border px-2 py-0.5 ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                      <div className="font-body text-xs text-gold mt-1">{order.total.toLocaleString()} ₽</div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setActiveTab("orders")} className="btn-outline-gold mt-3 w-full text-center text-xs">
                Все заказы
              </button>
            </div>

            {/* Quick stats */}
            <div className="space-y-4">
              <div className="surface-card p-4">
                <h3 className="font-display text-xl mb-4">Доставка</h3>
                {[
                  { name: "СДЭК", count: 62, pct: 42 },
                  { name: "Почта России", count: 38, pct: 26 },
                  { name: "OZON Rocket", count: 28, pct: 19 },
                  { name: "5POST", count: 20, pct: 13 },
                ].map(d => (
                  <div key={d.name} className="mb-2">
                    <div className="flex justify-between font-body text-xs mb-1">
                      <span className="text-muted-foreground">{d.name}</span>
                      <span>{d.count} заказов</span>
                    </div>
                    <div className="h-1 bg-muted">
                      <div className="h-full bg-gold" style={{ width: `${d.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="surface-card p-4">
                <h3 className="font-display text-xl mb-3">Быстрые действия</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Добавить модель", icon: "Plus" },
                    { label: "Новый клиент", icon: "UserPlus" },
                    { label: "Экспорт", icon: "Download" },
                    { label: "Настройки", icon: "Settings" },
                  ].map(a => (
                    <button key={a.label} className="flex items-center gap-2 p-2 border border-border hover:border-gold/40 hover:text-gold transition-all font-body text-xs text-muted-foreground">
                      <Icon name={a.icon as "Plus"} size={13} />
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders management */}
      {activeTab === "orders" && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl">Все заказы</h2>
            <button className="btn-outline-gold flex items-center gap-2">
              <Icon name="Download" size={13} />
              Экспорт CSV
            </button>
          </div>
          <div className="surface-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Номер", "Клиент", "Модель", "Доставка", "Сумма", "Статус", "Действия"].map(h => (
                      <th key={h} className="font-body text-[10px] tracking-widest uppercase text-muted-foreground text-left px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-body text-sm text-gold">{order.id}</td>
                      <td className="px-4 py-3 font-body text-sm">{order.client}</td>
                      <td className="px-4 py-3 font-body text-xs text-muted-foreground">{order.product}</td>
                      <td className="px-4 py-3 font-body text-xs text-muted-foreground">{order.delivery}</td>
                      <td className="px-4 py-3 font-body text-sm">{order.total.toLocaleString()} ₽</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={e => changeStatus(order.id, e.target.value)}
                          className={`bg-transparent border text-xs font-body px-2 py-1 focus:outline-none cursor-pointer ${statusColors[order.status]}`}
                        >
                          <option value="pending" className="bg-background text-foreground">Ожидает</option>
                          <option value="in_work" className="bg-background text-foreground">В работе</option>
                          <option value="delivered" className="bg-background text-foreground">Доставлен</option>
                          <option value="cancelled" className="bg-background text-foreground">Отменён</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button className="p-1 text-muted-foreground hover:text-gold transition-colors">
                            <Icon name="Eye" size={14} />
                          </button>
                          <button className="p-1 text-muted-foreground hover:text-gold transition-colors">
                            <Icon name="MessageCircle" size={14} />
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

      {/* Catalog management */}
      {activeTab === "catalog" && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl">Управление каталогом</h2>
            <button className="btn-gold flex items-center gap-2">
              <Icon name="Plus" size={14} />
              Добавить модель
            </button>
          </div>
          <div className="surface-card p-6 text-center">
            <Icon name="Grid3X3" size={40} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-display text-xl text-muted-foreground mb-1">Управление моделями</p>
            <p className="font-body text-xs text-muted-foreground mb-4">Здесь будет редактор каталога 3D-моделей</p>
            <button className="btn-gold">Добавить первую модель</button>
          </div>
        </div>
      )}

      {/* Users management */}
      {activeTab === "users" && (
        <div className="animate-fade-in">
          <h2 className="font-display text-2xl mb-6">Клиенты</h2>
          <div className="surface-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Клиент", "Email", "Роль", "Заказов", "Сумма", "Регистрация"].map(h => (
                      <th key={h} className="font-body text-[10px] tracking-widest uppercase text-muted-foreground text-left px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map(user => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-gold/10 border border-gold/20 flex items-center justify-center">
                            <span className="font-display text-xs text-gold">{user.name.charAt(0)}</span>
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
                      <td className="px-4 py-3 font-body text-sm">{user.orders}</td>
                      <td className="px-4 py-3 font-body text-sm text-gold">{user.spent}</td>
                      <td className="px-4 py-3 font-body text-xs text-muted-foreground">{user.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reviews management */}
      {activeTab === "reviews" && (
        <div className="animate-fade-in">
          <h2 className="font-display text-2xl mb-6">Модерация отзывов</h2>
          <div className="space-y-3">
            {[
              { author: "Павел К.", text: "Отличная работа, всё сделано вовремя.", rating: 5, status: "pending" },
              { author: "Ольга М.", text: "Хороший результат, но немного задержались.", rating: 4, status: "pending" },
            ].map((r, i) => (
              <div key={i} className="surface-card p-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-body text-sm font-medium">{r.author}</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Icon key={si} name="Star" size={11} className={si < r.rating ? "text-gold" : "text-muted-foreground/30"} />
                      ))}
                    </div>
                  </div>
                  <p className="font-body text-sm text-muted-foreground">{r.text}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="flex items-center gap-1 px-3 py-1.5 border border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10 font-body text-xs transition-all">
                    <Icon name="Check" size={12} />
                    Одобрить
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 border border-destructive/30 text-destructive hover:bg-destructive/10 font-body text-xs transition-all">
                    <Icon name="X" size={12} />
                    Отклонить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
