// ============================================================
// روعة المنقوشة — Header & Footer
// نسخة طبق الأصل من الهيدر المرجعي: هيدر أبيض بسيط، اللوجو
// في النص، بدون أي أزرار — الوصول للسلة بس عن طريق الزرار
// العائم تحت لما يبقى فيها أصناف.
// ============================================================

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-container">
          <img src="assets/logo.png" alt="روعة المنقوشة" className="logo-image" />
          <div className="store-title">
            <p>روعة المنقوشة</p>
            <p>مشاوي وفطائر</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer({ settings }) {
  return (
    <footer className="no-print bg-[#2e2013] text-white pt-10 pb-8 mt-6">
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-6 text-center">
        {settings.googleMapsUrl && (
          <a href={settings.googleMapsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition rounded-full px-5 py-2.5 text-sm font-bold">
            <IconMap className="w-4 h-4" /> موقعنا على الخريطة
          </a>
        )}

        <div className="flex flex-col items-center gap-1.5 text-sm text-white/80">
          {settings.address && <p>{settings.address}</p>}
          {settings.phone && (
            <a href={`tel:${String(settings.phone || "").replace(/\s/g, "")}`} className="flex items-center gap-2 font-bold text-white transition" dir="ltr">
              <IconWhatsapp className="w-4 h-4" /> {settings.phone}
            </a>
          )}
        </div>

        <p className="text-[11px] text-white/40">© {new Date().getFullYear()} روعة المنقوشة — جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
}
