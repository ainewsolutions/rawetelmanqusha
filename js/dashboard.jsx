// ============================================================
// SAMAQ — Dashboard (لوحة تحكم صاحب المطعم)
// كل التعديلات هنا بتتحفظ فورًا في Google Sheets عن طريق الـ API،
// مفيش أي تخزين محلي على الجهاز.
// ============================================================

function isToday(dateStr) {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  } catch (e) {
    return false;
  }
}
function isThisWeek(dateStr) {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = (now - d) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  } catch (e) {
    return false;
  }
}

// ---------------- تسجيل الدخول ----------------
function LoginModal({ onClose, onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const res = await DataService.login(password);
      if (res.ok) onSuccess();
      else setError("كلمة المرور غير صحيحة");
    } catch (err) {
      setError("تعذر الاتصال بالسيرفر: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 pop-in" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-extrabold text-[#5c4326] mb-1">دخول لوحة التحكم</h3>
        <p className="text-xs text-gray-400 mb-4">لصاحب المطعم فقط</p>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="كلمة المرور"
          className="w-full border border-gray-200 rounded-xl p-2.5 text-sm mb-2"
          dir="ltr"
        />
        {error && <p className="text-red-500 text-xs font-bold mb-2">{error}</p>}
        <div className="flex gap-2 mt-3">
          <button disabled={loading} onClick={submit} className="flex-1 bg-samaq-green disabled:opacity-60 text-white rounded-xl py-2.5 font-bold">
            {loading ? "..." : "دخول"}
          </button>
          <button onClick={onClose} className="flex-1 border rounded-xl py-2.5 font-bold">إلغاء</button>
        </div>
      </div>
    </div>
  );
}

// ---------------- نظرة عامة ----------------
function DashboardOverview({ orders, items }) {
  const todayOrders = orders.filter((o) => isToday(o.createdAt));
  const weekOrders = orders.filter((o) => isThisWeek(o.createdAt));
  const salesToday = todayOrders.reduce((s, o) => s + Number(o.total || 0), 0);
  const salesWeek = weekOrders.reduce((s, o) => s + Number(o.total || 0), 0);

  const itemCount = {};
  orders.forEach((o) => {
    (o.itemsSummary || "").split("،").forEach((seg) => {
      const name = seg.split("×")[0].trim();
      if (!name) return;
      itemCount[name] = (itemCount[name] || 0) + 1;
    });
  });
  const top = Object.entries(itemCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCount = top.length ? top[0][1] : 1;

  const cards = [
    { label: "طلبات اليوم", value: todayOrders.length },
    { label: "مبيعات اليوم", value: `${salesToday.toFixed(2)} ر.س` },
    { label: "مبيعات الأسبوع", value: `${salesWeek.toFixed(2)} ر.س` },
    { label: "إجمالي الأصناف", value: items.length },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs text-gray-500 mb-1">{c.label}</p>
            <p className="text-xl font-extrabold text-[#5c4326]">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <h3 className="font-bold text-[#5c4326] mb-3">الأكثر مبيعًا</h3>
        {top.length === 0 && <p className="text-sm text-gray-400">لا توجد طلبات بعد</p>}
        <div className="flex flex-col gap-2">
          {top.map(([name, count]) => (
            <div key={name} className="flex items-center gap-3">
              <span className="text-xs w-32 truncate">{name}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-samaq-green h-full rounded-full" style={{ width: `${(count / maxCount) * 100}%` }}></div>
              </div>
              <span className="text-xs text-gray-500 w-5 text-left">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------- التصنيفات والأصناف ----------------
function DashboardCategories({ categories, setCategories, items, setItems, selectedCat, setSelectedCat }) {
  const [dragId, setDragId] = useState(null);
  const [editingCat, setEditingCat] = useState(null); // {id?, name, bannerImage}
  const [saving, setSaving] = useState(false);

  async function persistCats(list) {
    setSaving(true);
    try {
      const res = await DataService.saveCategories(list);
      setCategories(res.categories);
    } catch (err) {
      alert("تعذر الحفظ في جوجل شيت: " + err.message);
    } finally {
      setSaving(false);
    }
  }
  async function persistItems(list) {
    setSaving(true);
    try {
      const res = await DataService.saveMenu(list);
      setItems(res.items);
    } catch (err) {
      alert("تعذر الحفظ في جوجل شيت: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  function reorder(list, fromId, toId) {
    const sorted = [...list].sort((a, b) => a.order - b.order);
    const fromIdx = sorted.findIndex((x) => x.id === fromId);
    const toIdx = sorted.findIndex((x) => x.id === toId);
    if (fromIdx === -1 || toIdx === -1) return list;
    const [moved] = sorted.splice(fromIdx, 1);
    sorted.splice(toIdx, 0, moved);
    return sorted.map((x, i) => ({ ...x, order: i + 1 }));
  }

  function onDropCategory(targetId) {
    if (!dragId || dragId === targetId) return;
    persistCats(reorder(categories, dragId, targetId));
    setDragId(null);
  }

  function toggleCatActive(id) {
    persistCats(categories.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  }
  function deleteCategory(id) {
    if (!confirm("هل تريد حذف التصنيف؟ سيتم حذف كل الأصناف بداخله أيضًا.")) return;
    persistCats(categories.filter((c) => c.id !== id));
    persistItems(items.filter((i) => i.categoryId !== id));
    if (selectedCat === id) setSelectedCat(null);
  }
  function saveCategory() {
    if (!editingCat.name.trim()) return;
    if (editingCat.id) {
      persistCats(categories.map((c) => (c.id === editingCat.id ? { ...c, name: editingCat.name, bannerImage: editingCat.bannerImage } : c)));
    } else {
      persistCats([...categories, { id: "", name: editingCat.name, bannerImage: editingCat.bannerImage || "", order: categories.length + 1, active: true }]);
    }
    setEditingCat(null);
  }

  const catItems = selectedCat ? items.filter((i) => i.categoryId === selectedCat) : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-[#5c4326]">التصنيفات {saving && <span className="text-[10px] text-gray-400 font-normal">(جارِ الحفظ...)</span>}</h3>
          <button onClick={() => setEditingCat({ name: "", bannerImage: "" })} className="text-xs bg-samaq-green text-white rounded-full px-3 py-1.5 font-bold">+ تصنيف جديد</button>
        </div>
        {editingCat && (
          <div className="border border-gray-100 rounded-xl p-3 mb-3 flex flex-col gap-2">
            <input autoFocus value={editingCat.name} onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })} placeholder="اسم التصنيف" className="border border-gray-200 rounded-lg p-2 text-sm" />
            <ImageUploader
              label="بانر التصنيف (صورة عريضة تظهر أعلى المنيو)"
              aspect="wide"
              value={editingCat.bannerImage}
              onChange={(url) => setEditingCat({ ...editingCat, bannerImage: url })}
            />
            <div className="flex gap-2">
              <button onClick={saveCategory} className="flex-1 bg-samaq-blue text-white text-xs py-2 rounded-lg font-bold">حفظ</button>
              <button onClick={() => setEditingCat(null)} className="flex-1 text-xs py-2 rounded-lg border">إلغاء</button>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {categories.sort((a, b) => a.order - b.order).map((c) => (
            <div
              key={c.id}
              draggable
              onDragStart={() => setDragId(c.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDropCategory(c.id)}
              onClick={() => setSelectedCat(c.id)}
              className={`flex items-center gap-2 border rounded-xl p-2.5 cursor-pointer ${selectedCat === c.id ? "border-samaq-blue bg-blue-50" : "border-gray-100"}`}
            >
              <span className="drag-handle text-gray-400"><IconDrag className="w-4 h-4" /></span>
              {c.bannerImage && <img src={c.bannerImage} className="w-8 h-8 rounded-lg object-cover" alt="" />}
              <span className="flex-1 text-sm font-bold">{c.name}</span>
              <button onClick={(e) => { e.stopPropagation(); setEditingCat({ id: c.id, name: c.name, bannerImage: c.bannerImage }); }} className="text-gray-400 hover:text-samaq-blue"><IconEdit className="w-4 h-4" /></button>
              <label className="inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" checked={c.active} onChange={() => toggleCatActive(c.id)} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-checked:bg-samaq-green rounded-full relative transition">
                  <div className="absolute top-0.5 bg-white w-4 h-4 rounded-full transition-all" style={{ right: c.active ? "18px" : "2px" }}></div>
                </div>
              </label>
              <button onClick={(e) => { e.stopPropagation(); deleteCategory(c.id); }} className="text-red-300 hover:text-red-500"><IconTrash className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      <DashboardItems categoryId={selectedCat} items={catItems} allItems={items} setItems={persistItems} />
    </div>
  );
}

function emptyItem(categoryId, order) {
  return { id: "", categoryId, name: "", description: "", price: 0, image: "", options: [], available: true, order };
}

// يحوّل بنية options الكاملة لقائمة بسيطة {label, priceDelta} تتعامل معاها الواجهة بسهولة
function optionsToAddons(options) {
  if (!options || !options.length || !options[0].choices) return [];
  return options[0].choices.map((c) => ({ label: c.label, priceDelta: c.priceDelta }));
}
function optionsMeta(options) {
  if (!options || !options.length) return { required: false, multiple: true };
  return { required: !!options[0].required, multiple: options[0].multiple !== false };
}
function addonsToOptions(addons, required, multiple) {
  const valid = (addons || []).filter((a) => a.label && a.label.trim());
  if (!valid.length) return [];
  return [{
    id: "addons", title: required ? "النوع" : "إضافات", required: !!required, multiple: multiple !== false,
    choices: valid.map((a, i) => ({ id: "c" + i, label: a.label.trim(), priceDelta: parseFloat(a.priceDelta) || 0 })),
  }];
}

function DashboardItems({ categoryId, items, allItems, setItems }) {
  const [dragId, setDragId] = useState(null);
  const [editing, setEditing] = useState(null);

  if (!categoryId) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-center text-sm text-gray-400">
        اختر تصنيفًا من اليسار لإدارة أصنافه
      </div>
    );
  }

  function persist(newList) {
    const others = allItems.filter((i) => i.categoryId !== categoryId);
    setItems([...others, ...newList]);
  }
  function reorder(list, fromId, toId) {
    const sorted = [...list].sort((a, b) => a.order - b.order);
    const fromIdx = sorted.findIndex((x) => x.id === fromId);
    const toIdx = sorted.findIndex((x) => x.id === toId);
    if (fromIdx === -1 || toIdx === -1) return list;
    const [moved] = sorted.splice(fromIdx, 1);
    sorted.splice(toIdx, 0, moved);
    return sorted.map((x, i) => ({ ...x, order: i + 1 }));
  }
  function onDrop(targetId) {
    if (!dragId || dragId === targetId) return;
    persist(reorder(items, dragId, targetId));
    setDragId(null);
  }
  function toggleAvailable(id) {
    persist(items.map((i) => (i.id === id ? { ...i, available: !i.available } : i)));
  }
  function deleteItem(id) {
    if (!confirm("حذف هذا الصنف؟")) return;
    persist(items.filter((i) => i.id !== id));
  }
  function startAdd() {
    setEditing({ ...emptyItem(categoryId, items.length + 1), addons: [], required: false, multiple: true });
  }
  function saveEdit() {
    if (!editing.name.trim()) return;
    const { addons, required, multiple, ...rest } = editing;
    const itemToSave = { ...rest, options: addonsToOptions(addons, required, multiple) };
    const exists = items.some((i) => i.id && i.id === itemToSave.id);
    const next = exists ? items.map((i) => (i.id === itemToSave.id ? itemToSave : i)) : [...items, itemToSave];
    persist(next);
    setEditing(null);
  }
  function updateAddon(index, field, value) {
    setEditing((prev) => {
      const addons = [...(prev.addons || [])];
      addons[index] = { ...addons[index], [field]: value };
      return { ...prev, addons };
    });
  }
  function addAddonRow() {
    setEditing((prev) => ({ ...prev, addons: [...(prev.addons || []), { label: "", priceDelta: 0 }] }));
  }
  function removeAddonRow(index) {
    setEditing((prev) => ({ ...prev, addons: (prev.addons || []).filter((_, i) => i !== index) }));
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-[#5c4326]">أصناف التصنيف</h3>
        <button onClick={startAdd} className="text-xs bg-samaq-green text-white rounded-full px-3 py-1.5 font-bold">+ صنف جديد</button>
      </div>

      <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto">
        {items.sort((a, b) => (a.order || 0) - (b.order || 0)).map((it) => (
          <div
            key={it.id || it.name}
            draggable
            onDragStart={() => setDragId(it.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(it.id)}
            className="flex items-center gap-2 border border-gray-100 rounded-xl p-2.5"
          >
            <span className="drag-handle text-gray-400"><IconDrag className="w-4 h-4" /></span>
            {it.image && <img src={it.image} className="w-9 h-9 rounded-lg object-cover" alt="" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{it.name || "(بدون اسم)"}</p>
              <p className="text-xs text-gray-400">
                {Number(it.price).toFixed(2)} ر.س
                {it.options && it.options.length > 0 && it.options[0].choices?.length > 0 && (
                  <span className="text-samaq-blue font-bold"> · {it.options[0].choices.length} إضافات</span>
                )}
              </p>
            </div>
            <button onClick={() => setEditing({ ...it, addons: optionsToAddons(it.options), ...optionsMeta(it.options) })} className="text-gray-400 hover:text-samaq-blue"><IconEdit className="w-4 h-4" /></button>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={it.available} onChange={() => toggleAvailable(it.id)} className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 peer-checked:bg-samaq-green rounded-full relative transition">
                <div className="absolute top-0.5 bg-white w-4 h-4 rounded-full transition-all" style={{ right: it.available ? "18px" : "2px" }}></div>
              </div>
            </label>
            <button onClick={() => deleteItem(it.id)} className="text-red-300 hover:text-red-500"><IconTrash className="w-4 h-4" /></button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-400 text-center py-6">لا يوجد أصناف بعد في هذا التصنيف</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 fade-in" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-5 max-h-[90vh] overflow-y-auto pop-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-extrabold text-[#5c4326] mb-4">بيانات الصنف</h3>
            <div className="flex flex-col gap-3">
              <ImageUploader
                aspect="square"
                value={editing.image}
                onChange={(url) => setEditing({ ...editing, image: url })}
              />
              <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="اسم الصنف" className="border border-gray-200 rounded-lg p-2.5 text-sm" />
              <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="الوصف (اختياري)" rows={2} className="border border-gray-200 rounded-lg p-2.5 text-sm" />
              <input type="number" step="0.01" value={editing.price} onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) || 0 })} placeholder="السعر" className="border border-gray-200 rounded-lg p-2.5 text-sm" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.available} onChange={(e) => setEditing({ ...editing, available: e.target.checked })} />
                متاح للطلب
              </label>

              <div className="border-t pt-3">
                <label className="text-xs font-bold text-gray-500 mb-2 block">
                  خيارات إضافية للصنف (إضافات اختيارية زي شوي/قلي/متبل، أو أنواع إجبارية زي سمك/روبيان)
                </label>

                <div className="flex flex-col gap-1.5 mb-3 bg-gray-50 rounded-xl p-2.5">
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={!!editing.required}
                      onChange={(e) => setEditing({ ...editing, required: e.target.checked })}
                    />
                    اختيار إجباري (العميل لازم يختار قبل ما يضيف للسلة) — استخدمها لو الأسعار مختلفة فعليًا حسب النوع
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={editing.multiple !== false}
                      onChange={(e) => setEditing({ ...editing, multiple: e.target.checked })}
                    />
                    يسمح باختيار أكثر من خيار مع بعض (سيبها مفعّلة للإضافات، شيلها للأنواع)
                  </label>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-[11px] text-gray-400 -mt-1">
                    السعر هنا هو <b>الفرق</b> عن السعر الأساسي للصنف، مش السعر الكامل. مثال: لو السعر
                    الأساسي 22.95 والنوع التاني سعره الكامل 36.95، اكتب هنا 14 بس (الفرق).
                  </p>
                  {(editing.addons || []).map((a, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        value={a.label}
                        onChange={(e) => updateAddon(i, "label", e.target.value)}
                        placeholder="اسم الخيار (شوي / برياني سمك)"
                        className="flex-1 border border-gray-200 rounded-lg p-2 text-sm"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={a.priceDelta}
                        onChange={(e) => updateAddon(i, "priceDelta", e.target.value)}
                        placeholder="السعر"
                        className="w-20 border border-gray-200 rounded-lg p-2 text-sm"
                      />
                      <button onClick={() => removeAddonRow(i)} className="text-red-300 hover:text-red-500 shrink-0">
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={addAddonRow} className="text-xs bg-samaq-blue text-white rounded-full px-3 py-1.5 font-bold mt-2">
                  + إضافة خيار جديد
                </button>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={saveEdit} className="flex-1 bg-samaq-green text-white rounded-xl py-2.5 font-bold">حفظ</button>
              <button onClick={() => setEditing(null)} className="flex-1 border rounded-xl py-2.5 font-bold">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- الطلبات ----------------
// ---------------- الإعدادات ----------------
function DashboardSettings({ settings, setSettings }) {
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);

  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await DataService.saveSettings(form);
      setSettings(res.settings);
      alert("تم حفظ الإعدادات في جوجل شيت");
    } catch (err) {
      alert("تعذر الحفظ: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function changePass() {
    setPassMsg("");
    if (!curPass || !newPass) { setPassMsg("املأ كل الخانات"); return; }
    if (newPass !== confirmPass) { setPassMsg("كلمة المرور الجديدة غير متطابقة"); return; }
    setPassLoading(true);
    try {
      const res = await DataService.changePassword(curPass, newPass);
      if (res.ok) {
        setPassMsg("تم تغيير كلمة المرور بنجاح");
        setCurPass(""); setNewPass(""); setConfirmPass("");
      }
    } catch (err) {
      setPassMsg(err.message);
    } finally {
      setPassLoading(false);
    }
  }

  function setSocial(key, val) {
    setForm({ ...form, ["social" + key]: val });
  }

  const field = (label, value, onChange, dir) => (
    <div>
      <label className="text-xs font-bold text-gray-500 mb-1 block">{label}</label>
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} dir={dir || "rtl"} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm" />
    </div>
  );

  const textareaField = (label, value, onChange, hint) => (
    <div>
      <label className="text-xs font-bold text-gray-500 mb-1 block">{label}</label>
      {hint && <p className="text-[11px] text-gray-400 mb-1">{hint}</p>}
      <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} dir="ltr" rows={4} className="w-full border border-gray-200 rounded-lg p-2.5 text-xs font-mono" />
    </div>
  );

  const selectField = (label, value, onChange, options) => (
    <div>
      <label className="text-xs font-bold text-gray-500 mb-1 block">{label}</label>
      <select value={value || options[0].value} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white">
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 max-w-lg">
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3">
        <h3 className="font-bold text-[#5c4326] mb-1">شكل عرض المنيو</h3>
        {selectField(
          "طريقة عرض الأصناف للعملاء",
          form.menuLayout,
          (v) => setForm({ ...form, menuLayout: v }),
          [
            { value: "grid", label: "شبكة (الشكل الحالي — صورة كبيرة فوق كل صنف)" },
            { value: "list", label: "قائمة (صورة دائرية صغيرة بجانب الاسم)" },
          ]
        )}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3">
        <h3 className="font-bold text-[#5c4326] mb-1">الإعدادات العامة</h3>
        {field("رقم الواتساب لاستقبال الطلبات (بدون +)", form.whatsappNumber, (v) => setForm({ ...form, whatsappNumber: v }), "ltr")}
        {field("رقم الهاتف (يظهر في أسفل الصفحة)", form.phone, (v) => setForm({ ...form, phone: v }), "ltr")}
        {field("العنوان (يظهر في أسفل الصفحة)", form.address, (v) => setForm({ ...form, address: v }), "rtl")}
        {field("رابط خرائط جوجل", form.googleMapsUrl, (v) => setForm({ ...form, googleMapsUrl: v }), "ltr")}
        {field("رابط تقييم جوجل (كارت \"قيّمنا على جوجل\")", form.googleReviewUrl, (v) => setForm({ ...form, googleReviewUrl: v }), "ltr")}
        {textareaField(
          "كود تضمين تقييمات جوجل (Embed Code)",
          form.googleReviewsEmbed,
          (v) => setForm({ ...form, googleReviewsEmbed: v }),
          "من خدمة مجانية زي Elfsight أو EmbedSocial: اربط صفحة نشاطك التجاري على جوجل مرة واحدة هناك، وهما بيوفروا لك كود تضمين، الصقه هنا وهيظهر تلقائي ويتحدث لوحده من غير أي تدخل منك."
        )}
        {field("رابط Google Play", form.googlePlayUrl, (v) => setForm({ ...form, googlePlayUrl: v }), "ltr")}
        {field("رابط App Store", form.appStoreUrl, (v) => setForm({ ...form, appStoreUrl: v }), "ltr")}
        {field("واتساب (سوشيال)", form.socialWhatsapp, (v) => setSocial("Whatsapp", v), "ltr")}
        {field("فيسبوك", form.socialFacebook, (v) => setSocial("Facebook", v), "ltr")}
        {field("تيك توك", form.socialTiktok, (v) => setSocial("Tiktok", v), "ltr")}
        {field("انستجرام", form.socialInstagram, (v) => setSocial("Instagram", v), "ltr")}
        {field("إكس / تويتر", form.socialTwitter, (v) => setSocial("Twitter", v), "ltr")}
        <button disabled={saving} onClick={save} className="bg-samaq-green disabled:opacity-60 text-white rounded-xl py-2.5 font-bold mt-2">
          {saving ? "جارِ الحفظ..." : "حفظ الإعدادات"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3">
        <h3 className="font-bold text-[#5c4326] mb-1">تغيير كلمة المرور</h3>
        <input type="password" value={curPass} onChange={(e) => setCurPass(e.target.value)} placeholder="كلمة المرور الحالية" className="border border-gray-200 rounded-lg p-2.5 text-sm" dir="ltr" />
        <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="كلمة المرور الجديدة" className="border border-gray-200 rounded-lg p-2.5 text-sm" dir="ltr" />
        <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="تأكيد كلمة المرور الجديدة" className="border border-gray-200 rounded-lg p-2.5 text-sm" dir="ltr" />
        {passMsg && <p className="text-xs font-bold text-samaq-blue">{passMsg}</p>}
        <button disabled={passLoading} onClick={changePass} className="bg-samaq-blue disabled:opacity-60 text-white rounded-xl py-2.5 font-bold">
          {passLoading ? "..." : "تغيير كلمة المرور"}
        </button>
      </div>
    </div>
  );
}

// ---------------- اللوحة نفسها ----------------
function Dashboard({ categories, setCategories, items, setItems, settings, setSettings, onExit }) {
  const [tab, setTab] = useState("overview");
  const [selectedCat, setSelectedCat] = useState(categories[0]?.id || null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    DataService.getOrders()
      .then(setOrders)
      .catch((err) => console.warn("تعذر تحميل الطلبات:", err));
  }, []);

  const tabs = [
    { id: "overview", label: "نظرة عامة" },
    { id: "menu", label: "الأصناف والتصنيفات" },
    { id: "settings", label: "الإعدادات" },
  ];

  return (
    <div className="min-h-screen bg-[#f7eed7]">
      <div className="samaq-gradient-header text-[#4a3b2c] px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onExit} className="bg-white/15 hover:bg-white/25 rounded-full p-2"><IconChevronLeft className="w-5 h-5 rotate-180" /></button>
          <h1 className="font-extrabold">لوحة تحكم روعة المنقوشة</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-full text-sm font-bold shrink-0 ${tab === t.id ? "bg-samaq-blue text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && <DashboardOverview orders={orders} items={items} />}
        {tab === "menu" && (
          <DashboardCategories
            categories={categories} setCategories={setCategories}
            items={items} setItems={setItems}
            selectedCat={selectedCat} setSelectedCat={setSelectedCat}
          />
        )}
        {tab === "settings" && <DashboardSettings settings={settings} setSettings={setSettings} />}
      </div>
    </div>
  );
}
