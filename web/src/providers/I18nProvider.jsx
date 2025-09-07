import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const dict = {
  en: {
    brand: "Yamato",
    badge: "Multi-tenant SaaS boilerplate",
    hero_h1: "Ship production-ready SaaS, fast.",
    hero_p: "Tenants, auth, roles, and a modern React/Vite frontend — tuned for speed and DX.",
    start_free: "Start free",
    view_docs: "View docs",
    kpi_deploy: "to first deploy",
    kpi_tenants: "tenants",
    kpi_rbac: "built-in",
    nav_home: "Home",
    nav_features: "Features",
    nav_showcase: "Showcase",
    nav_pricing: "Pricing",
    nav_faq: "FAQ",
    nav_login: "Login",
    nav_get_started: "Get started",
    features_h2: "Everything you need",
    features_p: "Stop wiring the basics — build your advantage.",
    f1: "Tenants & Billing",
    f1_p: "Isolated tenants with hooks to connect your billing provider.",
    f2: "Auth & Teams",
    f2_p: "Email/OAuth login, invites, roles and capabilities.",
    f3: "Modern stack",
    f3_p: "Laravel API + React/Vite + Postgres/Redis.",
    f4: "Testing ready",
    f4_p: "Great DX with hot reload and typed front/back contracts.",
    f5: "Ops hooks",
    f5_p: "Queues, retries, and webhooks patterns built-in.",
    f6: "CI/CD friendly",
    f6_p: "12-factor configs, container-first, cloud ready.",
    show_h2: "Launch features, not scaffolding",
    show_p: "Yamato’s foundation covers tenancy, auth, and ops so you can focus on what makes your product different.",
    show_li1: "Tenant isolation, per-route guards",
    show_li2: "Capability flags on the client",
    show_li3: "Docs and examples for common flows",
    pricing_h2: "Simple, predictable pricing",
    pricing_p: "Start free, grow when you do.",
    plan_starter: "Starter",
    plan_team: "Team",
    plan_scale: "Scale",
    plan_starter_blurb: "For hobby and evaluation",
    plan_team_blurb: "For growing teams",
    plan_scale_blurb: "For orgs with custom needs",
    plan_choose: "Choose plan",
    plan_start_now: "Start now",
    faq_h2: "Frequently asked questions",
    faq1_q: "Can I self-host?",
    faq1_a: "Yes. API + web are container-friendly; Postgres & Redis first-class.",
    faq2_q: "Custom domains per tenant?",
    faq2_a: "Yep. Map a domain and set tenant context at edge/middleware.",
    faq3_q: "Does Yamato include RBAC?",
    faq3_a: "Yes. Server-side roles and permissions with per-route guards.",
    cta_h2: "Ready to ship?",
    cta_p: "Create your first tenant in minutes.",
    footer_rights: "— Multi-tenant SaaS boilerplate",
    lang_label: "Language",
  },
  es: {
    brand: "Yamato",
    badge: "Plantilla SaaS multi-tenant",
    hero_h1: "Lanza SaaS listo para producción, rápido.",
    hero_p: "Tenants, auth, roles y un frontend React/Vite — optimizado para velocidad y DX.",
    start_free: "Empezar gratis",
    view_docs: "Ver docs",
    kpi_deploy: "al primer deploy",
    kpi_tenants: "tenants",
    kpi_rbac: "incluido",
    nav_home: "Inicio",
    nav_features: "Funciones",
    nav_showcase: "Demostración",
    nav_pricing: "Precios",
    nav_faq: "FAQ",
    nav_login: "Entrar",
    nav_get_started: "Comenzar",
    features_h2: "Todo lo que necesitas",
    features_p: "Deja de cablear lo básico — construye tu ventaja.",
    f1: "Tenants y Cobro",
    f1_p: "Tenants aislados con conectores a tu proveedor de pagos.",
    f2: "Auth y Equipos",
    f2_p: "Login Email/OAuth, invitaciones, roles y capacidades.",
    f3: "Stack moderno",
    f3_p: "Laravel API + React/Vite + Postgres/Redis.",
    f4: "Listo para pruebas",
    f4_p: "Gran DX con recarga en caliente y contratos tipados.",
    f5: "Ganchos de Ops",
    f5_p: "Colas, reintentos y webhooks incluidos.",
    f6: "Amigable CI/CD",
    f6_p: "Configs 12-factor, contenedores, listo para la nube.",
    show_h2: "Lanza funciones, no andamiaje",
    show_p: "La base de Yamato cubre tenancy, auth y ops para que te enfoques en tu diferencia.",
    show_li1: "Aislamiento por tenant, guards por ruta",
    show_li2: "Flags de capacidades en el cliente",
    show_li3: "Docs y ejemplos de flujos comunes",
    pricing_h2: "Precios simples y predecibles",
    pricing_p: "Empieza gratis, crece cuando tú crezcas.",
    plan_starter: "Inicio",
    plan_team: "Equipo",
    plan_scale: "Escala",
    plan_starter_blurb: "Para hobby y evaluación",
    plan_team_blurb: "Para equipos en crecimiento",
    plan_scale_blurb: "Para organizaciones con necesidades a medida",
    plan_choose: "Elegir plan",
    plan_start_now: "Comenzar ahora",
    faq_h2: "Preguntas frecuentes",
    faq1_q: "¿Puedo autohospedar?",
    faq1_a: "Sí. API + web son amigables con contenedores; Postgres y Redis de primera.",
    faq2_q: "¿Dominios personalizados por tenant?",
    faq2_a: "Sí. Mapea un dominio y establece contexto en edge/middleware.",
    faq3_q: "¿Incluye RBAC?",
    faq3_a: "Sí. Roles y permisos del lado servidor con guards por ruta.",
    cta_h2: "¿Listo para lanzar?",
    cta_p: "Crea tu primer tenant en minutos.",
    footer_rights: "— Plantilla SaaS multi-tenant",
    lang_label: "Idioma",
  },
};

const I18nCtx = createContext({ lang: "en", t: (k) => k, setLang: () => {} });

export function I18nProvider({ children, storageKey = "yamato.lang", defaultLang = "en" }) {
  const [lang, setLang] = useState(() => localStorage.getItem(storageKey) || defaultLang);
  useEffect(() => localStorage.setItem(storageKey, lang), [lang, storageKey]);
  const t = (key) => (dict[lang] && dict[lang][key]) || key;
  const value = useMemo(() => ({ lang, t, setLang }), [lang]);
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  return useContext(I18nCtx);
}

export function LangSelect() {
  const { lang, setLang } = useI18n();
  return (
    <label className="lang-select">
      <span className="visually-hidden">Language</span>
      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>
    </label>
  );
}
