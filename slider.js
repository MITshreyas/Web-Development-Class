const slider = document.querySelector(".slider");
const track = slider.querySelector(".slider-track");
const dotsBox = slider.querySelector(".slider-dots");
const statusText = slider.querySelector(".slider-status");
const prevBtn = slider.querySelector(".slider-prev");
const nextBtn = slider.querySelector(".slider-next");

const slides = Array.from(track.children);
const total = slides.length;

const firstClone = slides[0].cloneNode(true);
const lastClone = slides[total - 1].cloneNode(true);
firstClone.setAttribute("aria-hidden", "true");
lastClone.setAttribute("aria-hidden", "true");
track.append(firstClone);
track.prepend(lastClone);

let index = 1;          
let isMoving = false;   

const realIndex = () => {
    if (index === 0) return total - 1;
    if (index === total + 1) return 0;
    return index - 1;
};

const dots = slides.map((slide, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => goTo(i + 1));
    return dot;
});
dotsBox.append(...dots);

function setPosition(animate) {
    track.style.transition = animate ? "" : "none";
    track.style.transform = `translateX(${-index * 100}%)`;
}

function updateDots() {
    const current = realIndex();
    dots.forEach((dot, i) => {
        dot.setAttribute("aria-current", i === current);
    });
    statusText.textContent = `Slide ${current + 1} of ${total}`;
}

function goTo(newIndex) {
    if (isMoving || newIndex === index) return;   

    isMoving = true;
    index = newIndex;
    setPosition(true);
    updateDots();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finishMove();
    }
}

function finishMove() {
    if (index === 0) {
        index = total;
        setPosition(false);
    } else if (index === total + 1) {
        index = 1;
        setPosition(false);
    }
    track.offsetWidth;   
    isMoving = false;
}

track.addEventListener("transitionend", (event) => {
    if (event.target === track && event.propertyName === "transform") {
        finishMove();
    }
});

nextBtn.addEventListener("click", () => goTo(index + 1));
prevBtn.addEventListener("click", () => goTo(index - 1));

slider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") goTo(index + 1);
    if (event.key === "ArrowLeft") goTo(index - 1);
});

setPosition(false);
updateDots();