document.addEventListener("DOMContentLoaded", () => {

    /*
    0. smooth dropdown
    
    */

    const workDetails = Array.from(document.querySelectorAll("#work details.work-card"));

    workDetails.forEach((details) => {
        const summary = details.querySelector("summary");
        const content = details.querySelector(".work-details");

        if (!summary || !content) return;

        let isAnimating = false;

        // initialize height based on current open state
        if (details.open) {
            content.style.height = "auto";
        } else {
            content.style.height = "0px";
        }

        summary.addEventListener("click", (e) => {
            e.preventDefault();

            if (isAnimating) return;

            const isOpen = details.open;

            if (!isOpen) {
                // for opening: content is hidden unless details.open = true
                details.open = true;

                // start from 0, animate to scrollHeight
                content.style.height = "0px";
                content.getBoundingClientRect(); // force reflow

                const endHeight = content.scrollHeight;

                isAnimating = true;
                content.style.transition = "height 300ms cubic-bezier(0.2, 0.8, 0.2, 1)";
                content.style.height = `${endHeight}px`;

                const onEnd = (ev) => {
                    if (ev.propertyName !== "height") return;
                    content.removeEventListener("transitionend", onEnd);
                    content.style.transition = "";
                    content.style.height = "auto";
                    isAnimating = false;
                };

                content.addEventListener("transitionend", onEnd);
            } else {
                // for closing: set a fixed start height, animate to 0, then close details
                const startHeight = content.scrollHeight;

                content.style.height = `${startHeight}px`;
                content.getBoundingClientRect(); // force reflow

                isAnimating = true;
                content.style.transition = "height 220ms ease";
                content.style.height = "0px";

                const onEnd = (ev) => {
                    if (ev.propertyName !== "height") return;
                    content.removeEventListener("transitionend", onEnd);
                    content.style.transition = "";
                    details.open = false; // hide after animation finishes
                    isAnimating = false;
                };

                content.addEventListener("transitionend", onEnd);
            }
        });
    });



    /* ============================
       1) Work Accordion Behavior
       Only allow one <details> open at a time
    ============================ */

    const workCards = Array.from(document.querySelectorAll("#work details.work-card"));

    workCards.forEach((card) => {
        const summary = card.querySelector("summary");
        if (!summary) return;

        summary.addEventListener("click", () => {
            // After this one opens, close the rest (with animation)
            setTimeout(() => {
                if (!card.open) return;
                workCards.forEach((other) => {
                    if (other !== card && other.open) {
                        const otherSummary = other.querySelector("summary");
                        if (otherSummary) otherSummary.click();
                    }
                });
            }, 0);
        });
    });





    /* ============================
       3) Reveal on Scroll Animations
    ============================ */

    const revealElements = document.querySelectorAll(
        ".about-card, .work-card, h2, .about-text p"
    );

    revealElements.forEach((el) => {
        el.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("reveal-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
        }
    );

    revealElements.forEach((el) => {
        revealObserver.observe(el);
    });

});
