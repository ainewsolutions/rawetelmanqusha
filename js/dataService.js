// ============================================================
// SAMAQ — DataService (API client)
// كل البيانات (منيو، تصنيفات، إعدادات، طلبات، صور) بتتقرأ وتتكتب
// من/لـ Google Sheets وGoogle Drive مباشرة عن طريق Apps Script.
// مفيش أي تخزين على جهاز المستخدم (لا localStorage ولا غيره).
// ============================================================

// ============================================================
// SAMAQ — DataService (API client)
// القراءة (المنيو اللي بيشوفه العميل) بتحصل مباشرة من جوجل شيت —
// سريعة وثابتة، من غير Apps Script خالص، عشان العميل ميستناش.
// الكتابة (لوحة التحكم: حفظ أصناف/إعدادات/رفع صور/تسجيل الطلبات)
// لسه بتعدي على Apps Script زي الأول، لأنها مش حاجة العميل بيستناها.
// مفيش أي تخزين على جهاز المستخدم (لا localStorage ولا غيره).
// ============================================================

// بيحوّل صف CSV (نص) لمصفوفة قيم — بيتعامل صح مع الفواصل والاقتباسات
// جوه النصوص العربية (زي "راهيه شاورما + بطاطس + كينزا")
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field); field = "";
    } else if (ch === "\n") {
      row.push(field); field = "";
      rows.push(row); row = [];
    } else if (ch === "\r") {
      // تجاهل، \n هو اللي بيقفل الصف
    } else {
      field += ch;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((c) => c !== ""));
}

// بيجيب شيت معيّن (بالاسم) كمصفوفة كائنات، معتمدًا على صف العناوين
async function fetchSheetAsObjects(sheetName) {
  const url =
    `https://docs.google.com/spreadsheets/d/${SAMAQ_CONFIG.sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}&_=${Date.now()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`تعذر قراءة شيت ${sheetName} (HTTP ${res.status})`);
  const text = await res.text();
  const rows = parseCsv(text);
  if (!rows.length) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((r) => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = r[i] !== undefined ? r[i] : ""; });
    return obj;
  });
}

function toBool(v) {
  const s = String(v).trim().toUpperCase();
  return s === "TRUE" || s === "1" || s === "YES";
}

function toOptions(v) {
  if (!v) return [];
  try {
    const parsed = JSON.parse(v);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

const DataService = {
  // محاولة جلب أي رابط مع إعادة محاولة تلقائية عند فشل مؤقت في الشبكة
  async _fetchWithRetry(url, options, retries) {
    retries = retries == null ? 2 : retries;
    let lastErr;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error("HTTP " + res.status);
        return await res.json();
      } catch (err) {
        lastErr = err;
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
        }
      }
    }
    throw lastErr;
  },

  // تحميل كل حاجة محتاجها الصفحة الرئيسية دفعة واحدة — مباشرة من
  // جوجل شيت (مش عن طريق Apps Script) عشان تبقى سريعة وثابتة.
  async bootstrap() {
    const [rawCats, rawItems, rawSettings] = await Promise.all([
      fetchSheetAsObjects("Categories"),
      fetchSheetAsObjects("Items"),
      fetchSheetAsObjects("Settings"),
    ]);

    const categories = rawCats.map((c) => ({
      id: String(c.id || ""),
      name: String(c.name || ""),
      bannerImage: String(c.bannerImage || ""),
      order: Number(c.order) || 0,
      active: toBool(c.active),
    }));

    const items = rawItems.map((it) => ({
      id: String(it.id || ""),
      categoryId: String(it.categoryId || ""),
      name: String(it.name || ""),
      description: String(it.description || ""),
      price: Number(it.price) || 0,
      image: String(it.image || ""),
      options: toOptions(it.options),
      available: toBool(it.available),
      order: Number(it.order) || 0,
    }));

    const settings = {};
    rawSettings.forEach((r) => { settings[String(r.key)] = r.value === undefined ? "" : String(r.value); });

    return { categories, items, settings };
  },

  async getOrders() {
    const json = await DataService._fetchWithRetry(`${SAMAQ_CONFIG.sheetsApiUrl}?action=orders`);
    if (!json.ok) throw new Error(json.error || "تعذر تحميل الطلبات");
    return json.data;
  },

  async _post(action, payload) {
    const json = await DataService._fetchWithRetry(SAMAQ_CONFIG.sheetsApiUrl, {
      method: "POST",
      // text/plain عشان نتفادى CORS preflight (Apps Script مش بيرد على OPTIONS)
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(Object.assign({ action }, payload)),
    }, 1);
    if (!json.ok) throw new Error(json.error || "حصل خطأ غير متوقع");
    return json;
  },

  addOrder(order) {
    return DataService._post("addOrder", { order });
  },
  updateOrderStatus(orderId, status) {
    return DataService._post("updateOrderStatus", { orderId, status });
  },
  saveCategories(categories) {
    return DataService._post("saveCategories", { categories });
  },
  saveMenu(items) {
    return DataService._post("saveMenu", { items });
  },
  saveSettings(settings) {
    return DataService._post("saveSettings", { settings });
  },
  login(password) {
    return DataService._post("login", { password });
  },
  changePassword(currentPassword, newPassword) {
    return DataService._post("changePassword", { currentPassword, newPassword });
  },

  // بيرفع الصورة (بعد تصغيرها) على Drive ويرجع الرابط المباشر
  async uploadImage(file) {
    const { base64, mimeType } = await resizeImageToBase64(file);
    const result = await DataService._post("uploadImage", {
      fileName: file.name,
      mimeType,
      base64Data: base64,
    });
    return result.url;
  },

  // بتدور في فولدر الصور على Drive عن أي صورة اسمها مطابق لاسم
  // صنف موجود في المنيو، وبتربطهم تلقائيًا من غير رفع يدوي
  matchImages() {
    return DataService._post("matchImages", {});
  },
};
