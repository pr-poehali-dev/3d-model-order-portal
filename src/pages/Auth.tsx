import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "catalog" | "cart" | "orders" | "profile" | "delivery" | "reviews" | "support" | "admin" | "auth";

interface User {
  name: string;
  email: string;
  role: "client" | "admin";
}

interface Props {
  onNavigate: (page: Page) => void;
  onLogin: (user: User) => void;
}

type Mode = "login" | "register";

export default function Auth({ onNavigate, onLogin }: Props) {
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (mode === "login") {
        // Demo: admin login
        if (form.email === "admin@form3d.ru" && form.password === "admin123") {
          onLogin({ name: "Администратор", email: form.email, role: "admin" });
          onNavigate("admin");
          return;
        }
        if (form.email && form.password) {
          onLogin({ name: form.email.split("@")[0], email: form.email, role: "client" });
          onNavigate("catalog");
        } else {
          setError("Введите email и пароль");
        }
      } else {
        if (!form.name || !form.email || !form.password) {
          setError("Заполните все поля");
          return;
        }
        if (form.password !== form.confirm) {
          setError("Пароли не совпадают");
          return;
        }
        onLogin({ name: form.name, email: form.email, role: "client" });
        onNavigate("catalog");
      }
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo area */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-gold flex items-center justify-center mx-auto mb-4">
            <span className="font-display font-bold text-background text-lg">3D</span>
          </div>
          <h1 className="font-display text-3xl text-foreground mb-2">
            {mode === "login" ? "Добро пожаловать" : "Создать аккаунт"}
          </h1>
          <p className="font-body text-xs text-muted-foreground tracking-wider">
            {mode === "login"
              ? "Войдите в личный кабинет ФОРМ3Д"
              : "Зарегистрируйтесь для доступа к каталогу"}
          </p>
        </div>

        {/* Demo hint */}
        {mode === "login" && (
          <div className="mb-6 p-3 border border-gold/30 bg-gold/5">
            <p className="font-body text-xs text-muted-foreground tracking-wider">
              <span className="text-gold">Демо администратора:</span> admin@form3d.ru / admin123
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">Имя и фамилия</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Иван Иванов"
                className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          )}

          <div>
            <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="your@email.ru"
              className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">Пароль</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">Подтверждение пароля</label>
              <input
                type="password"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                placeholder="••••••••"
                className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-destructive font-body text-xs">
              <Icon name="AlertCircle" size={13} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold flex items-center justify-center gap-2 py-3 mt-2"
          >
            {loading && <Icon name="Loader2" size={14} className="animate-spin" />}
            {mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="font-body text-xs text-muted-foreground hover:text-gold transition-colors tracking-wider"
          >
            {mode === "login" ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
          </button>
        </div>

        {mode === "login" && (
          <div className="mt-3 text-center">
            <button className="font-body text-xs text-muted-foreground/60 hover:text-gold transition-colors tracking-wider">
              Забыли пароль?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
