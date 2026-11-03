// Shared mobile navigation.
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "打开导航" : "关闭导航");
    mainNav.classList.toggle("is-open", !isExpanded);
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "打开导航");
      mainNav.classList.remove("is-open");
    }
  });
}

// The final carousel frame is a clone, allowing a seamless return to the first image.
const carousel = document.querySelector(".carousel");
if (carousel) {
  const track = carousel.querySelector(".carousel-track");
  const slides = [...track.querySelectorAll(".carousel-slide")];
  const realSlideCount = slides.length - 1;
  const indicators = [...carousel.querySelectorAll(".carousel-indicators button")];
  const imageDialog = document.querySelector(".image-dialog");
  const dialogImage = imageDialog?.querySelector("img");
  let currentIndex = 0;
  let timer;
  let paused = false;

  const renderSlide = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    indicators.forEach((indicator, index) => {
      indicator.setAttribute("aria-pressed", String(index === currentIndex % realSlideCount));
    });
  };

  const stopCarousel = () => window.clearInterval(timer);
  const startCarousel = () => {
    stopCarousel();
    if (!paused && !imageDialog?.open && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = window.setInterval(() => {
        currentIndex += 1;
        renderSlide();
      }, 5000);
    }
  };

  // Snap from the duplicate frame to the original without showing a reverse transition.
  track.addEventListener("transitionend", () => {
    if (currentIndex === realSlideCount) {
      track.style.transition = "none";
      currentIndex = 0;
      renderSlide();
      track.offsetHeight;
      track.style.removeProperty("transition");
    }
  });

  carousel.addEventListener("mouseenter", () => {
    paused = true;
    stopCarousel();
  });
  carousel.addEventListener("mouseleave", () => {
    paused = false;
    startCarousel();
  });
  carousel.addEventListener("focusin", () => {
    paused = true;
    stopCarousel();
  });
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) {
      paused = false;
      startCarousel();
    }
  });

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      currentIndex = index;
      renderSlide();
      startCarousel();
    });
  });

  carousel.querySelector(".carousel-previous").addEventListener("click", () => {
    currentIndex = currentIndex <= 0 ? realSlideCount - 1 : currentIndex - 1;
    renderSlide();
    startCarousel();
  });
  carousel.querySelector(".carousel-next").addEventListener("click", () => {
    currentIndex = currentIndex >= realSlideCount - 1 ? realSlideCount : currentIndex + 1;
    renderSlide();
    startCarousel();
  });

  carousel.querySelector(".carousel-track").addEventListener("click", (event) => {
    const image = event.target.closest("img");
    if (!image || !imageDialog || !dialogImage) return;
    dialogImage.src = image.src;
    dialogImage.alt = image.alt || "成都风景";
    imageDialog.showModal();
    stopCarousel();
  });

  if (imageDialog) {
    imageDialog.querySelector(".dialog-close").addEventListener("click", () => imageDialog.close());
    imageDialog.addEventListener("click", (event) => {
      if (event.target === imageDialog) imageDialog.close();
    });
    imageDialog.addEventListener("close", startCarousel);
  }

  renderSlide();
  startCarousel();
}
