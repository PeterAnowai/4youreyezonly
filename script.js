/*******************************************************
 * Start background music on the first user interaction
 *******************************************************/
document.addEventListener('click', startBgMusic);
document.addEventListener('touchstart', startBgMusic);

function startBgMusic() {
  console.log("User interaction received, trying to start background music.");
  const bgMusic = document.getElementById('bg-music');
  bgMusic.muted = false;
  bgMusic.play().then(() => {
    console.log("Background music playing!");
  }).catch(error => {
    console.error("Background music couldn't play:", error);
  });

  // Remove listeners after first interaction
  document.removeEventListener('click', startBgMusic);
  document.removeEventListener('touchstart', startBgMusic);
}

/*******************************************************
 * Grab relevant DOM elements
 *******************************************************/
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const message = document.getElementById('message');
const gifContainer = document.getElementById('gif-container');
const confettiSound = document.getElementById('confetti-sound');

// Scrambled text container
const scrambledContainer = document.getElementById('scrambled-container');

/* Replace Tenor URLs with reliable Giphy URLs */
const HAPPY_GIF_URL = 'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif';
const SAD_GIF_URL = 'https://media3.giphy.com/media/95W4wv8nnb9K/giphy.gif'; // Sad Mocha Bear GIF

// Messages for the NO button
const noMessages = [
  "Wrong answer! Try again.",
  "Wrong answer. Don’t piss me off."
];
let currentMessageIndex = 0;

// Keep track of the current background color
let backgroundColor = '#ffebee';
document.body.style.backgroundColor = backgroundColor;

/*******************************************************
 * YES BUTTON
 *******************************************************/
yesBtn.addEventListener('click', () => {
  message.textContent = 'Yay!';
  confettiSound.play();

  // Heart confetti
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 1,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        shapes: ['heart'],
        scalar: 2
      });
      confetti({
        particleCount: 1,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        shapes: ['heart'],
        scalar: 2
      });
    }, i * 40);
  }

  // Transition background to hotpink
  document.body.style.transition = 'background-color 2s ease';
  document.body.style.backgroundColor = 'hotpink';
  setTimeout(() => {
    document.body.style.transition = '';
  }, 2000);

  // Display happy GIF
  gifContainer.innerHTML = `
    <img
      src="${HAPPY_GIF_URL}"
      alt="Happy GIF"
    >
  `;
});

/*******************************************************
 * NO BUTTON
 *******************************************************/
noBtn.addEventListener('click', () => {
  // Display one of the "No" messages
  message.textContent = noMessages[currentMessageIndex];
  currentMessageIndex = (currentMessageIndex + 1) % noMessages.length;

  // Darken the background
  darkenBackground();

  // Show sad Mocha Bear GIF
  gifContainer.innerHTML = `
    <img
      src="${SAD_GIF_URL}"
      alt="Sad Mocha Bear GIF"
    >
  `;

  // Switch to fixed positioning so we can move it anywhere
  noBtn.style.position = 'fixed';
  noBtn.style.transition = 'left 0.5s ease, top 0.5s ease';

  // Start moving immediately
  moveNoButton();

  // Keep moving the button periodically for the next 5 seconds
  const movementInterval = setInterval(() => {
    moveNoButton();
  }, 600);

  // Clear the message (and stop movement) after 5 seconds
  setTimeout(() => {
    message.textContent = '';
    clearInterval(movementInterval);
  }, 5000);
});

/** 
 * Darken the background color by 20 each time "No" is clicked 
 */
function darkenBackground() {
  let r = parseInt(backgroundColor.slice(1, 3), 16);
  let g = parseInt(backgroundColor.slice(3, 5), 16);
  let b = parseInt(backgroundColor.slice(5, 7), 16);

  r = Math.max(r - 20, 0);
  g = Math.max(g - 20, 0);
  b = Math.max(b - 20, 0);

  backgroundColor = `#${r.toString(16).padStart(2, '0')}`
                  + `${g.toString(16).padStart(2, '0')}`
                  + `${b.toString(16).padStart(2, '0')}`;
  document.body.style.backgroundColor = backgroundColor;
}

/*******************************************************
 * Moves the NO button to a random position 
 * in the viewport WITHOUT overlapping the container.
 *******************************************************/
function moveNoButton() {
  const buttonWidth = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;

  // The maximum valid x/y so the button stays fully within the viewport
  const maxX = window.innerWidth - buttonWidth;
  const maxY = window.innerHeight - buttonHeight;

  // Get the container's bounding box
  const container = document.querySelector('.container');
  const containerRect = container.getBoundingClientRect();

  // We'll try multiple times in case a random pick overlaps the container
  let x, y;
  let attempts = 0;
  const maxAttempts = 50; // A limit to prevent infinite loops

  while (attempts < maxAttempts) {
    // Pick a random position in the viewport
    x = Math.random() * maxX;
    y = Math.random() * maxY;

    // Check if this position overlaps with the container
    if (!doesOverlap(x, y, buttonWidth, buttonHeight, containerRect)) {
      // If it does NOT overlap, we can use this position
      break;
    }
    attempts++;
  }

  // Move the button to the chosen coordinates
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  // Temporarily disable pointer events to reset the hover state
  noBtn.style.pointerEvents = 'none';
  setTimeout(() => {
    noBtn.style.pointerEvents = 'auto';
  }, 10);
}

/** 
 * Helper function: detect overlap between
 * the NO button and the container.
 */
function doesOverlap(x, y, width, height, containerRect) {
  // Button's bounding box
  const buttonLeft   = x;
  const buttonRight  = x + width;
  const buttonTop    = y;
  const buttonBottom = y + height;

  // Container's bounding box
  const containerLeft   = containerRect.left;
  const containerRight  = containerRect.left + containerRect.width;
  const containerTop    = containerRect.top;
  const containerBottom = containerRect.top + containerRect.height;

  // Overlap occurs if horizontally AND vertically intersecting
  const overlapHoriz = (buttonLeft < containerRight) && (buttonRight > containerLeft);
  const overlapVert  = (buttonTop < containerBottom) && (buttonBottom > containerTop);

  return overlapHoriz && overlapVert;
}

/*******************************************************
 * SCRAMBLED TEXT LOGIC
 * 1) Generate scrambled text of "you are beautiful"
 * 2) Place in #scrambled-container
 * 3) On hover, unscramble over 2 seconds
 *******************************************************/
const originalText = "you are beautiful";
const scrambledText = scrambleString(originalText); // Build a scrambled version
scrambledContainer.textContent = scrambledText;

// When user hovers on the scrambled container, unscramble over 2 seconds
scrambledContainer.addEventListener('pointerenter', () => {
  unscrambleOverTime(scrambledText, originalText, 2000);
}, { once: true }); 
// `{ once: true }` ensures it unscrambles only on the FIRST hover.
// Remove this if you want it to unscramble every time you hover.

/**
 * Creates a scrambled version of a given string 
 * by shuffling all the letters randomly.
 */
function scrambleString(str) {
  // Convert to array of characters
  const arr = str.split("");
  // Fisher-Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

/**
 * Unscramble the scrambled text to the original text over `duration` ms
 * in a smooth, step-by-step animation.
 */
function unscrambleOverTime(scrambled, target, duration) {
  const steps = 20; // how many animation steps
  const stepTime = duration / steps; // time per step (ms)
  let current = scrambled.split("");

  let currentStep = 0;
  const intervalId = setInterval(() => {
    currentStep++;
    // Each step, for each character, we randomly decide 
    // to replace it with the correct letter or not.
    for (let i = 0; i < current.length; i++) {
      // We'll "lock in" correct characters more and more as we approach the final step
      const progress = currentStep / steps; // from 0.0 to 1.0
      // Decide randomly whether to place correct char or keep random char
      if (Math.random() < progress) {
        current[i] = target[i];
      } else {
        // Keep or re-scramble
        current[i] = getRandomChar();
      }
    }
    scrambledContainer.textContent = current.join("");

    // Final step: set the text to the exact target
    if (currentStep === steps) {
      clearInterval(intervalId);
      scrambledContainer.textContent = target;
    }
  }, stepTime);
}

/**
 * Return a random character from A-Z or a space
 * to emulate "scrambled" letters during unscrambling.
 */
function getRandomChar() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";
  return chars.charAt(Math.floor(Math.random() * chars.length));
}
