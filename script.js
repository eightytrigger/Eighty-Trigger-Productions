const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const languageSwitcher = document.querySelector("#language-switcher");
const heroVideo = document.querySelector("#hero-video");
const videoAudioToggle = document.querySelector(".hero-audio-toggle");
const dictionaries = window.PORTFOLIO_TRANSLATIONS;
let currentLanguage = "en";

function updateVideoAudioToggle() {
  if (!heroVideo || !videoAudioToggle) return;

  const isMuted = heroVideo.muted;
  const messages = dictionaries[currentLanguage];
  videoAudioToggle.setAttribute("aria-label", messages[isMuted ? "videoUnmuteLabel" : "videoMuteLabel"]);
  videoAudioToggle.setAttribute("aria-pressed", String(!isMuted));
  videoAudioToggle.classList.toggle("is-unmuted", !isMuted);
  videoAudioToggle.querySelector("[data-video-audio-label]").textContent = messages[isMuted ? "videoMutedText" : "videoUnmutedText"];
}

if (heroVideo && videoAudioToggle) {
  heroVideo.muted = true;
  videoAudioToggle.addEventListener("click", () => {
    heroVideo.muted = !heroVideo.muted;
    updateVideoAudioToggle();
  });
}

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", dictionaries[currentLanguage][isOpen ? "openMenu" : "closeMenu"]);
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", dictionaries[currentLanguage].openMenu);
      navigation.classList.remove("is-open");
    }
  });
}

function setLanguage(language) {
  const messages = dictionaries[language];
  if (!messages) throw new RangeError(`Unsupported language: ${language}`);

  currentLanguage = language;
  document.documentElement.lang = language;
  document.title = messages.pageTitle;
  document.querySelector('meta[name="description"]').setAttribute("content", messages.description);

  for (const element of document.querySelectorAll("[data-i18n]")) {
    const key = element.dataset.i18n;
    if (!(key in messages)) throw new Error(`Missing ${language} translation: ${key}`);
    element.textContent = messages[key];
  }

  for (const element of document.querySelectorAll("[data-i18n-html]")) {
    const key = element.dataset.i18nHtml;
    if (!(key in messages)) throw new Error(`Missing ${language} translation: ${key}`);
    element.innerHTML = messages[key];
  }

  for (const element of document.querySelectorAll("[data-i18n-alt]")) {
    const key = element.dataset.i18nAlt;
    if (!(key in messages)) throw new Error(`Missing ${language} translation: ${key}`);
    element.setAttribute("alt", messages[key]);
  }

  for (const element of document.querySelectorAll("[data-i18n-aria]")) {
    const key = element.dataset.i18nAria;
    if (!(key in messages)) throw new Error(`Missing ${language} translation: ${key}`);
    element.setAttribute("aria-label", messages[key]);
  }

  if (menuToggle) {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-label", messages[isOpen ? "closeMenu" : "openMenu"]);
  }

  if (languageSwitcher) {
    languageSwitcher.value = language;
    languageSwitcher.setAttribute("aria-label", messages.languageLabel);
  }

  updateVideoAudioToggle();
}

if (languageSwitcher) {
  languageSwitcher.addEventListener("change", (event) => {
    setLanguage(event.currentTarget.value);
  });
}

setLanguage(languageSwitcher?.value || "en");

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());