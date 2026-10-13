import { translations } from "./translations";

const STORAGE_KEY = "bdbh_lang";

// Language used when the visitor has not picked one yet.
// Change to "en" if you want English first.
const DEFAULT_LANG = "en";

export function getLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === "bn" || saved === "en") return saved;
  } catch {
    // Storage can be blocked (private mode); use the default
  }

  return DEFAULT_LANG;
}

// The page is reloaded on switch, so the language is read once.
const CURRENT_LANG = getLang();

if (typeof document !== "undefined") {
  document.documentElement.lang = CURRENT_LANG;
}

// Locale for toLocaleDateString (Bangla digits and month names in Bangla)
export const DATE_LOCALE = CURRENT_LANG === "bn" ? "bn-BD" : "en-GB";

export function setLang(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore, the page still reloads in the default language
  }

  window.location.reload();
}

// t("key") -> text in the current language.
// t("key", { name: "Rafi" }) fills {name} inside the text.
export function t(key, vars = {}) {
  let text =
    translations[CURRENT_LANG]?.[key] ??
    translations.en?.[key] ??
    key;

  Object.keys(vars).forEach((name) => {
    text = text.split(`{${name}}`).join(vars[name]);
  });

  return text; 
}