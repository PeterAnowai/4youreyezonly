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
 * DOM elements
 *******************************************************/
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const message = document.getElementById('message');
const gifContainer = document.getElementById('gif-container');
const confettiSound = document.getElementById('confetti-sound');
const scrambledContainer = document.getElementById('scrambled-container');

/* Replace Tenor URLs with reliable Giphy URLs */
const HAPPY_GIF_URL = 'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif';
const SAD_GIF_URL = 'https://media3.giphy.com/media/95W4wv8nnb9K/giphy.gif'; // Sad Mocha Bear GIF

// "No" button messages
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

  // Switch to fixed so we can move it anywhere
  noBtn.style.position = 'fixed';
  noBtn.style.transition = 'left 0.5s ease, top 0.5s ease';

  // Start moving immediately
  moveNoButton();

  // Keep moving for 5 seconds
  const movementInterval = setInterval(() => {
    moveNoButton();
  }, 600);

  // Clear message & stop after 5 seconds
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
  const buttonWidth = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;

  const maxX = window.innerWidth - buttonWidth;
  const maxY = window.innerHeight - buttonHeight;

  const container = document.querySelector('.container');
  const containerRect = container.getBoundingClientRect();

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
  noBtn.style.top = `${y}px`;

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
 *  - Randomly placed in #scrambled-container
 *  - On hover, arrange L->R, word by word
 *******************************************************/
const sentence = "you are beautiful";
const words = sentence.split(" "); // ["you", "are", "beautiful"]

// We'll create a letter <span> for each char, 
// place them randomly, and store final positions.
const letterSpans = [];
const containerWidth = scrambledContainer.clientWidth;
const containerHeight = scrambledContainer.clientHeight;

// 1) Create scrambled letters
let allLetters = []; // {char, wordIndex, span, finalX, finalY}
words.forEach((word, wIndex) => {
  // Split each word into letters. 
  // We'll also keep the space after the word (except maybe last word).
  const lettersInWord = [...word];
  if (wIndex < words.length - 1) {
    lettersInWord.push(" "); // add one space for separation
  }
  lettersInWord.forEach((char) => {
    allLetters.push({ char, wordIndex: wIndex });
  });
});

// 2) Append spans (scrambled) for each letter
//    and define final positions to create a left->right layout.
let currentX = 0;    // We'll build final positions left -> right
let currentY = 80;   // Middle-ish of the container
const letterWidth = 20;  // Our fixed letter spacing
const wordSpacing = 10;  // Additional spacing between words

allLetters.forEach((obj, i) => {
  const span = document.createElement('span');
  span.className = 'scrambled-letter';
  span.textContent = obj.char;

  // Random initial x, y within the container
  const randX = Math.random() * (containerWidth - letterWidth);
  const randY = Math.random() * (containerHeight - 30); 
  span.style.transform = `translate(${randX}px, ${randY}px)`;

  // Calculate final position for this letter
  // (We're simply placing letters in a row, left to right.)
  obj.finalX = currentX;
  obj.finalY = currentY;

  // Next letter's position
  currentX += letterWidth;

  // If this letter is a space, add extra word spacing
  if (obj.char === " ") {
    currentX += wordSpacing;
  }

  // Attach the span to the container
  scrambledContainer.appendChild(span);

  // Remember the span in the object for later
  obj.span = span;
});

// 3) On pointerenter, animate word by word, each in 2s
let hasAnimated = false;
scrambledContainer.addEventListener('pointerenter', () => {
  if (hasAnimated) return; // only animate once
  hasAnimated = true;

  // We'll do each word in sequence:
  //   word0 => 2s, then word1 => 2s, then word2 => 2s
  animateWordsSequentially();
});

/**
 * Animate words one at a time, each taking ~2s
 * "you" -> "are" -> "beautiful"
 */
function animateWordsSequentially() {
  let currentWordIndex = 0;

  function animateNextWord() {
    if (currentWordIndex >= words.length) {
      return; // done
    }
    // All letters in the current word => move them to final position
    const wordLetters = allLetters.filter(l => l.wordIndex === currentWordIndex);
    wordLetters.forEach(letterObj => {
      letterObj.span.style.transform = `translate(${letterObj.finalX}px, ${letterObj.finalY}px)`;
    });
    
    // After 2s, move on to the next word
    setTimeout(() => {
      currentWordIndex++;
      animateNextWord();
    }, 2000);
  }

  animateNextWord();
}
