// ============================================================
// روعة المنقوشة — السلة العائمة + مودال واحد (سلة + بيانات الطلب)
// نسخة طبق الأصل من الشكل المرجعي: زرار عائم بيضاوي في نص الشاشة
// تحت، ومودال واحد بس (مش خطوتين) فيه الأصناف وطريقة الاستلام
// وزرار الإرسال عبر واتساب.
// ============================================================

function cartTotal(cart) {
  return cart.reduce((sum, l) => sum + Number(l.totalPrice || 0), 0);
}
function cartCount(cart) {
  return cart.reduce((sum, l) => sum + Number(l.qty || 0), 0);
}

function FloatingCartButton({ cart, currency, onOpen }) {
  const count = cartCount(cart);
  if (!count) return null;
  return (
    <button onClick={onOpen} className="floating-cart no-print">
      <span className="cart-info">
        <span>🛒 سلة الطلبات</span>
        <span className="cart-badge">{count}</span>
      </span>
      <span style={{ fontWeight: 900 }}>{formatPrice(cartTotal(cart), currency)}</span>
    </button>
  );
}

function buildWhatsappMessage({ cart, currency, storeName, method, fields }) {
  const lines = [];
  lines.push(`✨ *طلب جديد من ${storeName}* ✨`);
  lines.push("");

  if (method === "delivery") {
    lines.push(`*طريقة الطلب:* توصيل 🛵`);
    if (fields.name) lines.push(`*الاسم:* ${fields.name}`);
    if (fields.phone) lines.push(`*رقم الجوال:* ${fields.phone}`);
    if (fields.address) lines.push(`*العنوان:* ${fields.address}`);
  } else if (method === "takeaway") {
    lines.push(`*طريقة الطلب:* استلام من الفرع 🛍️`);
    if (fields.name) lines.push(`*الاسم:* ${fields.name}`);
  } else {
    lines.push(`*طريقة الطلب:* محلي صالة 🍽️`);
    if (fields.table) lines.push(`*رقم الطاولة:* ${fields.table}`);
  }

  lines.push("");
  lines.push("--- تفاصيل الطلب ---");
  lines.push("");
  cart.forEach((l) => {
    lines.push(`▪️ *${l.name}* (الكمية: ${l.qty})`);
    if (l.optionsSummary && l.optionsSummary.length) lines.push(`   الخيارات: ${l.optionsSummary.join("، ")}`);
    if (l.notes) lines.push(`   📝 ملاحظة: ${l.notes}`);
    lines.push(`   السعر: ${formatPrice(l.totalPrice, currency)}`);
  });

  lines.push("");
  lines.push("--------------------");
  lines.push(`*الإجمالي المبدئي:* ${formatPrice(cartTotal(cart), currency)}`);

  if (method === "delivery") {
    lines.push("");
    lines.push("*(ملاحظة: تكلفة التوصيل غير مشمولة في السعر وتحدد من قبل المطعم)*");
  }

  lines.push("");
  lines.push("شكراً لكم 🌷");
  return lines.join("\n");
}

function CartModal({ cart, setCart, settings, onClose, onSent }) {
  const [method, setMethod] = useState("takeaway");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [table, setTable] = useState("");
  const [sending, setSending] = useState(false);

  function updateQty(lineId, delta) {
    setCart((prev) =>
      prev
        .map((l) => {
          if (l.lineId !== lineId) return l;
          const qty = l.qty + delta;
          return qty <= 0 ? null : { ...l, qty, totalPrice: l.unitPrice * qty };
        })
        .filter(Boolean)
    );
  }
  function removeLine(lineId) {
    setCart((prev) => prev.filter((l) => l.lineId !== lineId));
  }
  function updateNotes(lineId, val) {
    setCart((prev) => prev.map((l) => (l.lineId === lineId ? { ...l, notes: val } : l)));
  }

  async function handleCheckout() {
    if (cart.length === 0) return;
    setSending(true);

    const fields = { name: name.trim(), phone: phone.trim(), address: address.trim(), table: table.trim() };
    const message = buildWhatsappMessage({
      cart, currency: settings.currency, storeName: settings.storeName || "روعة المنقوشة", method, fields,
    });

    const order = {
      id: `order_${Date.now()}`,
      createdAt: new Date().toLocaleString("ar-SA"),
      customerName: fields.name,
      customerPhone: fields.phone,
      method,
      address: method === "delivery" ? fields.address : method === "dine_in" ? `طاولة ${fields.table}` : "",
      notes: "",
      itemsSummary: cart.map((l) => `${l.name} ×${l.qty}`).join("، "),
      total: cartTotal(cart),
      status: "جديد",
    };

    try {
      await DataService.addOrder(order);
    } catch (err) {
      console.warn("تعذر تسجيل الطلب في جوجل شيت:", err);
    }

    const waNumber = settings.whatsappNumber || "";
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    setSending(false);
    setCart([]);
    onSent();
  }

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">🛒 تفاصيل الطلب</div>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <div className="modal-body">
          {cart.length === 0 ? (
            <div className="empty-cart-msg">
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛒</div>
              <h3>السلة فارغة</h3>
            </div>
          ) : (
            <>
              {cart.map((l) => (
                <div key={l.lineId} className="cart-item">
                  <div className="cart-item-header">
                    <div>
                      <div className="cart-item-title">{l.name}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{formatPrice(l.unitPrice, settings.currency)} / للواحد</div>
                      {l.optionsSummary && l.optionsSummary.length > 0 && (
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>{l.optionsSummary.join(" · ")}</p>
                      )}
                    </div>
                    <div className="cart-item-price-total">{formatPrice(l.totalPrice, settings.currency)}</div>
                  </div>
                  <div className="cart-item-actions">
                    <div className="qty-controls">
                      <button className="qty-btn" onClick={() => updateQty(l.lineId, 1)}>+</button>
                      <span className="qty-value">{l.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(l.lineId, -1)}>−</button>
                    </div>
                    <button className="remove-btn" onClick={() => removeLine(l.lineId)}>حذف 🗑️</button>
                  </div>
                  <textarea
                    className="cart-item-notes notes-input"
                    placeholder="ملاحظات إضافية..."
                    rows={1}
                    value={l.notes || ""}
                    onChange={(e) => updateNotes(l.lineId, e.target.value)}
                  />
                </div>
              ))}

              <div className="checkout-section">
                <h3 className="section-title">طريقة الاستلام (معلومات اختيارية)</h3>
                <div className="order-type-tabs">
                  <button className={`type-tab ${method === "takeaway" ? "active" : ""}`} onClick={() => setMethod("takeaway")}>استلام من الفرع 🛍️</button>
                  <button className={`type-tab ${method === "delivery" ? "active" : ""}`} onClick={() => setMethod("delivery")}>توصيل 🛵</button>
                  <button className={`type-tab ${method === "dine_in" ? "active" : ""}`} onClick={() => setMethod("dine_in")}>محلي صالة 🍽️</button>
                </div>

                {method === "takeaway" && (
                  <div className="form-fields">
                    <div>
                      <label>الاسم (اختياري)</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك" />
                    </div>
                  </div>
                )}
                {method === "delivery" && (
                  <div className="form-fields">
                    <div>
                      <label>الاسم (اختياري)</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك" />
                    </div>
                    <div>
                      <label>رقم الجوال (اختياري)</label>
                      <input type="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05xxxxxxxx" />
                    </div>
                    <div>
                      <label>العنوان التفصيلي (اختياري)</label>
                      <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="الحي، الشارع، أقرب معلم" />
                    </div>
                  </div>
                )}
                {method === "dine_in" && (
                  <div className="form-fields">
                    <div>
                      <label>رقم الطاولة (اختياري)</label>
                      <input type="number" value={table} onChange={(e) => setTable(e.target.value)} placeholder="رقم الطاولة" />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <div className="summary-row">
            <span className="summary-label">الإجمالي المبدئي:</span>
            <span className="summary-total">{formatPrice(cartTotal(cart), settings.currency)}</span>
          </div>
          <button disabled={cart.length === 0 || sending} onClick={handleCheckout} className="checkout-btn">
            <IconWhatsapp className="w-5 h-5" />
            {sending ? "جارِ الإرسال..." : "إرسال الطلب عبر واتساب 💬"}
          </button>
        </div>
      </div>
    </div>
  );
}
