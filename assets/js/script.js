// Language management functions
let currentLang = "fr";

// Load translation file
async function loadLanguage(lang) {
  const response = await fetch(`assets/locales/${lang}.json`);
  return response.json();
}

async function setLanguage(lang) {
  if (!["fr", "en", "ar"].includes(lang)) return;

  currentLang = lang;
  document.documentElement.lang = lang;

  // Set RTL for Arabic
  document.body.dir = lang === "ar" ? "rtl" : "ltr";

  try {
    const translations = await loadLanguage(lang);

    // Update all translatable elements
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });

    // Update active language button
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    // Save preference
    localStorage.setItem("preferredLanguage", lang);
  } catch (error) {
    console.error("Error loading language file:", error);
  }
}

// Initialize language
async function initLanguage() {
  const savedLang = localStorage.getItem("preferredLanguage");
  const browserLang = navigator.language.substring(0, 2);
  const defaultLang =
    savedLang ||
    (["fr", "en", "ar"].includes(browserLang) ? browserLang : "fr");
  await setLanguage(defaultLang);
}

// Language switcher event listeners
document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const lang = btn.getAttribute("data-lang");
    setLanguage(lang);
  });
});

// Counter animation for stats
function animateCounter(elementId, finalValue, suffix = "") {
  let current = 0;
  const increment = finalValue / 50;
  const element = document.getElementById(elementId);

  const timer = setInterval(() => {
    current += increment;
    if (current >= finalValue) {
      clearInterval(timer);
      current = finalValue;
    }
    element.textContent = Math.floor(current) + suffix;
  }, 20);
}

// Initialize counters when section comes into view
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter("students-counter", 50, "+");
        animateCounter("opportunities-counter", 25, "+");
        animateCounter("employment-counter", 85, "%");
        observer.disconnect();
      }
    });
  },
  { threshold: 0.5 }
);

// Initialize testimonial carousel
const initCarousel = () => {
  const carouselElement = document.getElementById("testimonialCarousel");
  if (carouselElement) {
    new bootstrap.Carousel(carouselElement, {
      interval: 5000,
      wrap: true,
    });
  }
};

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  initLanguage();

  // Start observing stats section
  const statsSection = document.querySelector(".stats-section");
  if (statsSection) {
    observer.observe(statsSection);
  }

  // Initialize carousel
  initCarousel();
});
