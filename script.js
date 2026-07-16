(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ */
  /* Sticky header background swap                                       */
  /* ------------------------------------------------------------------ */

  var header = document.getElementById("site-header");
  function onScrollHeader() {
    if (window.scrollY > 80) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ------------------------------------------------------------------ */
  /* Hero headline: wrap each word in a masked span for the load reveal  */
  /* ------------------------------------------------------------------ */

  var heroHeading = document.querySelector("[data-reveal-lines]");
  if (heroHeading) {
    var words = heroHeading.textContent.trim().split(/\s+/);
    heroHeading.innerHTML = words
      .map(function (word, i) {
        return (
          '<span class="line"><span style="animation-delay:' +
          i * 60 +
          'ms">' +
          word +
          "</span></span>"
        );
      })
      .join(" ");
  }

  /* ------------------------------------------------------------------ */
  /* Section heading word reveal (on scroll into view)                    */
  /* Walks the DOM so existing tags (<br>, <span> wrappers) survive       */
  /* ------------------------------------------------------------------ */

  function wrapWordsIn(root) {
    var wordIndex = 0;
    function walk(node) {
      Array.from(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var parts = child.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (part) {
            if (part === "") return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(part));
            } else {
              var span = document.createElement("span");
              span.className = "word";
              span.style.transitionDelay = wordIndex * 35 + "ms";
              span.textContent = part;
              wordIndex++;
              frag.appendChild(span);
            }
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== "BR") {
          walk(child);
        }
      });
    }
    walk(root);
  }

  document.querySelectorAll("[data-reveal-words]").forEach(wrapWordsIn);

  /* ------------------------------------------------------------------ */
  /* Hero load sequence                                                   */
  /* ------------------------------------------------------------------ */

  function runHeroSequence() {
    var heroSub = document.querySelector(".hero-sub");
    var heroCta = document.querySelector(".hero .btn");
    var heroPillars = document.querySelector(".hero-pillars");

    if (heroHeading) heroHeading.classList.add("is-revealed");

    window.setTimeout(function () {
      if (heroSub) heroSub.classList.add("is-revealed");
    }, reduceMotion ? 0 : 480);

    window.setTimeout(function () {
      if (heroCta) heroCta.classList.add("is-revealed");
    }, reduceMotion ? 0 : 780);

    window.setTimeout(function () {
      if (heroPillars) heroPillars.classList.add("is-revealed");
    }, reduceMotion ? 0 : 900);
  }

  if (document.readyState === "complete") {
    runHeroSequence();
  } else {
    window.addEventListener("load", runHeroSequence);
  }

  /* ------------------------------------------------------------------ */
  /* Scroll reveal for sections / cards                                  */
  /* ------------------------------------------------------------------ */

  var revealTargets = document.querySelectorAll(".reveal, [data-reveal-words]");

  if ("IntersectionObserver" in window && revealTargets.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
