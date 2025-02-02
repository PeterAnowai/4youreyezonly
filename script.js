const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const message = document.getElementById('message');
const gifContainer = document.getElementById('gif-container');

// Array of messages for the "No" button
const noMessages = [
  "Wrong answer! Try again.",
  "Wrong answer. Don’t piss me off."
];
let currentMessageIndex = 0;

// Initial background color (light pink)
let backgroundColor = '#ffebee';
document.body.style.backgroundColor = backgroundColor;

// Function to darken the background color by one shade
function darkenBackground() {
  // Convert the hex color to RGB
  let r = parseInt(backgroundColor.slice(1, 3), 16);
  let g = parseInt(backgroundColor.slice(3, 5), 16);
  let b = parseInt(backgroundColor.slice(5, 7), 16);

  // Reduce each RGB component by 20 (one shade darker)
  r = Math.max(r - 20, 0); // Ensure it doesn't go below 0
  g = Math.max(g - 20, 0);
  b = Math.max(b - 20, 0);

  // Convert back to hex
  backgroundColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

  // Update the background color
  document.body.style.backgroundColor = backgroundColor;
}

// When "Yes" is clicked
yesBtn.addEventListener('click', () => {
  // Display "Yay!" and trigger confetti
  message.textContent = 'Yay!';
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  // Slowly transition the background color to hot pink
  document.body.style.transition = 'background-color 2s ease'; // 2-second transition
  document.body.style.backgroundColor = 'hotpink';

  // Reset the transition after the animation is done
  setTimeout(() => {
    document.body.style.transition = ''; // Remove the transition
  }, 2000); // Match the duration of the transition

  // Display the happy GIF
  gifContainer.innerHTML = `<img src="https://media.tenor.com/5DSfqbYz1J0AAAAC/milk-and-mocha-happy.gif" alt="Happy GIF">`;
});

// When "No" is clicked
noBtn.addEventListener('click', () => {
  // Display the current message
  message.textContent = noMessages[currentMessageIndex];

  // Alternate to the next message
  currentMessageIndex = (currentMessageIndex + 1) % noMessages.length;

  // Darken the background color by one shade
  darkenBackground();

  // Display the sad GIF
  gifContainer.innerHTML = `<img src="https://media.tenor.com/4tDzD4jD2aAAAAAC/milk-and-mocha-crying.gif" alt="Sad GIF">`;

  // Clear the message after 1 second
  setTimeout(() => {
    message.textContent = '';
  }, 1000);
});