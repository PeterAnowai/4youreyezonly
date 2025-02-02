// Grab relevant DOM elements
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const message = document.getElementById('message');
const gifContainer = document.getElementById('gif-container');
const confettiSound = document.getElementById('confetti-sound');

/* Replace Tenor URLs with reliable Giphy URLs */
const HAPPY_GIF_URL = 'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif';
const SAD_GIF_URL = 'https://media3.giphy.com/media/95W4wv8nnb9K/giphy.gif'; // Sad Mocha Bear GIF

// Messages for the NO button
const noMessages = [
  "Wrong answer! Try again.",
  "Wrong answer. Don’t piss me off."
];
let currentMessageIndex = 0;

/*
  We want 3 runaways. After the 3rd, the button stays still for a click.
  Once clicked, it IMMEDIATELY moves again (kicking off a new cycle).
*/
let timesMoved = 0; // tracks runaways per cycle

// Keep track of the current background color
let backgroundColor = '#ffebee';
document.body.style.backgroundColor = backgroundColor;

/* =============== YES BUTTON =============== */
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

  // Display happy GIF (using Giphy URL)
  gifContainer.innerHTML = `
    <img
      src="${HAPPY_GIF_URL}"
      alt="Happy GIF"
    >
  `;
});

/* =============== NO BUTTON =============== */

/**
 * Use 'pointerenter' so the event only fires once when the pointer
 * first enters the button. This avoids multiple triggers for a single hover.
 */
noBtn.addEventListener('pointerenter', () => {
  // Move up to 3 times. If timesMoved >= 3, let the user click.
  if (timesMoved < 3) {
    moveNoButton();
    timesMoved++;
  }
});

// When "No" is clicked...
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

  // Clear message after 2 seconds
  setTimeout(() => {
    message.textContent = '';
  }, 2000);

  // Reset runaways (new cycle)...
  timesMoved = 0;

  // ...and IMMEDIATELY move again right after being clicked
  moveNoButton();
  timesMoved = 1; // This counts as the first move of the new cycle
});

/* Darken the background color by 20 each time "No" is clicked */
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

/* Moves the NO button to a random position within the viewport */
function moveNoButton() {
  const buttonWidth = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;

  const maxX = window.innerWidth - buttonWidth;
  const maxY = window.innerHeight - buttonHeight;

  // Get the container's position and dimensions
  const container = document.querySelector('.container');
  const containerRect = container.getBoundingClientRect();

  // Define a safe area where the button won't overlap the container
  const safeX = Math.random() * (maxX - containerRect.width) + containerRect.width;
  const safeY = Math.random() * (maxY - containerRect.height) + containerRect.height;

  // Clamp the button's position to ensure it stays within the viewport
  const clampedX = Math.min(Math.max(safeX, 0), maxX);
  const clampedY = Math.min(Math.max(safeY, 0), maxY);

  noBtn.style.left = `${clampedX}px`;
  noBtn.style.top = `${clampedY}px`;

  // Temporarily disable pointer events to reset the hover state
  noBtn.style.pointerEvents = 'none';
  setTimeout(() => {
    noBtn.style.pointerEvents = 'auto';
  }, 10);
}