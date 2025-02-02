const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const message = document.getElementById('message');

// Array of messages for the "No" button
const noMessages = [
  "Wrong answer! Try again.",
  "Wrong answer. Don’t piss me off."
];
let currentMessageIndex = 0;

// Initial background color
let backgroundColor = '#ffebee'; // Light pink
document.body.style.backgroundColor = backgroundColor;

// Function to darken the background color
function darkenBackground() {
  // Convert the hex color to RGB
  let r = parseInt(backgroundColor.slice(1, 3), 16);
  let g = parseInt(backgroundColor.slice(3, 5), 16);
  let b = parseInt(backgroundColor.slice(5, 7), 16);

  // Darken each RGB component by 10%
  r = Math.floor(r * 0.9);
  g = Math.floor(g * 0.9);
  b = Math.floor(b * 0.9);

  // Convert back to hex
  backgroundColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

  // Update the background color
  document.body.style.backgroundColor = backgroundColor;
}

// When "Yes" is clicked
yesBtn.addEventListener('click', () => {
  // Reset background color to hot pink
  backgroundColor = 'hotpink';
  document.body.style.backgroundColor = backgroundColor;

  // Display "Yay!" and trigger confetti
  message.textContent = 'Yay!';
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
});

// When "No" is clicked
noBtn.addEventListener('click', () => {
  // Display the current message
  message.textContent = noMessages[currentMessageIndex];

  // Alternate to the next message
  currentMessageIndex = (currentMessageIndex + 1) % noMessages.length;

  // Darken the background color
  darkenBackground();

  // Clear the message after 1 second
  setTimeout(() => {
    message.textContent = '';
  }, 1000);
});