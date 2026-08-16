// ============================================================
// SAMAQ — Icon components (inline SVG, no external icon library)
// ============================================================
var useState = React.useState;
var useEffect = React.useEffect;
var useMemo = React.useMemo;
var useRef = React.useRef;

function IconWhatsapp({ className }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor">
      <path d="M16.02 3C9.4 3 4 8.38 4 15c0 2.28.63 4.42 1.72 6.25L4 29l7.94-1.66A11.9 11.9 0 0 0 16.02 27C22.65 27 28 21.62 28 15S22.65 3 16.02 3zm0 21.7c-1.98 0-3.86-.55-5.46-1.5l-.39-.23-4.7.98.99-4.58-.25-.4a9.62 9.62 0 0 1-1.5-5.17c0-5.35 4.35-9.7 9.71-9.7 5.35 0 9.7 4.35 9.7 9.7 0 5.36-4.35 9.9-8.1 9.9zm5.32-7.28c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.66.15-.2.29-.76.95-.93 1.14-.17.2-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.43-.87-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.6-.9-2.19-.24-.57-.48-.5-.66-.51h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.44s1.04 2.83 1.19 3.03c.15.2 2.05 3.13 4.97 4.39.69.3 1.24.48 1.66.61.7.22 1.33.19 1.83.12.56-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.13-.27-.2-.56-.34z"/>
    </svg>
  );
}
function IconFacebook({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.23 10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22C18.34 21.23 22 17.08 22 12.06z"/>
    </svg>
  );
}
function IconTiktok({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M16.6 2h-3.2v13.4a2.9 2.9 0 1 1-2.06-2.78v-3.3a6.2 6.2 0 1 0 5.26 6.13V8.6a7.9 7.9 0 0 0 4.6 1.47V6.86A4.6 4.6 0 0 1 16.6 2z"/>
    </svg>
  );
}
function IconInstagram({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconTwitterX({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.24 3H21l-6.35 7.26L22 21h-6.16l-4.82-6.3L5.5 21H3l6.78-7.75L2.5 3h6.32l4.36 5.77L18.24 3zm-1.08 16.17h1.62L7.9 4.73H6.16l10.99 14.44z"/>
    </svg>
  );
}
function IconCart({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <path d="M2.5 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.3a2 2 0 0 0 2-1.6L20 7H6" />
    </svg>
  );
}
function IconPlus({ className }) {
  return (<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>);
}
function IconMinus({ className }) {
  return (<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14"/></svg>);
}
function IconTrash({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6h14z"/>
    </svg>
  );
}
function IconClose({ className }) {
  return (<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>);
}
function IconStar({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2.5l2.9 6.06 6.6.77-4.9 4.55 1.28 6.6L12 17.6l-5.88 3.28 1.28-6.6-4.9-4.55 6.6-.77L12 2.5z"/>
    </svg>
  );
}
function IconMap({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 20l-6-2V4l6 2 6-2 6 2v14l-6-2-6 2Z"/><path d="M9 6v14M15 4v14"/>
    </svg>
  );
}
function IconGear({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3.2"/>
      <path d="M19.4 13a7.6 7.6 0 0 0 0-2l2-1.5-2-3.4-2.3.9a7.7 7.7 0 0 0-1.7-1L15 3h-4l-.4 2.4a7.7 7.7 0 0 0-1.7 1l-2.3-.9-2 3.4L6.6 11a7.6 7.6 0 0 0 0 2l-2 1.5 2 3.4 2.3-.9c.5.44 1.08.77 1.7 1L11 21h4l.4-2.4c.6-.24 1.2-.57 1.7-1l2.3.9 2-3.4-2-1.5Z"/>
    </svg>
  );
}
function IconGrid({ className }) {
  return (<svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>);
}
function IconDrag({ className }) {
  return (<svg viewBox="0 0 24 24" className={className} fill="currentColor"><circle cx="8" cy="6" r="1.5"/><circle cx="16" cy="6" r="1.5"/><circle cx="8" cy="12" r="1.5"/><circle cx="16" cy="12" r="1.5"/><circle cx="8" cy="18" r="1.5"/><circle cx="16" cy="18" r="1.5"/></svg>);
}
function IconChevronLeft({ className }) {
  return (<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>);
}
function IconEdit({ className }) {
  return (<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>);
}
function IconFishWatermark({ className }) {
  // شكل السمكة المستوحى من مكوّن اللوجو (Logo Component / Fish) — عنصر تصميمي بسيط
  return (
    <svg viewBox="0 0 64 64" className={className} fill="currentColor">
      <path d="M4 32c8-14 22-20 34-20 8 0 14 4 18 9-2 1-5 3-6 6 1 0 4 0 8 2-4 2-7 2-8 2 1 3 4 5 6 6-4 5-10 9-18 9-12 0-26-6-34-14zm38-14a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z"/>
    </svg>
  );
}
function IconApple({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M16.2 1c.1 1.2-.4 2.3-1.1 3.1-.7.9-1.9 1.6-3 1.5-.1-1.1.4-2.3 1.1-3C13.9 1.7 15.1 1.1 16.2 1zM19.8 17.2c-.5 1.1-1 2.2-1.9 3.2-1 1.2-2.1 2.6-3.6 2.6-1.3 0-1.7-.8-3.3-.8s-2 .8-3.3.8c-1.4 0-2.5-1.3-3.4-2.5C2.6 18.2 1.3 14 3 11c1-1.7 2.7-2.7 4.3-2.7 1.4 0 2.2.9 3.3.9 1.1 0 1.8-.9 3.3-.9 1.3 0 2.7.7 3.7 1.9-3.3 1.8-2.7 6.5 1.2 7.9z"/>
    </svg>
  );
}
function IconPlay({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M4 3.5c0-.6.7-1 1.2-.7l14 8.5c.5.3.5 1 0 1.3l-14 8.5c-.5.3-1.2 0-1.2-.7V3.5z"/>
    </svg>
  );
}

// ---------- أيقونات التصنيفات (بديل عن الإيموجي عشان تظهر نفس الشكل بالظبط في كل الأجهزة) ----------
function IconCatFish({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12c3-4 8-6 12-6 3 0 5 2 6 6-1 4-3 6-6 6-4 0-9-2-12-6z"/>
      <path d="M15 8v8M21 12l-3-2v4l3-2z" fill="currentColor" stroke="none"/>
      <circle cx="8" cy="11" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function IconCatDrink({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3h10l-1.2 16a2 2 0 0 1-2 1.8h-3.6a2 2 0 0 1-2-1.8L7 3z"/>
      <path d="M6 8h12"/>
    </svg>
  );
}
function IconCatSauce({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6v3l2 2v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8l2-2V3z"/>
      <path d="M7 12h10"/>
    </svg>
  );
}
function IconCatCaviar({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="12" rx="9" ry="6"/>
      <ellipse cx="12" cy="12" rx="9" ry="6" strokeDasharray="1.5 2.3"/>
    </svg>
  );
}
function IconCatFrozen({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 2v20M4.5 6l15 12M19.5 6l-15 12"/>
      <path d="M12 5 9.8 3.5M12 5l2.2-1.5M12 19l-2.2 1.5M12 19l2.2 1.5"/>
    </svg>
  );
}
function IconCatChef({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 10c0-3 2-5 6-5s6 2 6 5c1.5.3 2.5 1.6 2.5 3 0 1.7-1.3 3-3 3H6.5c-1.7 0-3-1.3-3-3 0-1.4 1-2.7 2.5-3z"/>
      <path d="M7 16v4h10v-4"/>
    </svg>
  );
}
function IconCatDefault({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8"/>
      <circle cx="12" cy="12" r="3.2"/>
    </svg>
  );
}
