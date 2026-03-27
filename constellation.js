(() => {
    const canvas = document.getElementById("constellation");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CONFIG = {
        densityPer100kPx2: 20,
        maxSpeed: 0.1577,
        radiusMin: 0.8,
        radiusMax: 1.8,
        linkDist: 0,
        mouseLinkDist: 150,
        lineAlpha: 0.35,
        dotAlpha: 0.9,
        useDevicePixelRatio: true
    };

    let w = 0, h = 0, dpr = 1;
    let particles = [];

    const mouse = {
        x: null,
        y: null,
        active: false
    };

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function resize() {
        dpr = CONFIG.useDevicePixelRatio
            ? Math.max(1, Math.floor(window.devicePixelRatio || 1))
            : 1;

        w = window.innerWidth;
        h = window.innerHeight;

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const area = w * h;
        const targetCount = Math.max(
            20,
            Math.round((area / 100000) * CONFIG.densityPer100kPx2)
        );

        particles = [];
        for (let i = 0; i < targetCount; i++) {
            particles.push({
                x: rand(0, w),
                y: rand(0, h),
                vx: rand(-CONFIG.maxSpeed, CONFIG.maxSpeed),
                vy: rand(-CONFIG.maxSpeed, CONFIG.maxSpeed),
                r: rand(CONFIG.radiusMin, CONFIG.radiusMax)
            });
        }
    }

    function step() {
        ctx.clearRect(0, 0, w, h);

        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < -30) p.x = w + 30;
            if (p.x > w + 30) p.x = -30;
            if (p.y < -30) p.y = h + 30;
            if (p.y > h + 30) p.y = -30;
        }

        const linkDist2 = CONFIG.linkDist * CONFIG.linkDist;

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i];
                const b = particles[j];

                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist2 = dx * dx + dy * dy;

                if (dist2 < linkDist2) {
                    const dist = Math.sqrt(dist2);
                    const alpha = CONFIG.lineAlpha * (1 - dist / CONFIG.linkDist);

                    ctx.globalAlpha = alpha;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = "rgba(255,255,255,1)";
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        if (mouse.active && mouse.x != null && mouse.y != null) {
            const mouseDist2 = CONFIG.mouseLinkDist * CONFIG.mouseLinkDist;

            for (const p of particles) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist2 = dx * dx + dy * dy;

                if (dist2 < mouseDist2) {
                    const dist = Math.sqrt(dist2);
                    const alpha = 0.55 * (1 - dist / CONFIG.mouseLinkDist);

                    ctx.globalAlpha = alpha;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = "rgba(255,255,255,1)";
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        ctx.globalAlpha = CONFIG.dotAlpha;
        ctx.fillStyle = "rgba(255,255,255,1)";

        for (const p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;
        requestAnimationFrame(step);
    }

    window.addEventListener("mousemove", (e) => {
        mouse.active = true;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouse.active = false;
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener("resize", resize);

    resize();
    step();
})();
