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
let backgroundColor = '#ffebee';
document.body.style.backgroundColor = backgroundColor;

// Make "No" button move within screen boundaries
noBtn.addEventListener('mouseover', () => {
  const buttonWidth = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;

  // Calculate safe movement area
  const maxX = window.innerWidth - buttonWidth;
  const maxY = window.innerHeight - buttonHeight;

  // Generate new random position
  const newX = Math.random() * maxX;
  const newY = Math.random() * maxY;

  // 1) CLAMP the values so they never exceed 0 or maxX/maxY
  const safeX = Math.min(Math.max(newX, 0), maxX);
  const safeY = Math.min(Math.max(newY, 0), maxY);

  // 2) Apply the new position
  noBtn.style.left = `${safeX}px`;
  noBtn.style.top = `${safeY}px`;
});

// Darken background
function darkenBackground() {
  let r = parseInt(backgroundColor.slice(1, 3), 16);
  let g = parseInt(backgroundColor.slice(3, 5), 16);
  let b = parseInt(backgroundColor.slice(5, 7), 16);

  r = Math.max(r - 20, 0);
  g = Math.max(g - 20, 0);
  b = Math.max(b - 20, 0);

  backgroundColor = `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  document.body.style.backgroundColor = backgroundColor;
}

// Yes button
yesBtn.addEventListener('click', () => {
  message.textContent = 'Yay!';
  confettiSound.play();

  // Heart confetti
  const heartConfetti = () => {
    confetti({
      particleCount: 1,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      shapes: ['heart'],
      scalar: 2,
    });
    confetti({
      particleCount: 1,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      shapes: ['heart'],
      scalar: 2,
    });
  };

  for (let i = 0; i < 50; i++) {
    setTimeout(heartConfetti, i * 40);
  }

  // Change body background color
  document.body.style.transition = 'background-color 2s ease';
  document.body.style.backgroundColor = 'hotpink';
  setTimeout(() => {
    document.body.style.transition = '';
  }, 2000);

  // Show happy GIF
  gifContainer.innerHTML = `
    <img src="https://media.tenor.com/5DSfqbYz1J0AAAAC/milk-and-mocha.gif" 
         alt="Happy GIF">
  `;
});

// No button
noBtn.addEventListener('click', () => {
  message.textContent = noMessages[currentMessageIndex];
  currentMessageIndex = (currentMessageIndex + 1) % noMessages.length;
  darkenBackground();

  // Show sad GIF
  gifContainer.innerHTML = `
    <img src="https://media.tenor.com/4tDzD4jD2aAAAAAC/milk-and-mocha.gif" 
         alt="Sad GIF">
  `;
  // Clear message after 2 seconds
  setTimeout(() => {
    message.textContent = '';
  }, 2000);
});
