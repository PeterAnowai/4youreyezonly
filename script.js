// Grab elements
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const message = document.getElementById('message');
const gifContainer = document.getElementById('gif-container');
const confettiSound = document.getElementById('confetti-sound');

const noMessages = [
  "Wrong answer! Try again.",
  "Wrong answer. Don’t piss me off."
];
let currentMessageIndex = 0;

// We track how many times the "No" button has moved in the *current* cycle
let timesMoved = 0;

// Background color tracking
let backgroundColor = '#ffebee';
document.body.style.backgroundColor = backgroundColor;

/** =============== YES BUTTON =============== */
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
      src="https://media.tenor.com/5DSfqbYz1J0AAAAC/milk-and-mocha.gif"
      alt="Happy GIF"
    >
  `;
});

/** =============== NO BUTTON =============== */
/*
  1) Run away on pointerenter up to 3 times.
  2) Then stay still until clicked.
  3) As soon as user clicks, immediately move the button (kicking off the next cycle).
*/

// "Run away" on pointerenter, but only if timesMoved < 3
noBtn.addEventListener('pointerenter', () => {
  if (timesMoved < 3) {
    moveNoButton();
    timesMoved++;
  }
});

// Click event for "No"
noBtn.addEventListener('click', () => {
  // Show "No" message
  message.textContent = noMessages[currentMessageIndex];
  currentMessageIndex = (currentMessageIndex + 1) % noMessages.length;

  // Darken background
  darkenBackground();

  // Sad GIF
  gifContainer.innerHTML = `
    <img
      src="https://media.tenor.com/4tDzD4jD2aAAAAAC/milk-and-mocha.gif"
      alt="Sad GIF"
    >
  `;

  // Clear message after 2 seconds
  setTimeout(() => {
    message.textContent = '';
  }, 2000);

  // Reset timesMoved to 0 to start a new cycle
  timesMoved = 0;

  // Immediately move the button again (count this as the first move of the new cycle)
  moveNoButton();
  timesMoved = 1; 
});

/** Darken the background color each time "No" is clicked */
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

/** Moves the "No" button to a random position within the viewport */
function moveNoButton() {
  const buttonWidth = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;

  const maxX = window.innerWidth - buttonWidth;
  const maxY = window.innerHeight - buttonHeight;

  const newX = Math.random() * maxX;
  const newY = Math.random() * maxY;

  // Clamp if necessary
  const safeX = Math.min(Math.max(newX, 0), maxX);
  const safeY = Math.min(Math.max(newY, 0), maxY);

  noBtn.style.left = `${safeX}px`;
  noBtn.style.top = `${safeY}px`;
}
