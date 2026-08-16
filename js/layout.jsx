// ============================================================
// SAMAQ — Header & Footer
// ============================================================

function Header({ cart, onOpenCart }) {
  const count = cartCount(cart);
  return (
    <header className="samaq-gradient-header sticky top-0 z-40 h-16 flex items-center px-4 shadow-md">
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="assets/logo.png" alt="روعة المنقوشة" className="h-11 w-auto rounded-full" />
          <div className="text-[#5c4326] leading-tight hidden sm:block">
            <p className="font-display text-lg leading-none">روعة المنقوشة</p>
            <p className="text-[11px] text-[#8c7355]">مشاوي وفطائر</p>
          </div>
        </div>
        <button onClick={onOpenCart} className="relative bg-[#a47c43]/10 hover:bg-[#a47c43]/20 transition rounded-full p-2.5">
          <IconCart className="w-5 h-5 text-[#5c4326]" />
          {count > 0 && (
            <span className="absolute -top-1 -left-1 bg-samaq-gold text-[#4a3b2c] text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">{count}</span>
          )}
        </button>
      </div>
    </header>
  );
}

function StarRow({ rating }) {
  const r = Math.round(Number(rating) || 0);
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <IconStar key={i} className={`w-3.5 h-3.5 ${i <= r ? "text-samaq-gold" : "text-white/25"}`} />
      ))}
    </span>
  );
}

function Footer({ settings }) {
  return (
    <footer className="no-print bg-[#2e2013] text-white pt-10 pb-8 mt-6">
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-8 text-center">
        {settings.googleMapsUrl && (
          <a href={settings.googleMapsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition rounded-full px-5 py-2.5 text-sm font-bold">
            <IconMap className="w-4 h-4" /> موقعنا على الخريطة
          </a>
        )}

        <div className="flex flex-col items-center gap-1.5 text-sm text-white/80">
          {settings.address && <p>{settings.address}</p>}
          {settings.phone && (
            <a href={`tel:${String(settings.phone || "").replace(/\s/g, "")}`} className="flex items-center gap-2 font-bold text-white hover:text-samaq-gold transition" dir="ltr">
              <IconWhatsapp className="w-4 h-4" /> {settings.phone}
            </a>
          )}
        </div>

        <p className="text-[11px] text-white/40">© {new Date().getFullYear()} روعة المنقوشة — جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
}
