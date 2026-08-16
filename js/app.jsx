// ============================================================
// SAMAQ — Root App
// كل البيانات بتتحمّل من Google Sheets عن طريق Apps Script أول ما
// الصفحة تفتح. مفيش أي بيانات محفوظة على الجهاز نفسه.
// ============================================================

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#f7eed7]">
      <img src="assets/logo.png" alt="" className="w-16 h-16 opacity-80 animate-pulse" />
      <p className="text-sm text-gray-500 font-bold">جارِ تحميل المنيو...</p>
    </div>
  );
}

function ErrorScreen({ message, onRetry }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#f7eed7] px-6 text-center">
      <p className="text-red-500 font-bold">تعذر تحميل البيانات</p>
      <p className="text-xs text-gray-400 max-w-xs">{message}</p>
      <button onClick={onRetry} className="bg-samaq-green text-white text-sm font-bold rounded-full px-5 py-2 mt-2">
        إعادة المحاولة
      </button>
    </div>
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
  const [checkoutOpen, setCheckoutOpen] = useState(false);

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
      <Header cart={cart} onOpenCart={() => setCartOpen(true)} />
      <MenuPage categories={categories} items={items} settings={settings} cart={cart} setCart={setCart} />
      <Footer settings={settings} />
      <FloatingCartButton cart={cart} currency={settings.currency} onOpen={() => setCartOpen(true)} />

      {cartOpen && (
        <CartDrawer
          cart={cart}
          setCart={setCart}
          currency={settings.currency}
          onClose={() => setCartOpen(false)}
          onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
        />
      )}

      {checkoutOpen && (
        <CheckoutForm
          cart={cart}
          setCart={setCart}
          settings={settings}
          onClose={() => setCheckoutOpen(false)}
          onDone={() => { setCheckoutOpen(false); alert("تم إرسال الطلب عبر واتساب بنجاح!"); }}
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
