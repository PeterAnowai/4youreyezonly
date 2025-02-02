const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const message = document.getElementById('message');
const gifContainer = document.getElementById('gif-container');
const confettiSound = document.getElementById('confetti-sound');

// Messages and state
const noMessages = [
  "Wrong answer! Try again.",
  "Wrong answer. Don’t piss me off."
];
let currentMessageIndex = 0;
let backgroundColor = '#ffebee';
document.body.style.backgroundColor = backgroundColor;

// Make "No" button escape
noBtn.addEventListener('mouseover', () => {
  const x = Math.random() * (window.innerWidth - 100);
  const y = Math.random() * (window.innerHeight - 50);
  noBtn.style.position = 'absolute';
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
});

// Darken background
function darkenBackground() {
  let r = parseInt(backgroundColor.slice(1, 3), 16);
  let g = parseInt(backgroundColor.slice(3, 5), 16);
  let b = parseInt(backgroundColor.slice(5, 7), 16);

  r = Math.max(r - 20, 0);
  g = Math.max(g - 20, 0);
  b = Math.max(b - 20, 0);

  backgroundColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  document.body.style.backgroundColor = backgroundColor;
}

// Yes button handler
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
  };

  for (let i = 0; i < 50; i++) {
    setTimeout(heartConfetti, i * 40);
  }

  document.body.style.transition = 'background-color 2s ease';
  document.body.style.backgroundColor = 'hotpink';
  setTimeout(() => document.body.style.transition = '', 2000);

  gifContainer.innerHTML = `<img src="https://media.tenor.com/5DSfqbYz1J0AAAAC/milk-and-mocha-happy.gif" alt="Happy GIF">`;
});

// No button handler
noBtn.addEventListener('click', () => {
  message.textContent = noMessages[currentMessageIndex];
  currentMessageIndex = (currentMessageIndex + 1) % noMessages.length;
  darkenBackground();
  gifContainer.innerHTML = `<img src="https://media.tenor.com/4tDzD4jD2aAAAAAC/milk-and-mocha-crying.gif" alt="Sad GIF">`;
  setTimeout(() => message.textContent = '', 2000);
});