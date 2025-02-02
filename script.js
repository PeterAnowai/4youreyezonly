// Grabbing DOM elements
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

// Track how many times the "No" button has moved since last clicked
let movesSinceLastClickAllowed = 0;

// Initial background color
let backgroundColor = '#ffebee';
document.body.style.backgroundColor = backgroundColor;

// YES button logic
yesBtn.addEventListener('click', () => {
  message.textContent = 'Yay!';
  confettiSound.play();

  // Heart confetti effect
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

// NO button - runs away on hover, but only up to 3 times
noBtn.addEventListener('mouseover', () => {
  if (movesSinceLastClickAllowed < 3) {
    moveNoButton();
    movesSinceLastClickAllowed++;
  }
});

// NO button - click event
noBtn.addEventListener('click', () => {
  // Display next "No" message
  message.textContent = noMessages[currentMessageIndex];
  currentMessageIndex = (currentMessageIndex + 1) % noMessages.length;

  // Darken the background
  darkenBackground();

  // Display sad GIF
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

  // Reset move count, so it will run away 3 times again after the next click
  movesSinceLastClickAllowed = 0;
});

// Darkens the background color by 20 per channel
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

// Moves the "No" button to a random position within the screen bounds
function moveNoButton() {
  const buttonWidth = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;

  // Calculate maximum X and Y so the button stays on screen
  const maxX = window.innerWidth - buttonWidth;
  const maxY = window.innerHeight - buttonHeight;

  // Generate random positions
  const newX = Math.random() * maxX;
  const newY = Math.random() * maxY;

  // Optionally clamp if you want extra safety:
  const safeX = Math.min(Math.max(newX, 0), maxX);
  const safeY = Math.min(Math.max(newY, 0), maxY);

  // Set the new position
  noBtn.style.left = `${safeX}px`;
  noBtn.style.top = `${safeY}px`;
}
