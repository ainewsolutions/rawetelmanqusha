// ============================================================
// SAMAQ — Cart drawer + Checkout + WhatsApp order builder
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
    <button
      onClick={onOpen}
      className="fab-cart no-print fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 bg-samaq-green text-white rounded-full px-5 py-3 flex items-center gap-3 z-40 hover:brightness-110 transition"
    >
      <span className="relative">
        <IconCart className="w-5 h-5" />
        <span className="absolute -top-2 -left-2 bg-samaq-gold text-[#5c4326] text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">{count}</span>
      </span>
      <span className="font-bold text-sm">{formatPrice(cartTotal(cart), currency)}</span>
      <span className="text-xs opacity-90 hidden sm:inline">عرض السلة</span>
    </button>
  );
}

function CartDrawer({ cart, setCart, currency, onClose, onCheckout }) {
  function updateQty(lineId, delta) {
    setCart((prev) =>
      prev.map((l) => {
        if (l.lineId !== lineId) return l;
        const qty = Math.max(1, l.qty + delta);
        return { ...l, qty, totalPrice: l.unitPrice * qty };
      })
    );
  }
  function removeLine(lineId) {
    setCart((prev) => prev.filter((l) => l.lineId !== lineId));
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 fade-in" onClick={onClose}>
      <div
        className="absolute top-0 bottom-0 left-0 sm:left-auto sm:right-0 w-full sm:w-[420px] bg-white slide-in flex flex-col"
        style={{ animationName: "slideIn" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="samaq-gradient-header text-[#4a3b2c] px-5 py-4 flex items-center justify-between">
          <h2 className="font-extrabold text-lg">سلة الطلبات</h2>
          <button onClick={onClose}><IconClose className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {cart.length === 0 && (
            <div className="text-center text-gray-400 py-16">
              <IconCart className="w-10 h-10 mx-auto mb-2 opacity-40" />
              السلة فاضية دلوقتي
            </div>
          )}
          {cart.map((l) => (
            <div key={l.lineId} className="border border-gray-100 rounded-2xl p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-[#5c4326]">{l.name}</h4>
                  {l.optionsSummary && l.optionsSummary.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">{l.optionsSummary.join(" · ")}</p>
                  )}
                  {l.notes && <p className="text-xs text-gray-400 mt-1">ملاحظة: {l.notes}</p>}
                </div>
                <button onClick={() => removeLine(l.lineId)} className="text-red-400 hover:text-red-600 shrink-0">
                  <IconTrash className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(l.lineId, -1)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"><IconMinus className="w-3.5 h-3.5" /></button>
                  <span className="w-5 text-center text-sm font-bold">{l.qty}</span>
                  <button onClick={() => updateQty(l.lineId, 1)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"><IconPlus className="w-3.5 h-3.5" /></button>
                </div>
                <span className="text-samaq-green font-bold text-sm">{formatPrice(l.totalPrice, currency)}</span>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-[#5c4326]">الإجمالي</span>
              <span className="font-extrabold text-samaq-green text-lg">{formatPrice(cartTotal(cart), currency)}</span>
            </div>
            <button onClick={onCheckout} className="w-full bg-samaq-green text-white font-extrabold rounded-2xl py-3 hover:brightness-110 transition">
              متابعة الطلب
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function buildWhatsappMessage({ cart, currency, customerName, customerPhone, method, address, notes, storeName }) {
  const lines = [];
  lines.push(`*طلب جديد من ${storeName}*`);
  lines.push("");
  cart.forEach((l, idx) => {
    lines.push(`${idx + 1}. ${l.name} × ${l.qty}`);
    if (l.optionsSummary && l.optionsSummary.length) lines.push(`   الخيارات: ${l.optionsSummary.join("، ")}`);
    if (l.notes) lines.push(`   ملاحظة: ${l.notes}`);
    lines.push(`   السعر: ${formatPrice(l.totalPrice, currency)}`);
  });
  lines.push("");
  lines.push(`*الإجمالي الكلي: ${formatPrice(cartTotal(cart), currency)}*`);
  lines.push("");
  lines.push(`*بيانات العميل*`);
  lines.push(`الاسم: ${customerName}`);
  lines.push(`الهاتف: ${customerPhone}`);
  lines.push(`طريقة الاستلام: ${method === "delivery" ? "توصيل" : "استلام من الفرع"}`);
  if (method === "delivery" && address) lines.push(`العنوان: ${address}`);
  if (notes) lines.push(`ملاحظات عامة: ${notes}`);
  return lines.join("\n");
}

function CheckoutForm({ cart, setCart, settings, onClose, onDone }) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [method, setMethod] = useState("delivery");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const [sending, setSending] = useState(false);

  async function handleSubmit() {
    if (!customerName.trim() || !customerPhone.trim()) {
      setError("من فضلك اكتب الاسم ورقم الهاتف");
      return;
    }
    if (method === "delivery" && !address.trim()) {
      setError("من فضلك اكتب عنوان التوصيل");
      return;
    }
    setError("");
    setSending(true);

    const message = buildWhatsappMessage({
      cart, currency: settings.currency, customerName, customerPhone, method, address, notes,
      storeName: settings.storeName,
    });

    const order = {
      id: `order_${Date.now()}`,
      createdAt: new Date().toLocaleString("ar-SA"),
      customerName, customerPhone, method,
      address: method === "delivery" ? address : "",
      notes,
      itemsSummary: cart.map((l) => `${l.name} ×${l.qty}`).join("، "),
      total: cartTotal(cart),
      status: "جديد",
    };

    // الأولوية لواتساب — لو تسجيل الطلب في الشيت فشل، ما نمنعش
    // العميل من إرسال الطلب فعليًا
    try {
      await DataService.addOrder(order);
    } catch (err) {
      console.warn("تعذر تسجيل الطلب في جوجل شيت:", err);
    }

    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    setSending(false);
    setCart([]);
    onDone();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 fade-in" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto pop-in" onClick={(e) => e.stopPropagation()}>
        <div className="samaq-gradient-header text-[#4a3b2c] px-5 py-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-3xl">
          <h2 className="font-extrabold text-lg">بيانات الطلب</h2>
          <button onClick={onClose}><IconClose className="w-5 h-5" /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div>
            <label className="text-sm font-bold text-[#5c4326] mb-1 block">الاسم</label>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-samaq-blue" placeholder="اسمك الكامل" />
          </div>
          <div>
            <label className="text-sm font-bold text-[#5c4326] mb-1 block">رقم الهاتف</label>
            <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-samaq-blue" placeholder="05xxxxxxxx" dir="ltr" />
          </div>
          <div>
            <label className="text-sm font-bold text-[#5c4326] mb-2 block">طريقة الاستلام</label>
            <div className="flex gap-2">
              <button onClick={() => setMethod("delivery")} className={`flex-1 rounded-xl py-2.5 text-sm font-bold border ${method === "delivery" ? "bg-samaq-blue text-white border-samaq-blue" : "border-gray-200 text-gray-600"}`}>توصيل</button>
              <button onClick={() => setMethod("pickup")} className={`flex-1 rounded-xl py-2.5 text-sm font-bold border ${method === "pickup" ? "bg-samaq-blue text-white border-samaq-blue" : "border-gray-200 text-gray-600"}`}>استلام من الفرع</button>
            </div>
          </div>
          {method === "delivery" && (
            <div>
              <label className="text-sm font-bold text-[#5c4326] mb-1 block">العنوان</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-samaq-blue" placeholder="الحي، الشارع، أقرب معلم" />
            </div>
          )}
          <div>
            <label className="text-sm font-bold text-[#5c4326] mb-1 block">ملاحظات (اختياري)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-samaq-blue" />
          </div>

          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

          <div className="flex items-center justify-between border-t pt-3">
            <span className="font-bold text-[#5c4326]">الإجمالي</span>
            <span className="font-extrabold text-samaq-green text-lg">{formatPrice(cartTotal(cart), settings.currency)}</span>
          </div>

          <button disabled={sending} onClick={handleSubmit} className="bg-samaq-green disabled:opacity-60 text-white font-extrabold rounded-2xl py-3 flex items-center justify-center gap-2 hover:brightness-110 transition">
            <IconWhatsapp className="w-5 h-5" />
            {sending ? "جارِ الإرسال..." : "إرسال الطلب عبر واتساب"}
          </button>
        </div>
      </div>
    </div>
  );
}
