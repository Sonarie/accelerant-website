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

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("active");

      menuToggle.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );
    });
  }

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const navItem = toggle.closest(".nav-item");

      if (window.innerWidth <= 900) {
        navItem.classList.toggle("open");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", loadGlobalComponents);