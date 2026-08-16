// ============================================================
// روعة المنقوشة — Root App
// كل البيانات بتتحمّل من Google Sheets عن طريق Apps Script أول ما
// الصفحة تفتح. مفيش أي بيانات محفوظة على الجهاز نفسه.
// ============================================================

function LoadingScreen() {
  return (
    <div className="menu-loading">
      <div className="spinner"></div>
      <p>جارِ تحميل المنيو...</p>
    </div>
  );
}

function ErrorScreen({ message, onRetry }) {
  return (
    <div className="menu-error">
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
      <h3>تعذر تحميل المنيو حاليًا</h3>
      <p style={{ fontSize: "0.85rem", maxWidth: "22rem" }}>{message}</p>
      <button onClick={onRetry}>إعادة المحاولة</button>
    </div>
  );
}

function Toast({ text }) {
  return (
    <div className={`toast ${text ? "show" : ""}`}>
      <span>✅</span>
      <span>{text}</span>
    </div>
  );
}

function ScrollTopButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      className={`scroll-top no-print ${visible ? "visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="العودة للأعلى"
    >
      ↑
    </button>
  );
}

// هل الرابط فيه ?admin؟ (ده الطريقة الوحيدة اللي بتظهر بيها لوحة
// التحكم — مفيش أي زرار أو أيقونة ظاهرة للعميل في صفحة المنيو خالص)
function isAdminEntry() {
  return new URLSearchParams(window.location.search).has("admin");
}

function App() {
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState({});

  const [view, setView] = useState("menu"); // "menu" | "dashboard"
  const [showLogin, setShowLogin] = useState(isAdminEntry);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toastText, setToastText] = useState("");

  function load() {
    setStatus("loading");
    DataService.bootstrap()
      .then((data) => {
        setCategories(data.categories);
        setItems(data.items);
        setSettings(data.settings);
        setStatus("ready");
      })
      .catch((err) => {
        setErrorMsg(err.message || "تأكد من اتصال الإنترنت وحاول تاني");
        setStatus("error");
      });
  }

  useEffect(() => { load(); }, []);

  function showToast(text) {
    setToastText(text);
    setTimeout(() => setToastText(""), 3000);
  }

  // بيضيف صنف للسلة، وبيدمجه مع صنف موجود بنفس الاسم والملاحظات
  // (زي ما بيحصل بالظبط في المنيو المرجعي) بدل ما يعمل سطر مكرر
  function addToCart(item, payload) {
    setCart((prev) => {
      const idx = prev.findIndex((l) => l.name === payload.displayName && l.notes === payload.notes);
      if (idx > -1) {
        const next = [...prev];
        const qty = next[idx].qty + 1;
        next[idx] = { ...next[idx], qty, totalPrice: next[idx].unitPrice * qty };
        return next;
      }
      return [
        ...prev,
        {
          lineId: `${item.id}_${Date.now()}`,
          itemId: item.id,
          name: payload.displayName,
          unitPrice: payload.unitPrice,
          qty: 1,
          notes: payload.notes || "",
          optionsSummary: payload.optionsSummary || [],
          totalPrice: payload.unitPrice,
        },
      ];
    });
    showToast("تم إضافة الصنف للسلة");
  }

  if (status === "loading") return <LoadingScreen />;
  if (status === "error") return <ErrorScreen message={errorMsg} onRetry={load} />;

  if (view === "dashboard") {
    return (
      <Dashboard
        categories={categories} setCategories={setCategories}
        items={items} setItems={setItems}
        settings={settings} setSettings={setSettings}
        onExit={() => setView("menu")}
      />
    );
  }

  return (
    <div>
      <Header />
      <MenuPage categories={categories} items={items} settings={settings} onAdd={addToCart} />
      <Footer settings={settings} />
      <FloatingCartButton cart={cart} currency={settings.currency} onOpen={() => setCartOpen(true)} />
      <ScrollTopButton />
      <Toast text={toastText} />

      {cartOpen && (
        <CartModal
          cart={cart}
          setCart={setCart}
          settings={settings}
          onClose={() => setCartOpen(false)}
          onSent={() => {
            setCartOpen(false);
            showToast("تم إرسال الطلب عبر واتساب بنجاح!");
          }}
        />
      )}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setShowLogin(false);
            setView("dashboard");
            // ننضّف الرابط من ?admin بعد الدخول عشان يفضل مظهره عادي
            window.history.replaceState(null, "", window.location.pathname);
          }}
        />
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
