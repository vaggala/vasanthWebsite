// Light/dark toggle. Follows the device setting until the visitor picks one,
// then remembers that choice (the <head> script re-applies it on load).
(() => {
    const button = document.querySelector(".theme-toggle");
    if (!button) return;

    const root = document.documentElement;
    const deviceDark = window.matchMedia("(prefers-color-scheme: dark)");
    const current = () => root.dataset.theme || (deviceDark.matches ? "dark" : "light");

    const updateLabel = () => {
        button.setAttribute("aria-label", current() === "dark" ? "Switch to light mode" : "Switch to dark mode");
    };

    button.addEventListener("click", () => {
        const next = current() === "dark" ? "light" : "dark";
        root.dataset.theme = next;
        try { localStorage.setItem("theme", next); } catch (e) {}
        updateLabel();
    });

    deviceDark.addEventListener("change", updateLabel);
    updateLabel();
})();

// Highlight the nav link for whichever section is in the middle of the screen.
(() => {
    const links = new Map(
        Array.from(document.querySelectorAll(".nav a")).map((a) => [a.getAttribute("href").slice(1), a])
    );
    if (!links.size || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                links.forEach((a, id) => a.classList.toggle("active", id === entry.target.id));
            });
        },
        { rootMargin: "-45% 0px -50% 0px" }
    );

    links.forEach((_, id) => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
    });
})();
