// ============================================================
// SAMAQ — JSX Loader
// بيجيب ملفات الـ Components، يحوّلها بـ Babel standalone (classic
// runtime عشان يفضل يستخدم متغير React العام بدل import تلقائي)،
// وبعدين ينفذها بالترتيب. آخر ملف (app.jsx) هو اللي بيعمل mount
// للتطبيق، فمهم إن الترتيب يفضل زي ما هو.
// ============================================================
(function () {
  const files = [
    "js/icons.jsx",
    "js/imageUploader.jsx",
    "js/menu.jsx",
    "js/cart.jsx",
    "js/layout.jsx",
    "js/dashboard.jsx",
    "js/app.jsx",
  ];

  async function loadAll() {
    for (const file of files) {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`تعذر تحميل ${file} (HTTP ${res.status})`);
      const source = await res.text();
      const { code } = Babel.transform(source, {
        presets: [["react", { runtime: "classic" }]],
        filename: file,
      });
      // ننفذ الكود المحوّل في الـ scope العام (زي سكريبت عادي)
      (0, eval)(code);
    }
  }

  loadAll().catch((err) => {
    console.error(err);
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML =
        '<div style="padding:40px;text-align:center;font-family:sans-serif;color:#b00020">' +
        "حصل خطأ أثناء تحميل التطبيق: " + (err && err.message ? err.message : err) +
        "</div>";
    }
  });
})();
