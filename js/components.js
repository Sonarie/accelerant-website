async function loadComponent(elementId, filePath) {
  const element = document.getElementById(elementId);

  if (!element) return;

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Unable to load ${filePath}`);
    }

    element.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}


async function loadGlobalComponents() {
  await Promise.all([
    loadComponent("site-header", "components/header.html"),
    loadComponent("site-footer", "components/footer.html")
  ]);

  initializeNavigation();
}


function initializeNavigation() {
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");


  /* =========================================
     MOBILE NAVIGATION
  ========================================= */

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("active");

      menuToggle.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );
    });
  }


  /* =========================================
     MOBILE DROPDOWNS
  ========================================= */

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const navItem = toggle.closest(".nav-item");

      if (window.innerWidth <= 900) {
        navItem.classList.toggle("open");
      }
    });
  });


  /* =========================================
     STICKY NAVIGATION
  ========================================= */

  if (mainNav) {
    let navOffset = mainNav.offsetTop;
    let navHeight = mainNav.offsetHeight;

    const updateNavMeasurements = () => {
      /*
       * Temporarily remove the fixed state before measuring.
       * This keeps the original navigation position accurate.
       */
      const wasFixed = mainNav.classList.contains("nav-fixed");

      if (wasFixed) {
        mainNav.classList.remove("nav-fixed");
        document.body.classList.remove("nav-is-fixed");
      }

      navOffset = mainNav.offsetTop;
      navHeight = mainNav.offsetHeight;

      document.documentElement.style.setProperty(
        "--nav-height",
        `${navHeight}px`
      );

      handleStickyNav();
    };


    const handleStickyNav = () => {
      if (window.scrollY >= navOffset) {
        mainNav.classList.add("nav-fixed");
        document.body.classList.add("nav-is-fixed");
      } else {
        mainNav.classList.remove("nav-fixed");
        document.body.classList.remove("nav-is-fixed");
      }
    };


    document.documentElement.style.setProperty(
      "--nav-height",
      `${navHeight}px`
    );

    window.addEventListener("scroll", handleStickyNav);

    window.addEventListener("resize", () => {
      updateNavMeasurements();
    });

    handleStickyNav();
  }
}


document.addEventListener(
  "DOMContentLoaded",
  loadGlobalComponents
);