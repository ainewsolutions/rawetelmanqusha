// ============================================================
// SAMAQ — Menu components: CategoryTabs, ItemCard, ItemModal
// ============================================================

function formatPrice(n, currency) {
  const val = Number(n || 0);
  return `${val.toFixed(2)} ${currency || "ر.س"}`;
}

function categoryIconFor(name) {
  const n = String(name || "");
  if (/سمك|روبيان|بحري/.test(n)) return IconCatFish;
  if (/مشروب/.test(n)) return IconCatDrink;
  if (/صلص|إضاف/.test(n)) return IconCatSauce;
  if (/كافيار/.test(n)) return IconCatCaviar;
  if (/مجمد/.test(n)) return IconCatFrozen;
  if (/طبخ|طبي|بروستد/.test(n)) return IconCatChef;
  return IconCatDefault;
}

// خلفية زخرفية مميزة لكل تصنيف — بروتين/شوي بلمسة خضراء، مشروبات
// بلمسة زرقاء سماوية، بطاطس وبوكسات وإضافات بنفس اللوحة المنعشة...
// عشان كل صفحة في "الكتاب" ليها طابعها الخاص من غير ما نخرج بره
// الأبيض/الأخضر/الأزرق السماوي
function categoryTheme(name) {
  const n = String(name || "");
  const flame =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath fill='%231FA765' d='M14 40c-2-8 3-13 2-19 4 2 6 6 5 10 3-2 4-6 3-10 6 4 8 11 5 17-2 4-7 6-11 5-3-1-4-2-4-3z'/%3E%3C/svg%3E";
  const drink =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Ccircle cx='14' cy='14' r='5' fill='none' stroke='%231583B7' stroke-width='2'/%3E%3Ccircle cx='40' cy='34' r='7' fill='none' stroke='%231583B7' stroke-width='2'/%3E%3Ccircle cx='44' cy='10' r='3' fill='%231583B7'/%3E%3C/svg%3E";
  const potato =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect x='10' y='8' width='7' height='34' rx='3' fill='%231FA765'/%3E%3Crect x='22' y='14' width='7' height='28' rx='3' fill='%231FA765'/%3E%3Crect x='34' y='6' width='7' height='36' rx='3' fill='%231FA765'/%3E%3C/svg%3E";
  const gift =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect x='10' y='20' width='30' height='22' rx='2' fill='none' stroke='%231583B7' stroke-width='2'/%3E%3Cpath d='M10 28h30M25 20v22' stroke='%231583B7' stroke-width='2'/%3E%3C/svg%3E";
  const drop =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Cpath fill='%234FC3B0' d='M16 6c6 8 9 13 9 18a9 9 0 1 1-18 0c0-5 3-10 9-18z'/%3E%3C/svg%3E";

  if (/مشروب/.test(n)) return { pattern: drink, accent: "#1583B7" };
  if (/بطاطس/.test(n)) return { pattern: potato, accent: "#1FA765" };
  if (/بوكس/.test(n)) return { pattern: gift, accent: "#1583B7" };
  if (/إضاف/.test(n)) return { pattern: drop, accent: "#4FC3B0" };
  return { pattern: flame, accent: "#1FA765" };
}

function CategoryTabs({ categories, activeId, onSelect }) {
  const scrollRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setShowArrows(el.scrollWidth > el.clientWidth + 4);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [categories]);

  function scrollBy(dir) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 240, behavior: "smooth" });
  }

  return (
    <div className="sticky top-[64px] z-30 bg-[#f7eed7]/95 backdrop-blur border-b border-[#e8dcc0]">
      <div className="max-w-5xl mx-auto px-3 py-2 relative flex items-center gap-1">
        {showArrows && (
          <button
            onClick={() => scrollBy(1)}
            aria-label="التصنيف التالي"
            className="hidden sm:flex shrink-0 w-8 h-8 rounded-full bg-white border border-[#e8dcc0] items-center justify-center text-samaq-blue hover:bg-[#f3ead1] transition shadow-sm"
          >
            <IconChevronLeft className="w-4 h-4 rotate-180" />
          </button>
        )}
        <div ref={scrollRef} className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map((c) => {
            const Icon = categoryIconFor(c.name);
            return (
              <button
                key={c.id}
                data-active={c.id === activeId}
                onClick={() => onSelect(c.id)}
                className="category-pill px-4 py-2 rounded-full text-sm font-bold shrink-0 flex items-center gap-1.5"
              >
                <Icon className="w-4 h-4" />
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
        {showArrows && (
          <button
            onClick={() => scrollBy(-1)}
            aria-label="التصنيف السابق"
            className="hidden sm:flex shrink-0 w-8 h-8 rounded-full bg-white border border-[#e8dcc0] items-center justify-center text-samaq-blue hover:bg-[#f3ead1] transition shadow-sm"
          >
            <IconChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function ItemImage({ item, className }) {
  if (item.image) {
    return <img src={item.image} alt={item.name} className={className} loading="lazy" />;
  }
  return (
    <div className={`item-image-fallback flex items-center justify-center ${className}`}>
      <IconFishWatermark className="w-10 h-10 text-samaq-blue opacity-40" />
    </div>
  );
}

function ItemCardList({ item, currency, onOpen, CategoryIcon }) {
  const hasOptions = item.options && item.options.length > 0;
  return (
    <div className="item-card relative bg-white rounded-2xl border border-[#ede0c0] flex items-center gap-3 p-2.5 overflow-hidden">
      {CategoryIcon && !item.image && (
        <CategoryIcon className="absolute -left-2 -bottom-2 w-16 h-16 text-samaq-gold opacity-15 pointer-events-none" />
      )}
      {item.image && (
        <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden bg-[#f3ead1] cursor-pointer" onClick={() => item.available && onOpen(item)}>
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
          {!item.available && <div className="absolute inset-0 bg-white/70" />}
        </div>
      )}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-[#5c4326] text-sm leading-snug line-clamp-1">{item.name}</h3>
          {!item.available && (
            <span className="bg-black/80 text-white text-[10px] px-2 py-0.5 rounded-full shrink-0">غير متاح</span>
          )}
        </div>
        {item.description && <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>}
        <span className="text-samaq-green font-extrabold text-sm">{formatPrice(item.price, currency)}</span>
      </div>
      <button
        disabled={!item.available}
        onClick={() => onOpen(item)}
        className="bg-samaq-blue disabled:bg-gray-300 text-white text-xs font-bold rounded-full px-3 py-1.5 hover:brightness-110 transition shrink-0"
      >
        {hasOptions ? "اختر" : "إضافة"}
      </button>
    </div>
  );
}

function ItemCard({ item, currency, onOpen, CategoryIcon }) {
  const hasOptions = item.options && item.options.length > 0;
  return (
    <div className="item-card relative bg-white rounded-2xl overflow-hidden border border-[#ede0c0] flex flex-col">
      {CategoryIcon && !item.image && (
        <CategoryIcon className="absolute -left-3 -bottom-3 w-24 h-24 text-samaq-gold opacity-15 pointer-events-none" />
      )}
      {item.image && (
        <div className="relative w-full bg-[#f3ead1] cursor-pointer" onClick={() => item.available && onOpen(item)}>
          <ItemImage item={item} className="w-full h-48 sm:h-40 object-contain" />
          {!item.available && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="bg-black/80 text-white text-xs px-3 py-1 rounded-full">غير متاح حاليًا</span>
            </div>
          )}
        </div>
      )}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-[#5c4326] text-sm leading-snug line-clamp-2">{item.name}</h3>
          {!item.image && !item.available && (
            <span className="bg-black/80 text-white text-[10px] px-2 py-0.5 rounded-full shrink-0">غير متاح</span>
          )}
        </div>
        {item.description && <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-samaq-green font-extrabold text-sm">{formatPrice(item.price, currency)}</span>
          <button
            disabled={!item.available}
            onClick={() => onOpen(item)}
            className="bg-samaq-blue disabled:bg-gray-300 text-white text-xs font-bold rounded-full px-3 py-1.5 hover:brightness-110 transition"
          >
            {hasOptions ? "اختر" : "إضافة"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ItemModal({ item, currency, onClose, onAdd }) {
  const [qty, setQty] = useState(1);
  const [selections, setSelections] = useState({}); // groupId -> choiceId | [choiceId,...]
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const init = {};
    (item.options || []).forEach((g) => {
      if (g.required && g.choices.length) {
        init[g.id] = g.multiple ? [g.choices[0].id] : g.choices[0].id;
      }
    });
    setSelections(init);
  }, [item]);

  const extra = useMemo(() => {
    let sum = 0;
    (item.options || []).forEach((g) => {
      const sel = selections[g.id];
      if (!sel) return;
      const ids = Array.isArray(sel) ? sel : [sel];
      ids.forEach((cid) => {
        const choice = g.choices.find((c) => c.id === cid);
        if (choice) sum += Number(choice.priceDelta || 0);
      });
    });
    return sum;
  }, [selections, item]);

  const unitPrice = Number(item.price || 0) + extra;
  const totalPrice = unitPrice * qty;

  const missingRequired = (item.options || []).some((g) => {
    if (!g.required) return false;
    const sel = selections[g.id];
    return !sel || (Array.isArray(sel) && sel.length === 0);
  });

  function toggleChoice(group, choiceId) {
    setSelections((prev) => {
      const next = { ...prev };
      if (group.multiple) {
        const cur = new Set(next[group.id] || []);
        cur.has(choiceId) ? cur.delete(choiceId) : cur.add(choiceId);
        next[group.id] = Array.from(cur);
      } else {
        next[group.id] = choiceId;
      }
      return next;
    });
  }

  function handleAdd() {
    if (missingRequired) return;
    const optionsSummary = (item.options || [])
      .map((g) => {
        const sel = selections[g.id];
        if (!sel) return null;
        const ids = Array.isArray(sel) ? sel : [sel];
        const labels = ids.map((cid) => g.choices.find((c) => c.id === cid)?.label).filter(Boolean);
        return labels.length ? `${g.title}: ${labels.join("، ")}` : null;
      })
      .filter(Boolean);

    onAdd({
      lineId: `${item.id}_${Date.now()}`,
      itemId: item.id,
      name: item.name,
      unitPrice,
      qty,
      optionsSummary,
      notes: notes.trim(),
      totalPrice,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 fade-in" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto pop-in" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <ItemImage item={item} className="w-full h-56 sm:h-52 object-contain bg-[#f3ead1]" />
          <button onClick={onClose} className="absolute top-3 left-3 bg-white/90 rounded-full p-2 shadow">
            <IconClose className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-display text-[#5c4326]">{item.name}</h2>
            {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
            <p className="text-samaq-green font-bold mt-2">{formatPrice(item.price, currency)}</p>
          </div>

          {(item.options || []).map((g) => (
            <div key={g.id} className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-sm text-[#5c4326]">{g.title}</h4>
                {g.required && <span className="text-[10px] bg-samaq-gold/30 text-[#6b4a1f] px-2 py-0.5 rounded-full font-bold">مطلوب</span>}
              </div>
              <div className="flex flex-col gap-2">
                {g.choices.map((c) => {
                  const sel = selections[g.id];
                  const checked = Array.isArray(sel) ? sel.includes(c.id) : sel === c.id;
                  return (
                    <label key={c.id} className={`flex items-center justify-between border rounded-xl px-3 py-2 cursor-pointer text-sm ${checked ? "border-samaq-blue bg-blue-50" : "border-gray-200"}`}>
                      <span className="flex items-center gap-2">
                        <input
                          type={g.multiple ? "checkbox" : "radio"}
                          name={g.id}
                          checked={checked}
                          onChange={() => toggleChoice(g, c.id)}
                          className="accent-[#5c4326]"
                        />
                        <span className="font-bold">{c.label}</span>
                      </span>
                      {c.priceDelta ? <span className="text-xs text-gray-500">+{c.priceDelta} {currency}</span> : null}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="border-t pt-3">
            <h4 className="font-bold text-sm text-[#5c4326] mb-2">ملاحظات (اختياري)</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="مثال: بدون فلفل حار"
              className="w-full border border-gray-200 rounded-xl p-2 text-sm focus:outline-none focus:border-samaq-blue"
            />
          </div>

          <div className="flex items-center justify-between border-t pt-3">
            <span className="font-bold text-sm text-[#5c4326]">الكمية</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <IconMinus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-bold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <IconPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            disabled={missingRequired}
            onClick={handleAdd}
            className="bg-samaq-green disabled:bg-gray-300 text-white font-extrabold rounded-2xl py-3 flex items-center justify-center gap-2 hover:brightness-110 transition"
          >
            إضافة للسلة — {formatPrice(totalPrice, currency)}
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuPage({ categories, items, settings, cart, setCart }) {
  const activeCategories = categories.filter((c) => c.active).sort((a, b) => a.order - b.order);
  const [activeCat, setActiveCat] = useState(activeCategories[0]?.id);
  const [openItem, setOpenItem] = useState(null);
  const gridTopRef = useRef(null);

  useEffect(() => {
    if (!activeCat && activeCategories.length) setActiveCat(activeCategories[0].id);
  }, [activeCategories]);

  function selectCategory(id) {
    setActiveCat(id);
    if (gridTopRef.current) {
      const y = gridTopRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  function addToCart(line) {
    setCart((prev) => [...prev, line]);
  }

  const cat = activeCategories.find((c) => c.id === activeCat) || activeCategories[0];
  const catItems = cat
    ? items.filter((i) => i.categoryId === cat.id).sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

  return (
    <div>
      <div className="flex flex-col items-center pt-6 pb-3 bg-[#f7eed7]">
        <img src="assets/logo.png" alt="روعة المنقوشة" className="h-24 sm:h-28 w-auto rounded-full drop-shadow-sm" />
        <div className="flex items-center gap-2 mt-2 opacity-80">
          <span className="w-10 h-px bg-samaq-gold"></span>
          <IconStar className="w-3 h-3 text-samaq-gold" />
          <span className="w-10 h-px bg-samaq-gold"></span>
        </div>
      </div>
      <CategoryTabs categories={activeCategories} activeId={activeCat} onSelect={selectCategory} />
      <div ref={gridTopRef} className="max-w-5xl mx-auto px-3 pb-28">
        {cat && (() => {
          const theme = categoryTheme(cat.name);
          return (
            <div className="book-page pt-6">
              <section key={cat.id} className="book-page-inner">
                <div className="category-theme-bg" style={{ backgroundImage: `url("${theme.pattern}")`, backgroundSize: "60px 60px" }}></div>
                <div className="page-corner-fold"></div>
                <div className="relative">
                  {cat.bannerImage && (
                    <div className="w-full rounded-2xl overflow-hidden mb-3 bg-[#f3ead1]">
                      <img src={cat.bannerImage} alt={cat.name} className="w-full h-auto max-h-72 object-contain mx-auto" loading="lazy" />
                    </div>
                  )}
                  <h2 className="text-xl font-display text-[#5c4326] mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-5 rounded-full inline-block" style={{ background: theme.accent }}></span>
                    {(() => { const Icon = categoryIconFor(cat.name); return <Icon className="w-5 h-5 text-samaq-blue" />; })()}
                    {cat.name}
                  </h2>
                  {catItems.length > 0 ? (
                    settings.menuLayout === "list" ? (
                      <div className="flex flex-col gap-2.5">
                        {catItems.map((it) => (
                          <ItemCardList key={it.id} item={it} currency={settings.currency} onOpen={setOpenItem} CategoryIcon={categoryIconFor(cat.name)} />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {catItems.map((it) => (
                          <ItemCard key={it.id} item={it} currency={settings.currency} onOpen={setOpenItem} CategoryIcon={categoryIconFor(cat.name)} />
                        ))}
                      </div>
                    )
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-8 bg-white rounded-2xl border border-[#ede0c0]">
                      لا يوجد أصناف في هذا التصنيف حاليًا
                    </p>
                  )}
                </div>
              </section>
            </div>
          );
        })()}
      </div>

      {openItem && (
        <ItemModal item={openItem} currency={settings.currency} onClose={() => setOpenItem(null)} onAdd={addToCart} />
      )}
    </div>
  );
}
