/* =========================================================
   EXAMVAULT — SCANNER CURSOR
   ========================================================= */

(() => {
    const finePointer =
        window.matchMedia("(hover: hover) and (pointer: fine)");

    if (!finePointer.matches) return;

    const scanner = document.createElement("div");
    scanner.className = "ev-scanner";

    const line = document.createElement("span");
    line.className = "ev-scanner-line";
    scanner.appendChild(line);

    const dot = document.createElement("div");
    dot.className = "ev-scanner-dot";

    const glow = document.createElement("div");
    glow.className = "ev-scanner-glow";

    const label = document.createElement("div");
    label.className = "ev-scanner-label";

    document.body.append(glow, scanner, dot, label);

    let mouseX = innerWidth / 2;
    let mouseY = innerHeight / 2;

    let scannerX = mouseX;
    let scannerY = mouseY;

    let dotX = mouseX;
    let dotY = mouseY;

    let glowX = mouseX;
    let glowY = mouseY;

    let lastParticleTime = 0;
    let activeTarget = null;

    const interactiveSelector = [
        "a",
        "button",
        "input",
        "textarea",
        "select",
        "[role='button']",
        ".card",
        ".main-btn",
        ".back",
        ".paper-card",
        ".department",
        ".semester"
    ].join(",");

    document.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        const now = performance.now();

        if (now - lastParticleTime > 55) {
            createParticle(mouseX, mouseY);
            lastParticleTime = now;
        }
    }, { passive: true });

    function createParticle(x, y) {
        const particle = document.createElement("span");
        particle.className = "ev-scanner-particle";

        const angle = Math.random() * Math.PI * 2;
        const distance = 5 + Math.random() * 12;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
        particle.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);

        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 450);
    }

    function animate() {
        scannerX += (mouseX - scannerX) * 0.18;
        scannerY += (mouseY - scannerY) * 0.18;

        dotX += (mouseX - dotX) * 0.34;
        dotY += (mouseY - dotY) * 0.34;

        glowX += (mouseX - glowX) * 0.075;
        glowY += (mouseY - glowY) * 0.075;

        scanner.style.transform =
            `translate3d(${scannerX}px, ${scannerY}px, 0) translate(-50%, -50%)`;

        dot.style.transform =
            `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

        glow.style.transform =
            `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;

        label.style.left = `${scannerX}px`;
        label.style.top = `${scannerY}px`;

        requestAnimationFrame(animate);
    }

    animate();

    function getTarget(event) {
        return event.target.closest?.(interactiveSelector) || null;
    }

    function setTarget(target) {
        activeTarget = target;

        scanner.classList.add("is-hovering");

        const isPaper =
            target.matches(
                ".card, .paper-card, .department, .semester, .main-btn"
            );

        scanner.classList.toggle("is-paper", isPaper);

        if (target.matches("input, textarea, select")) {
            label.textContent = "TYPE";
        } else if (target.matches("button, [role='button']")) {
            label.textContent = "CLICK";
        } else if (target.matches(".card, .paper-card, .department, .semester, .main-btn")) {
            label.textContent = "OPEN";
        } else {
            label.textContent = "OPEN";
        }

        label.classList.add("visible");
    }

    function clearTarget() {
        activeTarget = null;
        scanner.classList.remove("is-hovering", "is-paper");
        label.classList.remove("visible");
    }

    document.addEventListener("mouseover", (event) => {
        const target = getTarget(event);

        if (target && target !== activeTarget) {
            setTarget(target);
        }
    });

    document.addEventListener("mouseout", (event) => {
        if (!activeTarget) return;

        const nextTarget = event.relatedTarget?.closest?.(interactiveSelector);

        if (!nextTarget || nextTarget !== activeTarget) {
            clearTarget();
        }
    });

    document.addEventListener("mousedown", (event) => {
        scanner.classList.add("is-clicking");

        const ripple = document.createElement("div");
        ripple.className = "ev-scanner-ripple";
        ripple.style.left = `${event.clientX}px`;
        ripple.style.top = `${event.clientY}px`;

        document.body.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });

    document.addEventListener("mouseup", () => {
        scanner.classList.remove("is-clicking");
    });

    window.addEventListener("blur", clearTarget);
})();
