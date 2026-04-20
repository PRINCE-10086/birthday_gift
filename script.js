const wishBtn = document.getElementById("wish-btn");
const wishOutput = document.getElementById("wish-output");
const toggleLetterBtn = document.getElementById("toggle-letter");
const letterPaper = document.getElementById("letter-paper");
const typedText = document.getElementById("typed-text");
const drawWishBtn = document.getElementById("draw-wish");
const showAllWishesBtn = document.getElementById("show-all-wishes");
const wishListEl = document.getElementById("wish-list");
const daysLivedEl = document.getElementById("days-lived");
const countdownEl = document.getElementById("countdown");
const revealPanels = document.querySelectorAll(".panel-reveal");
const bgVideo = document.getElementById("bg-video");
const musicToggleBtn = document.getElementById("music-toggle");

const heroSentence = "你已经很努力地走过了很多不容易的路。今天不用逞强，只要被温柔接住就好";

const birthdayMonth = 4;
const birthdayDay = 20;
const birthYear = 2008;

const quickWishes = [
    "愿你在被误解的时刻，能忽略外界的噪音，守住自己的温柔",
    "愿你遇见更多温柔的人，我们都会认真听你说话",
    "愿你把今天当作新的起点，往后每一步都更自由",
    "愿你的情绪被看见，你的眼泪不再被轻视",
    "愿你记得：你的人生才刚刚开始，未来还有很多可能",
    "愿你在难过的时候，能遇到一个让自己心安的人可以陪着你",
    "愿你18岁的勇敢，不是硬撑，而是学会好好爱自己",
    "愿你的明天，少一点刺，多一点光"
];

const wishPool18 = [
    "愿你在18岁拥有坚定又温柔的内核",
    "愿你被理解的时候越来越多",
    "愿你遇见的关系里，尊重永远先于要求",
    "愿你在难过时，也能记得有人一直爱着你",
    "愿你慢慢把失落还给过去，把勇气留给现在",
    "愿你睡前不再总是悲伤难过，能遇到抱着你入睡的人",
    "愿你把每次撑过来的夜晚，都算作一次胜利",
    "愿你不再为了讨好谁而忽略自己",
    "愿你的表达被听见，而不是被打断",
    "愿你能在新的未来里拥有真正安全感",
    "愿你把自己放在被保护的位置",
    "愿你被坏情绪袭来时，也知道有人在意你",
    "愿你身边出现更多稳定、善良的人",
    "愿你把过去的伤，慢慢养成未来的光",
    "愿你仍然保持热爱，也允许自己偶尔停下",
    "愿你的边界被尊重，你的选择被尊重",
    "愿你18岁的每一步，都更接近真正想要的人生",
    "愿你以后遇到的日子，大多是晴天"
];

let lastQuickWish = -1;
let typeIndex = 0;
const shownWishIndexes = new Set();

function typeWriter() {
    if (!typedText) {
        return;
    }

    typedText.textContent = heroSentence.slice(0, typeIndex);
    if (typeIndex < heroSentence.length) {
        typeIndex += 1;
        setTimeout(typeWriter, 30);
    }
}

function spawnParticle(kind = "petal", layer = "front") {
    const particle = kind === "spark" ? document.createElement("span") : document.createElement("img");
    if (kind === "spark") {
        particle.className = "spark";
    } else if (kind === "miku") {
        particle.className = `petal-svg layer-${layer}`;
        particle.src = "./miku.svg";
        particle.alt = "";
        particle.setAttribute("aria-hidden", "true");
    } else if (kind === "flower") {
        particle.className = `petal-svg layer-${layer}`;
        particle.src = "./flower.svg";
        particle.alt = "";
        particle.setAttribute("aria-hidden", "true");
    } else {
        particle.className = `petal-svg layer-${layer}`;
        particle.src = "./flower.svg";
        particle.alt = "";
        particle.setAttribute("aria-hidden", "true");
    }

    particle.style.left = `${Math.random() * 100}vw`;

    if (kind !== "spark") {
        const isBack = layer === "back";
        const fallDuration = isBack ? 8 + Math.random() * 4 : 4.4 + Math.random() * 3.2;
        const scale = isBack ? 0.6 + Math.random() * 0.28 : 0.92 + Math.random() * 0.48;
        const opacity = isBack ? 0.34 + Math.random() * 0.2 : 0.62 + Math.random() * 0.28;

        particle.style.animationDuration = `${fallDuration}s`;
        particle.style.setProperty("--scale", scale.toFixed(2));
        particle.style.setProperty("--petal-opacity", opacity.toFixed(2));
    } else {
        particle.style.animationDuration = `${4 + Math.random() * 5}s`;
    }

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 10000);
}

function startAmbientPetals() {
    setInterval(() => {
        const colorKind = Math.random() < 0.58 ? "miku" : "flower";
        spawnParticle(colorKind, "back");
    }, 720);

    setInterval(() => {
        const colorKind = Math.random() < 0.52 ? "flower" : "miku";
        spawnParticle(colorKind, "front");
    }, 420);

    // Occasional mini gust for a richer stage-like atmosphere.
    setInterval(() => {
        for (let i = 0; i < 2; i += 1) {
            const layer = i % 2 === 0 ? "front" : "back";
            const colorKind = Math.random() < 0.5 ? "miku" : "flower";
            setTimeout(() => spawnParticle(colorKind, layer), i * 80);
        }
    }, 4800);
}

function randomWish() {
    if (!wishOutput) {
        return;
    }

    let index = Math.floor(Math.random() * quickWishes.length);
    while (index === lastQuickWish && quickWishes.length > 1) {
        index = Math.floor(Math.random() * quickWishes.length);
    }

    lastQuickWish = index;
    wishOutput.textContent = quickWishes[index];
}

function appendWish(text) {
    if (!wishListEl) {
        return;
    }

    const li = document.createElement("li");
    li.className = "new-item";
    li.textContent = text;
    wishListEl.prepend(li);
}

function drawOneWish() {
    if (shownWishIndexes.size >= wishPool18.length) {
        appendWish("18条祝福都已经解锁，今天请好好开心");
        return;
    }

    let index = Math.floor(Math.random() * wishPool18.length);
    while (shownWishIndexes.has(index)) {
        index = Math.floor(Math.random() * wishPool18.length);
    }

    shownWishIndexes.add(index);
    appendWish(`NO.${shownWishIndexes.size} ${wishPool18[index]}`);
}

function showAllWishes() {
    if (!wishListEl) {
        return;
    }

    wishListEl.innerHTML = "";
    shownWishIndexes.clear();
    wishPool18.forEach((wish, idx) => {
        const li = document.createElement("li");
        li.textContent = `NO.${idx + 1} ${wish}`;
        wishListEl.appendChild(li);
        shownWishIndexes.add(idx);
    });
}

function formatDuration(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days} 天 ${hours} 时 ${minutes} 分 ${seconds} 秒`;
}

function updateBirthdayInfo() {
    const now = new Date();

    if (daysLivedEl) {
        const birthDate = new Date(birthYear, birthdayMonth - 1, birthdayDay, 0, 0, 0);
        const livedMs = now.getTime() - birthDate.getTime();
        const livedDays = Math.max(0, Math.floor(livedMs / 86400000));
        daysLivedEl.textContent = `你已经在地球上发光了 ${livedDays} 天`;
    }

    if (countdownEl) {
        let target = new Date(now.getFullYear(), birthdayMonth - 1, birthdayDay, 0, 0, 0);
        if (target.getTime() <= now.getTime()) {
            target = new Date(now.getFullYear() + 1, birthdayMonth - 1, birthdayDay, 0, 0, 0);
        }

        countdownEl.textContent = formatDuration(target.getTime() - now.getTime());
    }
}

function setupReveal() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    revealPanels.forEach((panel) => observer.observe(panel));
}

function triggerTapAnimation(element) {
    element.classList.remove("tap-pop");
    // Force reflow so repeated taps can replay animation.
    void element.offsetWidth;
    element.classList.add("tap-pop");
}

function bindPressMotion(element) {
    element.addEventListener("pointerdown", () => {
        element.classList.add("tap-press");
    });

    element.addEventListener("pointerup", () => {
        element.classList.remove("tap-press");
    });

    element.addEventListener("pointercancel", () => {
        element.classList.remove("tap-press");
    });

    element.addEventListener("pointerleave", () => {
        element.classList.remove("tap-press");
    });
}

function setupClickMotion() {
    const clickableBlocks = document.querySelectorAll("button");
    clickableBlocks.forEach((element) => {
        bindPressMotion(element);
        element.addEventListener("click", () => triggerTapAnimation(element));
    });

    if (wishListEl) {
        wishListEl.addEventListener("pointerdown", (event) => {
            const target = event.target;
            if (target instanceof HTMLElement && target.tagName === "LI") {
                target.classList.add("tap-press");
            }
        });

        const clearPressState = (event) => {
            const target = event.target;
            if (target instanceof HTMLElement && target.tagName === "LI") {
                target.classList.remove("tap-press");
            }
        };

        wishListEl.addEventListener("pointerup", clearPressState);
        wishListEl.addEventListener("pointercancel", clearPressState);
        wishListEl.addEventListener("pointerleave", clearPressState);

        wishListEl.addEventListener("click", (event) => {
            const target = event.target;
            if (target instanceof HTMLElement && target.tagName === "LI") {
                triggerTapAnimation(target);
            }
        });
    }
}

if (wishBtn) {
    wishBtn.addEventListener("click", () => {
        randomWish();
        for (let i = 0; i < 16; i += 1) {
            setTimeout(() => spawnParticle(i % 3 === 0 ? "spark" : "petal"), i * 55);
        }
    });
}

if (drawWishBtn) {
    drawWishBtn.addEventListener("click", drawOneWish);
}

if (showAllWishesBtn) {
    showAllWishesBtn.addEventListener("click", showAllWishes);
}

if (toggleLetterBtn && letterPaper) {
    toggleLetterBtn.addEventListener("click", () => {
        letterPaper.classList.toggle("open");
        toggleLetterBtn.textContent = letterPaper.classList.contains("open")
            ? "收起信笺"
            : "展开信笺";
    });
}

if (musicToggleBtn && bgVideo) {
    musicToggleBtn.addEventListener("click", async () => {
        try {
            const shouldPlay = bgVideo.muted || bgVideo.paused;

            if (shouldPlay) {
                bgVideo.muted = false;
                bgVideo.volume = 1;
                await bgVideo.play();
                musicToggleBtn.classList.add("playing");
            } else {
                bgVideo.muted = true;
                musicToggleBtn.classList.remove("playing");
            }
        } catch (error) {
            bgVideo.muted = true;
            musicToggleBtn.classList.remove("playing");
        }
    });
}

document.body.classList.add("showtime");
setupReveal();
setupClickMotion();
typeWriter();
randomWish();
startAmbientPetals();
updateBirthdayInfo();
setInterval(updateBirthdayInfo, 1000);
