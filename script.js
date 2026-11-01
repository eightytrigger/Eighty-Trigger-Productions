const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const languageSwitcher = document.querySelector("#language-switcher");
const heroVideo = document.querySelector("#hero-video");
const videoAudioToggle = document.querySelector(".hero-audio-toggle");
const dictionaries = window.PORTFOLIO_TRANSLATIONS;
let currentLanguage = "en";
const gastronomieTrack = document.querySelector(".gastronomie-track");
const gastronomieSlides = gastronomieTrack ? Array.from(gastronomieTrack.querySelectorAll(".gastronomie-slide")) : [];
const gastronomieStatus = document.querySelector("[data-gastronomie-status]");
const gastronomieProgress = document.querySelector("[data-gastronomie-progress]");
const gastronomiePrevious = document.querySelector("[data-gastronomie-previous]");
const gastronomieNext = document.querySelector("[data-gastronomie-next]");
let gastronomieFrame = 0;
let gastronomieIndex = 0;

function updateGastronomieControls() {
  if (!gastronomieTrack || gastronomieSlides.length === 0) return;

  const trackCenter = gastronomieTrack.getBoundingClientRect().left + gastronomieTrack.clientWidth / 2;
  let closestDistance = Infinity;
  gastronomieSlides.forEach((slide, index) => {
    const slideRect = slide.getBoundingClientRect();
    const distance = Math.abs(slideRect.left + slideRect.width / 2 - trackCenter);
    if (distance < closestDistance) {
      gastronomieIndex = index;
      closestDistance = distance;
    }
  });

  gastronomieSlides.forEach((slide, index) => {
    slide.classList.toggle("is-active", index === gastronomieIndex);
    slide.setAttribute("aria-current", String(index === gastronomieIndex));
  });
  if (gastronomiePrevious) gastronomiePrevious.disabled = gastronomieIndex === 0;
  if (gastronomieNext) gastronomieNext.disabled = gastronomieIndex === gastronomieSlides.length - 1;
  if (gastronomieStatus) {
    gastronomieStatus.textContent = dictionaries[currentLanguage].gastronomieSlideStatus
      .replace("{current}", String(gastronomieIndex + 1).padStart(2, "0"))
      .replace("{total}", String(gastronomieSlides.length).padStart(2, "0"));
  }
  if (gastronomieProgress) {
    gastronomieProgress.style.transform = `scaleX(${(gastronomieIndex + 1) / gastronomieSlides.length})`;
  }
}

function scheduleGastronomieUpdate() {
  if (gastronomieFrame) return;
  gastronomieFrame = window.requestAnimationFrame(() => {
    gastronomieFrame = 0;
    updateGastronomieControls();
  });
}

function showGastronomieSlide(index) {
  const slide = gastronomieSlides[index];
  if (!slide || !gastronomieTrack) return;

  const trackRect = gastronomieTrack.getBoundingClientRect();
  const slideRect = slide.getBoundingClientRect();
  const left = gastronomieTrack.scrollLeft + slideRect.left - trackRect.left + slideRect.width / 2 - gastronomieTrack.clientWidth / 2;
  gastronomieTrack.scrollTo({
    left,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
  });
}

if (gastronomieTrack) {
  gastronomieTrack.addEventListener("scroll", scheduleGastronomieUpdate, { passive: true });
  window.addEventListener("resize", scheduleGastronomieUpdate);
  gastronomiePrevious?.addEventListener("click", () => showGastronomieSlide(gastronomieIndex - 1));
  gastronomieNext?.addEventListener("click", () => showGastronomieSlide(gastronomieIndex + 1));
  updateGastronomieControls();
}

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
  updateGastronomieControls();
}

if (languageSwitcher) {
  languageSwitcher.addEventListener("change", (event) => {
    setLanguage(event.currentTarget.value);
  });
}

setLanguage(languageSwitcher?.value || "en");

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());