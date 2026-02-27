import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "catalog" | "cart" | "orders" | "profile" | "delivery" | "reviews" | "support" | "admin" | "auth";

interface Props {
  onNavigate: (page: Page) => void;
}

interface Message {
  role: "user" | "support";
  text: string;
  time: string;
}

const initialMessages: Message[] = [
  {
    role: "support",
    text: "Здравствуйте! Я — оператор ФОРМ3Д. Чем могу помочь?",
    time: "10:00",
  },
];

const quickAnswers = [
  "Как отследить заказ?",
  "Сроки изготовления",
  "Доступные форматы",
  "Условия возврата",
];

const faqItems = [
  { q: "Какие форматы файлов поддерживаются?", a: "STL, OBJ, FBX, STEP, IGES, 3DM. Формат указывается при заказе." },
  { q: "Можно ли заказать кастомную модель?", a: "Да. Опишите задание в поле 'Детали заказа' или прикрепите референс." },
  { q: "Как долго ждать заказ?", a: "Зависит от сложности: простые — 1–2 дня, сложные — до 14 дней." },
  { q: "Как оплатить заказ?", a: "Банковская карта, СБП, расчётный счёт для юр. лиц." },
];

export default function Support({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<"chat" | "faq" | "ticket">("chat");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [ticketForm, setTicketForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [ticketSent, setTicketSent] = useState(false);

  const now = () => new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages(prev => [...prev, { role: "user", text: msg, time: now() }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "support",
        text: "Спасибо за обращение! Наш специалист ответит в течение нескольких минут. Среднее время ответа — 5 минут.",
        time: now(),
      }]);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-2">Помощь</p>
        <h1 className="font-display text-4xl">Поддержка</h1>
        <div className="gold-line w-24 mt-3" />
      </div>

      {/* Contact methods */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: "MessageCircle", label: "Чат", sub: "Онлайн", key: "chat" as const },
          { icon: "HelpCircle", label: "FAQ", sub: "База знаний", key: "faq" as const },
          { icon: "Mail", label: "Тикет", sub: "48ч ответ", key: "ticket" as const },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`surface-card p-4 flex flex-col items-center gap-2 transition-all ${
              activeTab === item.key ? "border-gold" : "hover:border-gold/30"
            }`}
          >
            <Icon name={item.icon as "MessageCircle"} size={20} className={activeTab === item.key ? "text-gold" : "text-muted-foreground"} />
            <span className={`font-display text-base ${activeTab === item.key ? "text-gold" : "text-foreground"}`}>{item.label}</span>
            <span className="font-body text-[10px] text-muted-foreground tracking-wider">{item.sub}</span>
          </button>
        ))}
      </div>

      {/* Chat */}
      {activeTab === "chat" && (
        <div className="surface-card flex flex-col h-96 animate-fade-in">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <div className="w-8 h-8 bg-gold flex items-center justify-center">
              <span className="font-display text-background text-sm font-bold">Ю</span>
            </div>
            <div>
              <div className="font-body text-sm">Оператор ФОРМ3Д</div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="font-body text-[10px] text-muted-foreground">Онлайн</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs px-3 py-2 ${
                  msg.role === "user"
                    ? "bg-gold text-background"
                    : "bg-muted border border-border"
                }`}>
                  <p className="font-body text-sm leading-relaxed">{msg.text}</p>
                  <p className={`font-body text-[10px] mt-1 ${msg.role === "user" ? "text-background/60" : "text-muted-foreground"}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick replies */}
          <div className="px-4 py-2 border-t border-border flex gap-2 overflow-x-auto">
            {quickAnswers.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="font-body text-[10px] tracking-wider whitespace-nowrap border border-border px-2.5 py-1 text-muted-foreground hover:border-gold hover:text-gold transition-all flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Напишите сообщение..."
              className="flex-1 bg-muted border border-border px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
            />
            <button onClick={() => sendMessage()} className="btn-gold px-3">
              <Icon name="Send" size={15} />
            </button>
          </div>
        </div>
      )}

      {/* FAQ */}
      {activeTab === "faq" && (
        <div className="space-y-3 animate-fade-in">
          {faqItems.map((item, i) => (
            <div key={i} className="surface-card p-5">
              <div className="flex items-start gap-3">
                <Icon name="ChevronRight" size={16} className="text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-body text-sm font-medium mb-2">{item.q}</h4>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket */}
      {activeTab === "ticket" && (
        <div className="surface-card p-6 animate-fade-in">
          <h2 className="font-display text-2xl mb-6">Создать тикет</h2>
          {ticketSent ? (
            <div className="flex items-center gap-3 text-gold">
              <Icon name="CheckCircle" size={20} />
              <span className="font-body text-sm">Тикет создан. Мы ответим в течение 48 часов на ваш email.</span>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setTicketSent(true); }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "name", label: "Имя", placeholder: "Иван Иванов", type: "text" },
                  { key: "email", label: "Email", placeholder: "email@example.ru", type: "email" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={ticketForm[f.key as keyof typeof ticketForm]}
                      onChange={e => setTicketForm(t => ({ ...t, [f.key]: e.target.value }))}
                      className="w-full bg-muted border border-border px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">Тема</label>
                <input
                  type="text"
                  placeholder="Кратко опишите проблему"
                  value={ticketForm.subject}
                  onChange={e => setTicketForm(t => ({ ...t, subject: e.target.value }))}
                  className="w-full bg-muted border border-border px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-1.5">Сообщение</label>
                <textarea
                  placeholder="Подробно опишите ситуацию..."
                  rows={5}
                  value={ticketForm.message}
                  onChange={e => setTicketForm(t => ({ ...t, message: e.target.value }))}
                  className="w-full bg-muted border border-border px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors resize-none"
                />
              </div>
              <button type="submit" className="btn-gold flex items-center gap-2">
                <Icon name="Send" size={14} />
                Отправить тикет
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
