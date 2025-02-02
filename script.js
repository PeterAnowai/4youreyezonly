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
const scrambledContainer = document.getElementById('scrambled-container');

/* Giphy URLs for happy/sad GIFs */
const HAPPY_GIF_URL = 'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif';
const SAD_GIF_URL   = 'https://media3.giphy.com/media/95W4wv8nnb9K/giphy.gif';

// Messages for the NO button
const noMessages = [
  "Wrong answer! Try again.",
  "Wrong answer. Don’t piss me off."
];
let currentMessageIndex = 0;

// Track current background color
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

  // Darken background
  darkenBackground();

  // Show sad Mocha Bear GIF
  gifContainer.innerHTML = `
    <img
      src="${SAD_GIF_URL}"
      alt="Sad Mocha Bear GIF"
    >
  `;

  // Switch to fixed for free movement
  noBtn.style.position = 'fixed';
  noBtn.style.transition = 'left 0.5s ease, top 0.5s ease';

  // Immediately move
  moveNoButton();

  // Keep moving for 5 seconds
  const movementInterval = setInterval(() => {
    moveNoButton();
  }, 600);

  // Clear the message & stop movement after 5s
  setTimeout(() => {
    message.textContent = '';
    clearInterval(movementInterval);
  }, 5000);
});

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
 * Moves the NO button randomly, avoiding overlap 
 * with the container.
 *******************************************************/
function moveNoButton() {
  const buttonWidth  = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;

  const maxX = window.innerWidth  - buttonWidth;
  const maxY = window.innerHeight - buttonHeight;

  const containerRect = document.querySelector('.container').getBoundingClientRect();

  let x, y;
  let attempts = 0;
  const maxAttempts = 50;

  while (attempts < maxAttempts) {
    x = Math.random() * maxX;
    y = Math.random() * maxY;
    if (!doesOverlap(x, y, buttonWidth, buttonHeight, containerRect)) {
      break;
    }
    attempts++;
  }

  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;

  // Temporarily disable pointer events to reset hover
  noBtn.style.pointerEvents = 'none';
  setTimeout(() => {
    noBtn.style.pointerEvents = 'auto';
  }, 10);
}

function doesOverlap(x, y, width, height, containerRect) {
  const buttonLeft   = x;
  const buttonRight  = x + width;
  const buttonTop    = y;
  const buttonBottom = y + height;

  const containerLeft   = containerRect.left;
  const containerRight  = containerRect.left + containerRect.width;
  const containerTop    = containerRect.top;
  const containerBottom = containerRect.top + containerRect.height;

  const overlapHoriz = (buttonLeft < containerRight) && (buttonRight > containerLeft);
  const overlapVert  = (buttonTop < containerBottom) && (buttonBottom > containerTop);

  return overlapHoriz && overlapVert;
}

/*******************************************************
 * SCRAMBLED LETTERS: "you are beautiful"
 *  1) Each letter spawns in a random spot inside #scrambled-container
 *  2) On hover, letters move to a single-line arrangement
 *     one word at a time.
 *******************************************************/
const sentence = "you are beautiful";
const words = sentence.split(" "); // ["you", "are", "beautiful"]

// Container dimensions
const containerWidth  = scrambledContainer.clientWidth;  // ~400px
const containerHeight = scrambledContainer.clientHeight; // ~60px

// We'll store data for each letter
let allLetters = [];

// 1) Build array of letters + spaces
words.forEach((word, wIndex) => {
  const letters = [...word];
  if (wIndex < words.length - 1) {
    letters.push(" "); // space after each word except the last
  }
  letters.forEach(char => {
    allLetters.push({ char, wordIndex: wIndex });
  });
});

// 2) Create & position each letter <span>
const letterWidth = 20;  // horizontal offset per character
const wordSpacing = 10;  // extra offset for spaces
let currentX = 0;        
let currentY = 20;       // vertical position to keep text visible in 60px height

allLetters.forEach(obj => {
  const span = document.createElement('span');
  span.className = 'scrambled-letter';
  span.textContent = obj.char;

  // Random initial position inside the container
  // Subtract a bit so letters aren't clipped at edges
  const randX = Math.random() * (containerWidth  - letterWidth);
  const randY = Math.random() * (containerHeight - 30);

  span.style.transform = `translate(${randX}px, ${randY}px)`;

  // Final position (left to right)
  obj.finalX = currentX;
  obj.finalY = currentY;

  // Advance currentX for next character
  currentX += letterWidth;
  if (obj.char === " ") {
    currentX += wordSpacing;
  }

  scrambledContainer.appendChild(span);
  obj.span = span;
});

// 3) Animate unscrambling on hover (word by word)
scrambledContainer.addEventListener('pointerenter', () => {
  let currentWordIndex = 0;
  
  function animateNextWord() {
    if (currentWordIndex >= words.length) return;

    // Move letters of this word into their final positions
    const wordLetters = allLetters.filter(l => l.wordIndex === currentWordIndex);
    wordLetters.forEach(letterObj => {
      letterObj.span.style.transform = 
        `translate(${letterObj.finalX}px, ${letterObj.finalY}px)`;
    });

    setTimeout(() => {
      currentWordIndex++;
      animateNextWord();
    }, 2000);
  }

  animateNextWord();
}, { once: true });
