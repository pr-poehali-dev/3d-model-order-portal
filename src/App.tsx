import { useState } from "react";
import Catalog from "@/pages/Catalog";
import Cart from "@/pages/Cart";
import Orders from "@/pages/Orders";
import Profile from "@/pages/Profile";
import Delivery from "@/pages/Delivery";
import Reviews from "@/pages/Reviews";
import Support from "@/pages/Support";
import Admin from "@/pages/Admin";
import Auth from "@/pages/Auth";
import Icon from "@/components/ui/icon";

type Page = "catalog" | "cart" | "orders" | "profile" | "delivery" | "reviews" | "support" | "admin" | "auth";

interface User {
  name: string;
  email: string;
  role: "client" | "admin";
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("catalog");
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "catalog", label: "Каталог", icon: "Grid3X3" },
    { id: "orders", label: "Заказы", icon: "Package" },
    { id: "delivery", label: "Доставка", icon: "Truck" },
    { id: "reviews", label: "Отзывы", icon: "Star" },
    { id: "support", label: "Поддержка", icon: "MessageCircle" },
  ] as const;

  const navigate = (page: Page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "catalog": return <Catalog onNavigate={navigate} onAddToCart={() => setCartCount(c => c + 1)} />;
      case "cart": return <Cart onNavigate={navigate} cartCount={cartCount} setCartCount={setCartCount} />;
      case "orders": return <Orders onNavigate={navigate} />;
      case "profile": return <Profile user={user} onNavigate={navigate} onLogout={() => { setUser(null); navigate("catalog"); }} />;
      case "delivery": return <Delivery onNavigate={navigate} />;
      case "reviews": return <Reviews onNavigate={navigate} />;
      case "support": return <Support onNavigate={navigate} />;
      case "admin": return user?.role === "admin" ? <Admin onNavigate={navigate} /> : <Catalog onNavigate={navigate} onAddToCart={() => setCartCount(c => c + 1)} />;
      case "auth": return <Auth onNavigate={navigate} onLogin={(u: User) => setUser(u)} />;
      default: return <Catalog onNavigate={navigate} onAddToCart={() => setCartCount(c => c + 1)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <button onClick={() => navigate("catalog")} className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gold flex items-center justify-center">
                <span className="text-background font-display font-bold text-xs">3D</span>
              </div>
              <span className="font-display text-lg tracking-widest uppercase">
                ФОРМ<span className="text-gold">3Д</span>
              </span>
            </button>

            <nav className="hidden md:flex items-center gap-6">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id as Page)}
                  className={`font-body text-xs tracking-widest uppercase transition-colors ${
                    currentPage === item.id ? "text-gold" : "text-muted-foreground hover:text-gold"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {user?.role === "admin" && (
                <button
                  onClick={() => navigate("admin")}
                  className={`font-body text-xs tracking-widest uppercase transition-colors ${
                    currentPage === "admin" ? "text-gold" : "text-muted-foreground hover:text-gold"
                  }`}
                >
                  Панель
                </button>
              )}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("cart")}
                className="relative p-2 text-muted-foreground hover:text-gold transition-colors"
              >
                <Icon name="ShoppingCart" size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-background text-[10px] font-bold flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {user ? (
                <button
                  onClick={() => navigate("profile")}
                  className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-body tracking-wider transition-all ${
                    currentPage === "profile"
                      ? "border-gold text-gold"
                      : "border-border text-muted-foreground hover:border-gold hover:text-gold"
                  }`}
                >
                  <Icon name="User" size={14} />
                  <span className="hidden sm:block">{user.name.split(" ")[0]}</span>
                </button>
              ) : (
                <button onClick={() => navigate("auth")} className="btn-gold">
                  Войти
                </button>
              )}

              <button
                className="md:hidden p-2 text-muted-foreground hover:text-gold transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Icon name={mobileMenuOpen ? "X" : "Menu"} size={18} />
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background animate-fade-in">
            <div className="px-4 py-3 flex flex-col gap-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id as Page)}
                  className={`flex items-center gap-3 py-2.5 px-3 font-body text-xs tracking-widest uppercase transition-colors text-left ${
                    currentPage === item.id ? "text-gold bg-gold/5" : "text-muted-foreground hover:text-gold"
                  }`}
                >
                  <Icon name={item.icon} size={15} />
                  {item.label}
                </button>
              ))}
              {user?.role === "admin" && (
                <button
                  onClick={() => navigate("admin")}
                  className="flex items-center gap-3 py-2.5 px-3 font-body text-xs tracking-widest uppercase text-gold text-left"
                >
                  <Icon name="Settings" size={15} />
                  Админ-панель
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="pt-14 min-h-screen">
        {renderPage()}
      </main>

      <footer className="border-t border-border mt-16 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gold flex items-center justify-center">
              <span className="text-background font-display font-bold text-[9px]">3D</span>
            </div>
            <span className="font-display text-sm tracking-widest uppercase">ФОРМ<span className="text-gold">3Д</span></span>
          </div>
          <p className="font-body text-xs text-muted-foreground tracking-wider">© 2026 ФОРМ3Д. Все права защищены.</p>
          <div className="flex items-center gap-4">
            <button className="font-body text-xs text-muted-foreground hover:text-gold transition-colors tracking-wider">Политика</button>
            <button className="font-body text-xs text-muted-foreground hover:text-gold transition-colors tracking-wider">Оферта</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
