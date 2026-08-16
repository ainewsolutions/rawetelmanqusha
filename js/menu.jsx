// ============================================================
// روعة المنقوشة — Menu components
// نسخة طبق الأصل من شكل المنيو المرجعي: بحث، تصنيفات كبسولية،
// كل التصنيفات معروضة تحت بعض في صفحة واحدة، كارت الصنف بنفس
// الشكل بالظبط (صورة/اسم/سعرات/وصف/اختيار حجم مباشر على الكارت/
// ملاحظات/زرار إضافة).
// ============================================================

function formatPrice(n, currency) {
  const val = Number(n || 0);
  return `${val.toFixed(2)} ${currency || "ر.س"}`;
}

// بيحدد لو الصنف عنده مجموعة اختيار واحدة بسيطة (زي المقاس: وسط/
// كبير) — الحالة دي بتتعرض كأزرار مباشرة على الكارت زي الأصل تمامًا.
// أي شكل أعقد (أكتر من مجموعة، أو مجموعة تسمح باختيار متعدد)
// بيفتح مودال بسيط بدل ما نعقّد شكل الكارت.
function simpleSizeGroup(item) {
  if (item.options && item.options.length === 1 && item.options[0].multiple === false) {
    return item.options[0];
  }
  return null;
}
function hasComplexOptions(item) {
  return !!(item.options && item.options.length > 0 && !simpleSizeGroup(item));
}

function ItemCard({ item, currency, onAdd }) {
  const sizeGroup = simpleSizeGroup(item);
  const complex = hasComplexOptions(item);
  const [selectedChoiceId, setSelectedChoiceId] = useState(sizeGroup ? sizeGroup.choices[0]?.id : null);
  const [notes, setNotes] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const selectedChoice = sizeGroup ? sizeGroup.choices.find((c) => c.id === selectedChoiceId) : null;
  const unitPrice = Number(item.price || 0) + Number((selectedChoice && selectedChoice.priceDelta) || 0);

  function handleAddClick() {
    if (complex) {
      setOpenModal(true);
      return;
    }
    const displayName = selectedChoice ? `${item.name} (${selectedChoice.label})` : item.name;
    onAdd({
      displayName,
      unitPrice,
      notes: notes.trim(),
      optionsSummary: selectedChoice ? [`${sizeGroup.title}: ${selectedChoice.label}`] : [],
    });
    setNotes("");
  }

  return (
    <div className="menu-card">
      <div className="menu-card-image">
        {item.image ? (
          <img src={item.image} alt={item.name} loading="lazy" />
        ) : (
          <div className="menu-card-image-fallback">
            <IconFishWatermark className="w-10 h-10 text-samaq-blue opacity-40" />
          </div>
        )}
        {!item.available && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="unavailable-badge">غير متاح حاليًا</span>
          </div>
        )}
      </div>
      <div className="card-content">
        <div className="item-header">
          <h3 className="item-name">{item.name}</h3>
        </div>
        {item.description && <p className="item-desc">{item.description}</p>}

        {sizeGroup && (
          <div className="size-selector">
            {sizeGroup.choices.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`size-btn ${selectedChoiceId === c.id ? "active" : ""}`}
                onClick={() => setSelectedChoiceId(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        <div className="price-row">
          <span className="item-price">
            {unitPrice.toFixed(2)} <span className="currency">{currency}</span>
          </span>
        </div>

        <div className="card-actions">
          <textarea
            className="notes-input"
            placeholder="ملاحظات (اختياري)..."
            rows={1}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button disabled={!item.available} onClick={handleAddClick} className="add-btn">
            {complex ? "اختر" : "إضافة للسلة ➕"}
          </button>
        </div>
      </div>

      {openModal && (
        <ItemOptionsModal
          item={item}
          currency={currency}
          onClose={() => setOpenModal(false)}
          onAdd={(payload) => {
            onAdd(payload);
            setOpenModal(false);
          }}
        />
      )}
    </div>
  );
}

// مودال بسيط للأصناف اللي عندها أكتر من مجموعة اختيارات أو مجموعة
// اختيار متعدد — بنفس شكل مودال السلة (خلفية كريمية، رأسية بيضاء،
// زرار إغلاق دائري) عشان الهوية البصرية تفضل واحدة في كل حتة.
function ItemOptionsModal({ item, currency, onClose, onAdd }) {
  const [selections, setSelections] = useState({});
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
      displayName: item.name,
      unitPrice,
      notes: notes.trim(),
      optionsSummary,
    });
  }

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="cart-modal" style={{ maxHeight: "85vh" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{item.name}</div>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>
        <div className="modal-body">
          {item.description && <p className="item-desc mb-3">{item.description}</p>}
          {(item.options || []).map((g) => (
            <div key={g.id} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-sm" style={{ color: "var(--secondary-color)" }}>{g.title}</h4>
                {g.required && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(164,124,67,.18)", color: "var(--secondary-color)" }}>مطلوب</span>}
              </div>
              <div className="flex flex-col gap-2">
                {g.choices.map((c) => {
                  const sel = selections[g.id];
                  const checked = Array.isArray(sel) ? sel.includes(c.id) : sel === c.id;
                  return (
                    <label
                      key={c.id}
                      className="flex items-center justify-between rounded-xl px-3 py-2 cursor-pointer text-sm"
                      style={{ border: `1px solid ${checked ? "var(--primary-color)" : "var(--border-color)"}`, background: checked ? "rgba(164,124,67,.08)" : "var(--surface-color)" }}
                    >
                      <span className="flex items-center gap-2">
                        <input type={g.multiple ? "checkbox" : "radio"} name={g.id} checked={checked} onChange={() => toggleChoice(g, c.id)} />
                        <span className="font-bold">{c.label}</span>
                      </span>
                      {c.priceDelta ? <span className="text-xs" style={{ color: "var(--text-muted)" }}>+{c.priceDelta} {currency}</span> : null}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
          <textarea
            className="notes-input"
            placeholder="ملاحظات (اختياري)..."
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button disabled={missingRequired} onClick={handleAdd} className="add-btn">
            إضافة للسلة — {formatPrice(unitPrice, currency)}
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuPage({ categories, items, settings, onAdd }) {
  const activeCategories = categories.filter((c) => c.active).sort((a, b) => a.order - b.order);
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");

  function selectCategory(id) {
    setActiveCat(id);
    const el = document.getElementById("menuContainer");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  const searchLower = search.trim().toLowerCase();
  const isSearching = searchLower.length > 0;

  const sections = activeCategories
    .filter((cat) => activeCat === "all" || activeCat === cat.id)
    .map((cat) => {
      const catItems = items
        .filter((i) => i.categoryId === cat.id)
        .filter((i) => !isSearching || String(i.name || "").toLowerCase().includes(searchLower))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      return { cat, catItems };
    })
    .filter(({ catItems }) => catItems.length > 0);

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="ابحث عن وجبتك المفضلة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="categories-wrapper">
        <nav className="categories-nav">
          <button className={`category-btn ${activeCat === "all" ? "active" : ""}`} onClick={() => selectCategory("all")}>
            الكل
          </button>
          {activeCategories.map((c) => (
            <button key={c.id} className={`category-btn ${activeCat === c.id ? "active" : ""}`} onClick={() => selectCategory(c.id)}>
              {c.name}
            </button>
          ))}
        </nav>
      </div>

      <main className="menu-container" id="menuContainer">
        {sections.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <h3>لم يتم العثور على نتائج</h3>
          </div>
        )}
        {sections.map(({ cat, catItems }) => (
          <section key={cat.id}>
            <h2 className="category-section-title">
              <span>{cat.name}</span>
              <span className="section-decorative">❖</span>
            </h2>
            {cat.bannerImage && (
              <div className="category-banner">
                <img src={cat.bannerImage} alt={cat.name} loading="lazy" />
              </div>
            )}
            <div className="menu-grid">
              {catItems.map((it) => (
                <ItemCard key={it.id} item={it} currency={settings.currency} onAdd={(payload) => onAdd(it, payload)} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
