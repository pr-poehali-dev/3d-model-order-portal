import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "catalog" | "cart" | "orders" | "profile" | "delivery" | "reviews" | "support" | "admin" | "auth";

interface User {
  name: string;
  email: string;
  role: "client" | "admin";
}

interface Props {
  user: User | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const tabs = [
  { id: "info", label: "Данные", icon: "User" },
  { id: "orders", label: "Заказы", icon: "Package" },
  { id: "security", label: "Безопасность", icon: "Shield" },
  { id: "notifications", label: "Уведомления", icon: "Bell" },
] as const;

type Tab = typeof tabs[number]["id"];

export default function Profile({ user, onNavigate, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+7 (999) 123-45-67",
    city: "Москва",
    company: "",
  });
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ orders: true, promo: false, news: true });

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center animate-fade-in">
        <Icon name="User" size={48} className="text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="font-display text-2xl mb-3">Необходима авторизация</h2>
        <p className="font-body text-sm text-muted-foreground mb-6">Войдите в аккаунт для доступа к профилю</p>
        <button onClick={() => onNavigate("auth")} className="btn-gold">Войти</button>
      </div>
    );
  }

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-2">Личный кабинет</p>
        <h1 className="font-display text-4xl">Профиль</h1>
        <div className="gold-line w-24 mt-3" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="surface-card p-4 mb-4">
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-16 h-16 bg-gold/10 border border-gold/30 flex items-center justify-center mb-3">
                <span className="font-display text-2xl text-gold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="font-display text-lg">{user.name}</div>
              <div className="font-body text-xs text-muted-foreground mt-0.5">{user.email}</div>
              <div className={`mt-2 font-body text-[10px] tracking-widest uppercase border px-2 py-0.5 ${
                user.role === "admin"
                  ? "border-gold/30 text-gold bg-gold/5"
                  : "border-border text-muted-foreground"
              }`}>
                {user.role === "admin" ? "Администратор" : "Клиент"}
              </div>
            </div>

            <div className="gold-line mb-4" />

            <div className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left font-body text-xs tracking-wider transition-all ${
                    activeTab === tab.id
                      ? "text-gold bg-gold/5"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon name={tab.icon} size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {user.role === "admin" && (
              <>
                <div className="gold-line my-3" />
                <button
                  onClick={() => onNavigate("admin")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left font-body text-xs tracking-wider text-gold hover:bg-gold/5 transition-all"
                >
                  <Icon name="Settings" size={14} />
                  Админ-панель
                </button>
              </>
            )}

            <div className="gold-line my-3" />
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left font-body text-xs tracking-wider text-muted-foreground hover:text-destructive transition-colors"
            >
              <Icon name="LogOut" size={14} />
              Выйти
            </button>
          </div>

          {/* Stats */}
          <div className="surface-card p-4 space-y-3">
            {[
              { label: "Заказов всего", val: "3" },
              { label: "Потрачено", val: "36 210 ₽" },
              { label: "Статус", val: "Премиум" },
            ].map(s => (
              <div key={s.label} className="flex justify-between items-center">
                <span className="font-body text-xs text-muted-foreground">{s.label}</span>
                <span className="font-body text-xs text-gold font-medium">{s.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "info" && (
            <div className="surface-card p-6 animate-fade-in">
              <h2 className="font-display text-2xl mb-6">Личные данные</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { key: "name", label: "Имя и фамилия", placeholder: "Иван Иванов" },
                  { key: "email", label: "Email", placeholder: "email@example.ru" },
                  { key: "phone", label: "Телефон", placeholder: "+7 (999) 000-00-00" },
                  { key: "city", label: "Город", placeholder: "Москва" },
                  { key: "company", label: "Компания (необязательно)", placeholder: "ООО «Компания»" },
                ].map(field => (
                  <div key={field.key} className={field.key === "company" ? "sm:col-span-2" : ""}>
                    <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={form[field.key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full bg-muted border border-border px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleSave} className="btn-gold flex items-center gap-2">
                  {saved ? <><Icon name="Check" size={14} /> Сохранено</> : <><Icon name="Save" size={14} /> Сохранить</>}
                </button>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="surface-card p-6 animate-fade-in">
              <h2 className="font-display text-2xl mb-4">История заказов</h2>
              <button onClick={() => onNavigate("orders")} className="btn-gold flex items-center gap-2">
                <Icon name="Package" size={14} />
                Перейти к заказам
              </button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="surface-card p-6 animate-fade-in">
              <h2 className="font-display text-2xl mb-6">Безопасность</h2>
              <div className="space-y-4 max-w-sm">
                {["Текущий пароль", "Новый пароль", "Подтвердите пароль"].map(label => (
                  <div key={label}>
                    <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">{label}</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-muted border border-border px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                ))}
                <button className="btn-gold flex items-center gap-2">
                  <Icon name="Lock" size={14} />
                  Изменить пароль
                </button>
              </div>

              <div className="mt-8 p-4 border border-destructive/20 bg-destructive/5">
                <h3 className="font-display text-lg text-destructive mb-2">Удалить аккаунт</h3>
                <p className="font-body text-xs text-muted-foreground mb-3">Это действие необратимо. Все данные будут удалены.</p>
                <button className="font-body text-xs text-destructive border border-destructive/40 px-4 py-2 hover:bg-destructive/10 transition-colors tracking-wider uppercase">
                  Удалить аккаунт
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="surface-card p-6 animate-fade-in">
              <h2 className="font-display text-2xl mb-6">Уведомления</h2>
              <div className="space-y-4">
                {[
                  { key: "orders", label: "Статус заказов", desc: "Изменения по вашим заказам" },
                  { key: "promo", label: "Акции и скидки", desc: "Специальные предложения" },
                  { key: "news", label: "Новости каталога", desc: "Новые модели и категории" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <div className="font-body text-sm">{item.label}</div>
                      <div className="font-body text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                      className={`w-10 h-5 relative transition-colors ${notifs[item.key as keyof typeof notifs] ? "bg-gold" : "bg-muted"}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-background transition-transform ${notifs[item.key as keyof typeof notifs] ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
