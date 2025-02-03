/****************************************************************
 * BACKGROUND MUSIC SETUP
 ****************************************************************/
document.addEventListener('click', startBgMusic);
document.addEventListener('touchstart', startBgMusic);

function startBgMusic() {
  console.log("User interaction received, trying to start background music.");
  const bgMusic = document.getElementById('bg-music');
  bgMusic.muted = false;
  bgMusic.play().catch(error => {
    console.error("Background music couldn't play:", error);
  });

  // Remove listeners after first interaction
  document.removeEventListener('click', startBgMusic);
  document.removeEventListener('touchstart', startBgMusic);
}

/****************************************************************
 * DOM ELEMENTS
 ****************************************************************/
const yesBtn         = document.getElementById('yes-btn');
const noBtn          = document.getElementById('no-btn');
const message        = document.getElementById('message');
const gifContainer   = document.getElementById('gif-container');
const confettiSound  = document.getElementById('confetti-sound');

/* For the background color transitions */
let originalBodyColor = '#ffebee'; // the pink
document.body.style.backgroundColor = originalBodyColor;

/* Giphy URLs */
const HAPPY_GIF_URL = 'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif';
const SAD_GIF_URL   = 'https://media3.giphy.com/media/95W4wv8nnb9K/giphy.gif';

/* NO BUTTON MESSAGES */
const noMessages = [
  "Wrong answer! Try again.",
  "Wrong answer. Don’t piss me off."
];
let currentMessageIndex = 0;

/****************************************************************
 * NO BUTTON FUNCTIONALITY
 ****************************************************************/
noBtn.addEventListener('click', () => {
  // Display one of the "No" messages
  message.textContent = noMessages[currentMessageIndex];
  currentMessageIndex = (currentMessageIndex + 1) % noMessages.length;

  // Darken background slightly
  darkenBackground();

  // Show sad GIF (fade in, then out)
  gifContainer.innerHTML = `<img src="${SAD_GIF_URL}" alt="Sad Mocha Bear GIF">`;
  gifContainer.style.opacity = 1; // fade in quickly

  setTimeout(() => {
    gifContainer.style.opacity = 0; // fade out
  }, 3000);

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
  // Darken each component by 20
  let [r, g, b] = hexToRgb(document.body.style.backgroundColor) || [255, 235, 238];
  r = Math.max(r - 20, 0);
  g = Math.max(g - 20, 0);
  b = Math.max(b - 20, 0);
  document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

function moveNoButton() {
  const buttonWidth  = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;

  const maxX = window.innerWidth  - buttonWidth;
  const maxY = window.innerHeight - buttonHeight;

  // Avoid overlapping the main container
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
  noBtn.style.pointerEvents = 'none'; // reset hover
  setTimeout(() => { noBtn.style.pointerEvents = 'auto'; }, 10);
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

function hexToRgb(hexColor) {
  // Handles #rrggbb or rgb(r,g,b)
  if (hexColor.startsWith('#')) {
    const r = parseInt(hexColor.slice(1,3), 16);
    const g = parseInt(hexColor.slice(3,5), 16);
    const b = parseInt(hexColor.slice(5,7), 16);
    return [r,g,b];
  } else if (hexColor.startsWith('rgb')) {
    // parse "rgb(r, g, b)"
    const match = hexColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
  }
  return null;
}

/****************************************************************
 * CREATE SIX SCRAMBLED BOXES (NON-OVERLAPPING)
 ****************************************************************/
const scrambledTexts = [
  "You are awesome",
  "Be kind always",
  "Never give up",
  "Smile every day",
  "Cherish each moment",
  "Believe in yourself"
];

let scrambledBoxes = [];

// Create them on page load
window.addEventListener('load', createAllScrambledBoxes);

function createAllScrambledBoxes() {
  const mainContainer = document.querySelector('.container');

  scrambledTexts.forEach(sentence => {
    const box = document.createElement('div');
    box.className = 'scrambled-box';

    // Place it so it doesn't overlap .container or other boxes
    placeBoxRandomly(box, mainContainer);

    // Scramble the sentence inside this box
    scrambleTextIntoBox(sentence, box);

    document.body.appendChild(box);
    scrambledBoxes.push(box);
  });
}

function placeBoxRandomly(box, mainContainer) {
  const MAX_ATTEMPTS = 100;
  const boxWidth  = 200;  // approximate
  const boxHeight = 60;   // approximate

  // Temporarily set the box size for overlap checks
  box.style.width  = boxWidth + 'px';
  box.style.height = boxHeight + 'px';

  let attempts = 0;
  let placed = false;

  while (!placed && attempts < MAX_ATTEMPTS) {
    attempts++;
    const x = Math.floor(Math.random() * (window.innerWidth  - boxWidth));
    const y = Math.floor(Math.random() * (window.innerHeight - boxHeight));

    // Check overlap with .container
    const containerRect = mainContainer.getBoundingClientRect();
    if (rectsOverlap(x, y, boxWidth, boxHeight, containerRect)) continue;

    // Check overlap with other scrambled-boxes
    let overlapFound = false;
    for (const other of document.querySelectorAll('.scrambled-box')) {
      if (other === box) continue;
      const otherRect = other.getBoundingClientRect();
      if (rectsOverlap(x, y, boxWidth, boxHeight, otherRect)) {
        overlapFound = true;
        break;
      }
    }

    if (!overlapFound) {
      // Place it
      box.style.left = x + 'px';
      box.style.top  = y + 'px';
      placed = true;
    }
  }
}

function rectsOverlap(x, y, w, h, rect2) {
  const left1   = x;
  const right1  = x + w;
  const top1    = y;
  const bottom1 = y + h;

  const left2   = rect2.left;
  const right2  = rect2.left + rect2.width;
  const top2    = rect2.top;
  const bottom2 = rect2.top + rect2.height;

  const overlapHoriz = (left1 < right2) && (right1 > left2);
  const overlapVert  = (top1 < bottom2) && (bottom1 > top2);

  return overlapHoriz && overlapVert;
}

function scrambleTextIntoBox(sentence, box) {
  // We'll scramble each sentence the same way
  const words = sentence.split(' ');
  const allLetters = [];
  
  words.forEach((word, wIndex) => {
    const letters = [...word];
    // add space after each word except last
    if (wIndex < words.length - 1) letters.push(" ");
    letters.forEach(char => {
      allLetters.push({ char, wordIndex: wIndex });
    });
  });

  let currentX = 10;
  let currentY = 20;
  const letterWidth = 10;
  const wordSpacing = 5;

  allLetters.forEach(obj => {
    const span = document.createElement('span');
    span.className = 'scrambled-letter';
    span.textContent = obj.char;

    // random initial position
    const randX = Math.random() * 100;
    const randY = Math.random() * 30;
    const randomAngle = Math.random() * 60 - 30;
    span.style.transform = `translate(${randX}px, ${randY}px) rotate(${randomAngle}deg)`;
    span.style.opacity = '0.7';

    // final position
    obj.finalX = currentX;
    obj.finalY = currentY;

    currentX += letterWidth;
    if (obj.char === " ") {
      currentX += wordSpacing;
    }

    box.appendChild(span);
    obj.span = span;
  });

  box.__letters = allLetters;
  box.__isUnscrambled = false;
}

/****************************************************************
 * "YES" BUTTON: On each click, unscramble exactly one box
 *  - Transition page to black
 *  - Fireworks around that box
 *  - Fade in happy GIF, fade out after unscramble
 *  - Return to pink after unscramble
 ****************************************************************/
let unscrambleIndex = 0; // which box unscrambles next

yesBtn.addEventListener('click', handleYesClick);

function handleYesClick() {
  // Play the "Hooray" sound effect every time
  confettiSound.currentTime = 0;
  confettiSound.play().catch(e=>console.log(e));

  // If we've unscrambled all 6 already, do nothing else
  if (unscrambleIndex >= scrambledBoxes.length) {
    return;
  }

  // Start unscrambling the next box
  const targetBox = scrambledBoxes[unscrambleIndex];
  unscrambleIndex++;

  // Fade page to black
  document.body.style.backgroundColor = 'black';

  // Fade in happy GIF
  gifContainer.innerHTML = `<img src="${HAPPY_GIF_URL}" alt="Happy GIF">`;
  gifContainer.style.opacity = 1; 

  // Fireworks while unscrambling
  startFireworksAroundBox(targetBox);

  unscrambleBox(targetBox, () => {
    // After unscrambling finishes:
    // revert body color
    document.body.style.backgroundColor = originalBodyColor;

    // fade out gif
    gifContainer.style.opacity = 0;
    setTimeout(() => { gifContainer.innerHTML = ''; }, 2000);

    // If all boxes unscrambled, change heading
    if (unscrambleIndex >= scrambledBoxes.length) {
      document.querySelector('h1').textContent = "Will you be My Valentines?";
    }
  });
}

function unscrambleBox(box, onDone) {
  if (box.__isUnscrambled) {
    if (onDone) onDone();
    return;
  }
  box.__isUnscrambled = true;

  const allLetters = box.__letters;
  const wordsCount = 1 + Math.max(...allLetters.map(l => l.wordIndex));

  let currentWordIndex = 0;

  function animateNextWord() {
    if (currentWordIndex >= wordsCount) {
      if (onDone) onDone();
      return;
    }

    const wordLetters = allLetters.filter(l => l.wordIndex === currentWordIndex);
    wordLetters.forEach(letterObj => {
      letterObj.span.style.transform = `translate(${letterObj.finalX}px, ${letterObj.finalY}px) rotate(0deg)`;
      letterObj.span.style.opacity = '1';
    });

    setTimeout(() => {
      currentWordIndex++;
      animateNextWord();
    }, 2000);
  }

  animateNextWord();
}

function startFireworksAroundBox(box) {
  const rect = box.getBoundingClientRect();
  const centerX = (rect.left + rect.right) / 2;
  const centerY = (rect.top + rect.bottom) / 2;

  // We'll shoot fireworks for 2.5 seconds
  const endTime = Date.now() + 2500;

  (function frame() {
    const timeLeft = endTime - Date.now();
    if (timeLeft <= 0) return;

    // Confetti near the box center
    confetti({
      particleCount: 4,
      angle: Math.random() * 360,
      spread: 55,
      origin: {
        x: centerX / window.innerWidth,
        y: centerY / window.innerHeight
      }
    });

    requestAnimationFrame(frame);
  })();
}
