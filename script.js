// Constants
const FLOWER_TYPES = {
  ROSE: ['fa-solid fa-rose', '🌹'],
  PETAL: ['fa-solid fa-leaf', '🌸'],
  HEART: ['fa-solid fa-heart', '❤️']
};
const HAPPY_GIF_URL = 'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif';
const SAD_GIF_URL = 'https://media.giphy.com/media/3o7TKsQ8UQ0ZPTBZHO/giphy.gif';
const noMessages = [
  "That's not the right answer!",
  "Try again, sweetheart!",
  "Are you sure about that?",
  "You might want to reconsider!"
];

// DOM Elements
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const message = document.getElementById('message');
const gifContainer = document.getElementById('gif-container');
const confettiSound = document.getElementById('confetti-sound');

// State
let currentMessageIndex = 0;
let unscrambleIndex = 0;
let scrambledBoxes = [];

// Audio Setup
document.addEventListener('click', startBgMusic);
document.addEventListener('touchstart', startBgMusic);

function startBgMusic() {
  const bgMusic = document.getElementById('bg-music');
  bgMusic.muted = false;
  bgMusic.play().catch(console.error);
  
  document.removeEventListener('click', startBgMusic);
  document.removeEventListener('touchstart', startBgMusic);
}

// No Button Logic
noBtn.addEventListener('click', handleNoClick);

function handleNoClick() {
  message.textContent = noMessages[currentMessageIndex];
  currentMessageIndex = (currentMessageIndex + 1) % noMessages.length;

  // Visual feedback
  gifContainer.innerHTML = `<img src="${SAD_GIF_URL}" alt="Crying cartoon">`;
  gifContainer.style.opacity = '1';
  document.body.style.backgroundColor = darkenColor(document.body.style.backgroundColor);
  
  // Button movement
  noBtn.style.position = 'fixed';
  moveNoButton();
  const moveInterval = setInterval(moveNoButton, 600);
  
  setTimeout(() => {
    gifContainer.style.opacity = '0';
    clearInterval(moveInterval);
    resetNoButtonPosition();
  }, 3000);
}

// Yes Button Logic
yesBtn.addEventListener('click', handleYesClick);

function handleYesClick() {
  confettiSound.play().catch(console.error);
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  if (unscrambleIndex < scrambledBoxes.length) {
    unscrambleNextBox();
  } else {
    finalCelebration();
  }
}

// Flower Animation System
function spawnFlower({ xMin, xMax, yStart }) {
  const flower = document.createElement('i');
  const flowerType = Math.random() > 0.7 ? FLOWER_TYPES.HEART : 
                    Math.random() > 0.4 ? FLOWER_TYPES.ROSE : 
                    FLOWER_TYPES.PETAL;

  if (typeof FontAwesomeIcon !== 'undefined') {
    flower.className = `falling-flower ${flowerType[0]}`;
    if (flowerType === FLOWER_TYPES.PETAL) flower.classList.add('petal');
  } else {
    flower.textContent = flowerType[1];
    flower.style.fontFamily = 'Arial, sans-serif';
  }

  flower.style.left = `${Math.random() * (xMax - xMin) + xMin}px`;
  flower.style.top = `${yStart}px`;
  
  document.body.appendChild(flower);
  setTimeout(() => flower.remove(), 4000);
}

// Helper Functions
function darkenColor(currentColor) {
  const [r, g, b] = hexToRgb(currentColor);
  return `rgb(${Math.max(r-20,0)}, ${Math.max(g-20,0)}, ${Math.max(b-20,0)})`;
}

function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [255, 235, 238];
}

// Initialization
window.addEventListener('load', () => {
  document.getElementById('loading').style.opacity = '0';
  setTimeout(() => {
    document.getElementById('loading').style.display = 'none';
  }, 500);
  
  createScrambledBoxes();
});

// Scrambled Boxes System (keep your existing implementation here)
// ... [rest of your scrambled boxes code] ...