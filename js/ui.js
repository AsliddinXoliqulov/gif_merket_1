document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.querySelector(".nav");

  menuToggle?.addEventListener("click", () => nav?.classList.toggle("active"));

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => nav?.classList.remove("active"));
  });

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function setActiveLink() {
    let currentId = "";

    sections.forEach(section => {
      const top = section.offsetTop - 140;
      const bottom = top + section.offsetHeight;

      if (scrollY >= top && scrollY < bottom) currentId = section.id;
    });

    if (!currentId && sections[0]) currentId = sections[0].id;

    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
  }

  window.addEventListener("scroll", setActiveLink);
  window.addEventListener("load", setActiveLink);
  setActiveLink();
});








document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("contactMap");
  const skel = document.getElementById("mapSkeleton");

  if (!iframe || !skel) return;

  iframe.addEventListener("load", () => {
    skel.remove();
  });
});