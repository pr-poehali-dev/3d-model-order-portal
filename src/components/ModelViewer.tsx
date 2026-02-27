import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  complexity: string;
  format: string;
  time: string;
  rating: number;
  reviews: number;
  color: string;
}

interface Props {
  product: Product;
  onClose: () => void;
  onAddToCart: () => void;
}

export default function ModelViewer({ product, onClose, onAddToCart }: Props) {
  const [rotX, setRotX] = useState(15);
  const [rotY, setRotY] = useState(0);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | undefined>(undefined);
  const autoRotRef = useRef(true);

  useEffect(() => {
    const animate = () => {
      if (autoRotRef.current) {
        setRotY(prev => prev + 0.5);
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    autoRotRef.current = false;
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setRotY(prev => prev + dx * 0.5);
    setRotX(prev => Math.max(-60, Math.min(60, prev + dy * 0.3)));
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale(prev => Math.max(0.5, Math.min(2.5, prev - e.deltaY * 0.002)));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    autoRotRef.current = false;
    setLastPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - lastPos.x;
    const dy = e.touches[0].clientY - lastPos.y;
    setRotY(prev => prev + dx * 0.5);
    setRotX(prev => Math.max(-60, Math.min(60, prev + dy * 0.3)));
    setLastPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const faces = [
    { transform: `translateZ(90px)`, opacity: 0.9 },
    { transform: `rotateY(180deg) translateZ(90px)`, opacity: 0.7 },
    { transform: `rotateY(90deg) translateZ(90px)`, opacity: 0.75 },
    { transform: `rotateY(-90deg) translateZ(90px)`, opacity: 0.8 },
    { transform: `rotateX(90deg) translateZ(90px)`, opacity: 0.6 },
    { transform: `rotateX(-90deg) translateZ(90px)`, opacity: 0.65 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-card border border-border animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-gold">{product.category}</p>
            <h2 className="font-display text-2xl">{product.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-gold transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Viewer */}
          <div
            ref={containerRef}
            className="model-viewer-container h-72 md:h-auto flex items-center justify-center cursor-grab active:cursor-grabbing select-none border-r border-border"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => setIsDragging(false)}
          >
            <div style={{ perspective: "600px" }}>
              <div
                className="relative"
                style={{
                  width: "180px",
                  height: "180px",
                  transformStyle: "preserve-3d",
                  transform: `scale(${scale}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                  transition: isDragging ? "none" : "transform 0.05s linear",
                }}
              >
                {faces.map((face, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 border-2"
                    style={{
                      transform: face.transform,
                      backgroundColor: product.color + Math.round(face.opacity * 30).toString(16).padStart(2, "0"),
                      borderColor: product.color + "88",
                      boxShadow: `inset 0 0 20px ${product.color}22`,
                    }}
                  >
                    {i === 0 && (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-4xl" style={{ color: product.color + "CC" }}>3D</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Controls hint */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-4">
              <span className="font-body text-[10px] text-muted-foreground tracking-wider flex items-center gap-1">
                <Icon name="MousePointer" size={10} /> Перетащите для вращения
              </span>
              <span className="font-body text-[10px] text-muted-foreground tracking-wider flex items-center gap-1">
                <Icon name="ZoomIn" size={10} /> Колесо — масштаб
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="Star" size={13} className={i < Math.floor(product.rating) ? "text-gold" : "text-muted-foreground/30"} />
                ))}
              </div>
              <span className="font-body text-xs text-muted-foreground">{product.rating} ({product.reviews} отзывов)</span>
            </div>

            <div className="space-y-3 flex-1 mb-6">
              {[
                { label: "Формат файлов", val: product.format },
                { label: "Сложность", val: product.complexity },
                { label: "Срок выполнения", val: product.time },
              ].map(row => (
                <div key={row.label} className="border-b border-border pb-2">
                  <div className="font-body text-[10px] text-muted-foreground tracking-widest uppercase mb-1">{row.label}</div>
                  <div className="font-body text-sm text-foreground">{row.val}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="font-display text-3xl text-gold">{product.price.toLocaleString()} ₽</div>
              <div className="flex gap-2">
                <button
                  onClick={() => { onAddToCart(); }}
                  className="btn-gold flex-1 flex items-center justify-center gap-2"
                >
                  <Icon name="ShoppingCart" size={14} />
                  В корзину
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 border border-border text-muted-foreground hover:border-gold hover:text-gold transition-all font-body text-xs tracking-wider uppercase"
                >
                  <Icon name="Download" size={14} />
                  Превью
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setScale(s => Math.min(2.5, s + 0.2))}
                  className="p-2 border border-border text-muted-foreground hover:border-gold hover:text-gold transition-all"
                >
                  <Icon name="ZoomIn" size={14} />
                </button>
                <button
                  onClick={() => setScale(s => Math.max(0.5, s - 0.2))}
                  className="p-2 border border-border text-muted-foreground hover:border-gold hover:text-gold transition-all"
                >
                  <Icon name="ZoomOut" size={14} />
                </button>
                <button
                  onClick={() => { setScale(1); setRotX(15); setRotY(0); autoRotRef.current = true; }}
                  className="p-2 border border-border text-muted-foreground hover:border-gold hover:text-gold transition-all"
                >
                  <Icon name="RotateCcw" size={14} />
                </button>
              </div>
              <button
                onClick={() => { autoRotRef.current = !autoRotRef.current; }}
                className="font-body text-[10px] tracking-widest uppercase text-muted-foreground hover:text-gold transition-colors"
              >
                Авто-вращение
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
