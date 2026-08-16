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

// بيشغّل أي كود تضمين (embed) خارجي — زي ودجت تقييمات جوجل من خدمة
// مجانية (Elfsight / EmbedSocial وغيرها) — بيفصل عناصر <script> ويحقنها
// بشكل يخلّيها تتنفذ فعليًا (React مش بينفذ script جوه dangerouslySetInnerHTML لوحدها)
function EmbedBlock({ html }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !html) return;
    ref.current.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    Array.from(wrapper.childNodes).forEach((node) => {
      if (node.tagName === "SCRIPT") {
        const s = document.createElement("script");
        Array.from(node.attributes).forEach((a) => s.setAttribute(a.name, a.value));
        s.text = node.textContent;
        ref.current.appendChild(s);
      } else {
        ref.current.appendChild(node.cloneNode(true));
      }
    });
  }, [html]);
  return <div ref={ref} className="w-full max-w-md" />;
}

function Footer({ settings }) {
  const social = [
    { key: "whatsapp", url: settings.socialWhatsapp, Icon: IconWhatsapp },
    { key: "facebook", url: settings.socialFacebook, Icon: IconFacebook },
    { key: "tiktok", url: settings.socialTiktok, Icon: IconTiktok },
    { key: "instagram", url: settings.socialInstagram, Icon: IconInstagram },
    { key: "twitter", url: settings.socialTwitter, Icon: IconTwitterX },
  ].filter((s) => s.url && s.url.trim());

  const hasStore = settings.googlePlayUrl || settings.appStoreUrl;

  return (
    <footer className="no-print bg-[#2e2013] text-white pt-10 pb-8 mt-6">
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-8 text-center">
        {social.length > 0 && (
          <div>
            <p className="font-display text-2xl mb-4 text-samaq-gold">تابعنا</p>
            <div className="flex items-center gap-3 justify-center">
              {social.map(({ key, url, Icon }) => (
                <a key={key} href={url} target="_blank" rel="noreferrer" className="social-btn"><Icon className="w-5 h-5" /></a>
              ))}
            </div>
          </div>
        )}

        {settings.googleReviewsEmbed && settings.googleReviewsEmbed.trim() && (
          <div className="w-full flex flex-col items-center gap-3">
            <p className="font-display text-2xl text-samaq-gold">تقييمنا على جوجل</p>
            <EmbedBlock html={settings.googleReviewsEmbed} />
          </div>
        )}

        {(settings.googleMapsUrl || settings.googleReviewUrl) && (
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {settings.googleMapsUrl && (
              <a href={settings.googleMapsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition rounded-full px-5 py-2.5 text-sm font-bold">
                <IconMap className="w-4 h-4" /> موقعنا على الخريطة
              </a>
            )}
            {settings.googleReviewUrl && (
              <a href={settings.googleReviewUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-samaq-gold/90 hover:bg-samaq-gold transition rounded-full px-5 py-2.5 text-sm font-bold text-[#2e2013]">
                <IconStar className="w-4 h-4" /> قيّمنا على جوجل
              </a>
            )}
          </div>
        )}

        <div className="flex flex-col items-center gap-1.5 text-sm text-white/80">
          {settings.address && <p>{settings.address}</p>}
          {settings.phone && (
            <a href={`tel:${String(settings.phone || "").replace(/\s/g, "")}`} className="flex items-center gap-2 font-bold text-white hover:text-samaq-gold transition" dir="ltr">
              <IconWhatsapp className="w-4 h-4" /> {settings.phone}
            </a>
          )}
        </div>

        {hasStore && (
          <div>
            <p className="font-display text-2xl mb-4 text-samaq-gold">حمّل التطبيق</p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {settings.googlePlayUrl && (
                <a href={settings.googlePlayUrl} target="_blank" rel="noreferrer" className="store-btn">
                  <IconPlay className="w-6 h-6" />
                  <span className="text-right leading-tight">
                    <span className="block text-[10px] text-gray-300">GET IT ON</span>
                    <span className="block text-sm font-bold -mt-0.5">Google Play</span>
                  </span>
                </a>
              )}
              {settings.appStoreUrl && (
                <a href={settings.appStoreUrl} target="_blank" rel="noreferrer" className="store-btn">
                  <IconApple className="w-6 h-6" />
                  <span className="text-right leading-tight">
                    <span className="block text-[10px] text-gray-300">Download on the</span>
                    <span className="block text-sm font-bold -mt-0.5">App Store</span>
                  </span>
                </a>
              )}
            </div>
          </div>
        )}

        <p className="text-[11px] text-white/40">© {new Date().getFullYear()} روعة المنقوشة — جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
}
