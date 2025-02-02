// Grab elements
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const message = document.getElementById('message');
const gifContainer = document.getElementById('gif-container');
const confettiSound = document.getElementById('confetti-sound');

// "No" button messages
const noMessages = [
  "Wrong answer! Try again.",
  "Wrong answer. Don’t piss me off."
];
let currentMessageIndex = 0;

// Track how many times the button has moved *this cycle*
let movesSinceLastClickAllowed = 0;

// Initial background color
let backgroundColor = '#ffebee';
document.body.style.backgroundColor = backgroundColor;

/** YES BUTTON **/
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

  // Transition the background to hotpink
  document.body.style.transition = 'background-color 2s ease';
  document.body.style.backgroundColor = 'hotpink';
  setTimeout(() => {
    document.body.style.transition = '';
  }, 2000);

  // Show happy GIF
  gifContainer.innerHTML = `
    <img
      src="https://media.tenor.com/5DSfqbYz1J0AAAAC/milk-and-mocha.gif"
      alt="Happy GIF"
    >
  `;
});

/** NO BUTTON **/
/**
 * We use 'pointerenter' so we only fire once each time
 * the mouse (or touch) enters the button area.
 */
noBtn.addEventListener('pointerenter', () => {
  // The button runs away only if it hasn't moved 3 times yet
  if (movesSinceLastClickAllowed < 3) {
    moveNoButton();
    movesSinceLastClickAllowed++;
  }
});

// Clicking "No" triggers the "Wrong answer" logic
noBtn.addEventListener('click', () => {
  message.textContent = noMessages[currentMessageIndex];
  currentMessageIndex = (currentMessageIndex + 1) % noMessages.length;

  // Darken background
  darkenBackground();

  // Show sad GIF
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

  // Reset so next time, it can run away 3 more times if you want that cycle repeated
  movesSinceLastClickAllowed = 0;
});

/** Darkens the background each time "No" is clicked */
function darkenBackground() {
  let r = parseInt(backgroundColor.slice(1, 3), 16);
  let g = parseInt(backgroundColor.slice(3, 5), 16);
  let b = parseInt(backgroundColor.slice(5, 7), 16);

  // Subtract 20 from each channel, bottoming out at 0
  r = Math.max(r - 20, 0);
  g = Math.max(g - 20, 0);
  b = Math.max(b - 20, 0);

  backgroundColor = `#${r.toString(16).padStart(2, '0')}`
                  + `${g.toString(16).padStart(2, '0')}`
                  + `${b.toString(16).padStart(2, '0')}`;

  document.body.style.backgroundColor = backgroundColor;
}

/** Moves the "No" button to a random position within the screen */
function moveNoButton() {
  const buttonWidth = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;

  // Calculate how far it can move without going off screen
  const maxX = window.innerWidth - buttonWidth;
  const maxY = window.innerHeight - buttonHeight;

  // Random new position
  const newX = Math.random() * maxX;
  const newY = Math.random() * maxY;

  // Optional clamp if needed
  const safeX = Math.min(Math.max(newX, 0), maxX);
  const safeY = Math.min(Math.max(newY, 0), maxY);

  noBtn.style.left = `${safeX}px`;
  noBtn.style.top = `${safeY}px`;
}
