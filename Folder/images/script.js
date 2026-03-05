/* ─── Elements ───────────────────────────────────────────── */
const shutter = document.getElementById('shutter');
const intro6d = document.getElementById('intro6d');
const speechLines = document.querySelectorAll('.speech-line');
const pullPrompt = document.getElementById('pullPrompt');
const ropeAssembly = document.getElementById('ropeAssembly');
const ropeBraid = document.getElementById('ropeBraid');
const ropeHandle = document.getElementById('ropeHandle');
const pageBg = document.querySelector('.page-bg');

/* ─── State ──────────────────────────────────────────────── */
let shutterY = 0;
let isDragging = false;
let dragStartY = 0;
let dragStartShutterY = 0;
let ropeActive = false;
let revealed = false;

/* ─── Sequence ───────────────────────────────────────────── */
function runSequence() {

    // 1 ── Show 6D large and centred
    setTimeout(() => {
        intro6d.classList.add('visible');
    }, 500);

    // 2 ── Shrink 6D to top-left corner
    setTimeout(() => {
        intro6d.classList.add('corner');
    }, 2300);

    // 3 ── Speech lines, one per 3 s
    const BASE = 3800;
    const STRIDE = 3000;

    speechLines.forEach((line, i) => {
        setTimeout(() => {
            line.classList.add('visible');
            setTimeout(() => {
                line.style.display = "none";
            }, 3000)
        }, BASE + i * STRIDE);
    });

    // 4 ── Pull prompt then rope
    const afterSpeech = BASE + speechLines.length * STRIDE + 900;

    setTimeout(() => {
        pullPrompt.classList.add('visible');
    }, afterSpeech);


    setTimeout(() => {
        ropeAssembly.classList.add('visible');
        ropeActive = true;
    }, afterSpeech + 800);
}

/* ─── Utility ────────────────────────────────────────────── */
function clientY(e) {
    return e.touches ? e.touches[0].clientY : e.clientY;
}

/* ─── Drag / Pull ────────────────────────────────────────── */
function onDown(e) {
    if (!ropeActive || revealed) return;
    isDragging = true;
    dragStartY = clientY(e);
    dragStartShutterY = shutterY;

    // Pause sway while holding
    ropeBraid.style.animationPlayState = 'paused';
    ropeHandle.style.animationPlayState = 'paused';

    e.preventDefault();
}

function onMove(e) {
    if (!isDragging) return;

    const delta = clientY(e) - dragStartY;
    if (delta < 0) return;  // rope only pulls downward

    shutterY = Math.min(dragStartShutterY + delta, window.innerHeight + 60);
    shutter.style.transform = `translateY(${shutterY}px)`;

    // Slightly stretch braid to show tension
    const extraH = Math.min(delta * 0.18, 80);
    ropeBraid.style.height = `calc(50vh + ${extraH}px)`;

    e.preventDefault();
}

function onUp() {
    if (!isDragging) return;
    isDragging = false;

    // Resume sway
    ropeBraid.style.animationPlayState = '';
    ropeHandle.style.animationPlayState = '';
    ropeBraid.style.height = '50vh';

    if (shutterY >= window.innerHeight * 0.33) {
        // ── Enough pull → complete the reveal ──
        revealed = true;
        ropeActive = false;

        shutter.style.transition = 'transform 0.85s cubic-bezier(0.3, 0, 0.5, 1)';
        shutter.style.transform = `translateY(${window.innerHeight + 120}px)`;

        // Fade rope away
        setTimeout(() => {
            ropeAssembly.style.transition = 'opacity 0.4s ease';
            ropeAssembly.style.opacity = '0';
        }, 200);

        // Brief light flash on reveal
        setTimeout(() => {
            pageBg.classList.add('flash');
        }, 700);

        // Clean up transition
        setTimeout(() => {
            shutter.style.transition = 'none';
        }, 1000);

    } else {
        // ── Not enough → snap back ──
        shutter.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
        shutter.style.transform = 'translateY(0)';
        shutterY = 0;

        setTimeout(() => {
            shutter.style.transition = 'none';
        }, 500);
    }
}

/* ─── Bind Events ────────────────────────────────────────── */
ropeHandle.addEventListener('mousedown', onDown);
ropeHandle.addEventListener('touchstart', onDown, { passive: false });
document.addEventListener('mousemove', onMove);
document.addEventListener('touchmove', onMove, { passive: false });
document.addEventListener('mouseup', onUp);
document.addEventListener('touchend', onUp);

/* ─── Go ─────────────────────────────────────────────────── */
runSequence();






// ─── Config ───────────────────────────────────────────────
const IMAGE_DIR = './images/';          // path to your folder
const IMAGE_FILES = [
    'image1.png',
    'image2.png',
    'image3.png',
    // add as many as you like...
];
const PARTICLE_COUNT = 20;
// ──────────────────────────────────────────────────────────

const particleContainer = document.getElementById('particle-container');

function createParticle() {
    const img = document.createElement('img');
    const file = IMAGE_FILES[Math.floor(Math.random() * IMAGE_FILES.length)];

    img.src = IMAGE_DIR + file;
    img.classList.add('particle');
    img.draggable = false;

    img.style.left = Math.random() * 100 + 'vw';
    img.style.bottom = '-100px';
    // remove the img.style.top line
    img.style.animationDuration = (Math.random() * 10 + 5) + 's';

    // Optional: randomise size a bit so they feel more organic
    const size = Math.random() * 40 + 30;   // 30px – 70px
    img.style.width = size + 'px';
    img.style.height = size + 'px';
    img.style.objectFit = 'contain';

    particleContainer.appendChild(img);

    img.addEventListener('animationend', () => {
        img.remove();
        createParticle();
    });
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
    setTimeout(createParticle, i * 200);
}