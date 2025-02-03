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

/* Store the original position of No button so we can reset it later */
const noBtnInitialPosition = {
  left: noBtn.offsetLeft,
  top:  noBtn.offsetTop
};

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
noBtn.addEventListener('click', handleNoClick);

function handleNoClick() {
  // Display one of the "No" messages
  message.textContent = noMessages[currentMessageIndex];
  currentMessageIndex = (currentMessageIndex + 1) % noMessages.length;

  // Darken background slightly
  darkenBackground();

  // Show sad GIF (fade in, then out)
  gifContainer.innerHTML = `<img src="${SAD_GIF_URL}" alt="Sad Mocha Bear GIF">`;
  gifContainer.style.opacity = 1; // fade in

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
    // Return the No button to its original position
    resetNoButtonPosition();
  }, 5000);
}

function resetNoButtonPosition() {
  noBtn.style.position = '';
  noBtn.style.left = '';
  noBtn.style.top  = '';
}

function darkenBackground() {
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
  if (hexColor.startsWith('#')) {
    const r = parseInt(hexColor.slice(1,3), 16);
    const g = parseInt(hexColor.slice(3,5), 16);
    const b = parseInt(hexColor.slice(5,7), 16);
    return [r,g,b];
  } else if (hexColor.startsWith('rgb')) {
    const match = hexColor.match(/rgb\\((\\d+),\\s*(\\d+),\\s*(\\d+)\\)/);
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
  "You are beautiful",
  "You are smart",
  "You are amazing",
  "You are a blessing",
  "You are an angel",
  "You are mine"
];

let scrambledBoxes = [];
let unscrambleIndex = 0; // which box unscrambles next

// Create them on page load
window.addEventListener('load', createAllScrambledBoxes);

function createAllScrambledBoxes() {
  const mainContainer = document.querySelector('.container');

  scrambledTexts.forEach(sentence => {
    const box = document.createElement('div');
    box.className = 'scrambled-box';

    // Scramble first to measure how wide it should be
    scrambleTextIntoBox(sentence, box);

    const neededWidth = measureScrambledBoxWidth(box);
    box.style.width = neededWidth + 'px';
    box.style.height = '60px';

    placeBoxRandomly(box, mainContainer, neededWidth, 60);

    document.body.appendChild(box);
    scrambledBoxes.push(box);
  });
}

function measureScrambledBoxWidth(box) {
  const allLetters = box.__letters;
  if (!allLetters || allLetters.length === 0) return 200;
  const maxFinalX = Math.max(...allLetters.map(l => l.finalX));
  return maxFinalX + 30; // margin
}

function placeBoxRandomly(box, mainContainer, boxWidth, boxHeight) {
  const MAX_ATTEMPTS = 100;
  let attempts = 0;
  let placed   = false;

  while (!placed && attempts < MAX_ATTEMPTS) {
    attempts++;
    const x = Math.floor(Math.random() * (window.innerWidth  - boxWidth));
    const y = Math.floor(Math.random() * (window.innerHeight - boxHeight));

    const containerRect = mainContainer.getBoundingClientRect();
    if (rectsOverlap(x, y, boxWidth, boxHeight, containerRect)) continue;

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
  const words = sentence.split(' ');
  const allLetters = [];
  
  words.forEach((word, wIndex) => {
    const letters = [...word];
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

    const randX = Math.random() * 100;
    const randY = Math.random() * 30;
    const randomAngle = Math.random() * 60 - 30;
    span.style.transform = `translate(${randX}px, ${randY}px) rotate(${randomAngle}deg)`;
    span.style.opacity = '0.7';

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
 * "YES" BUTTON: 
 *   1) If not all boxes unscrambled, unscramble the next one. 
 *   2) If all boxes unscrambled and heading is "Will you be My Valentines?", 
 *      rearrange all boxes in a vertical stack beneath the GIF with confetti for ~5s
 ****************************************************************/
yesBtn.addEventListener('click', handleYesClick);

function handleYesClick() {
  // Always play the "Hooray" sound
  confettiSound.currentTime = 0;
  confettiSound.play().catch(e => console.log(e));

  const heading = document.querySelector('h1');

  // CASE 1: Not all boxes unscrambled yet
  if (unscrambleIndex < scrambledBoxes.length) {
    startUnscrambleProcess();
    return;
  }

  // CASE 2: All boxes unscrambled
  // If heading is already "Will you be My Valentines?", we do the new alignment
  if (heading.textContent === "Will you be My Valentines?") {
    handleFinalAlignment();
  }
}

function startUnscrambleProcess() {
  // If we've unscrambled all 6 already, do nothing
  if (unscrambleIndex >= scrambledBoxes.length) return;

  const targetBox = scrambledBoxes[unscrambleIndex];
  unscrambleIndex++;

  // Fade to black
  document.body.style.backgroundColor = 'black';

  // Fade in happy GIF (if it's not already on)
  gifContainer.innerHTML = `<img src="${HAPPY_GIF_URL}" alt="Happy GIF">`;
  gifContainer.style.opacity = 1;

  // Fireworks around that box
  startFireworksAroundBox(targetBox);

  unscrambleBox(targetBox, () => {
    document.body.style.backgroundColor = originalBodyColor;

    // If all unscrambled, update heading
    if (unscrambleIndex >= scrambledBoxes.length) {
      document.querySelector('h1').textContent = "Will you be My Valentines?";
      // Keep the GIF on screen (don't fade out)
    } else {
      // Otherwise, fade out the GIF
      gifContainer.style.opacity = 0;
      setTimeout(() => {
        gifContainer.innerHTML = '';
      }, 2000);
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

/****************************************************************
 * FINAL ALIGNMENT:
 *  Screen -> black
 *  All boxes align vertically under the GIF container
 *  Confetti "falls" until 3s after they align ( ~5s total ) 
 *  Then background returns to pink
 ****************************************************************/
function handleFinalAlignment() {
  // 1) Fade screen to black
  document.body.style.backgroundColor = 'black';

  // 2) Align all boxes vertically beneath the GIF container
  alignBoxesVerticallyUnderGif();

  // 3) Start confetti for ~5 seconds
  const endTime = Date.now() + 5000;
  let confettiInterval;
  
  (function continuousConfetti() {
    const now = Date.now();
    if (now >= endTime) {
      // 4) After 5s, revert to pink
      document.body.style.backgroundColor = originalBodyColor;
      clearInterval(confettiInterval);
      return;
    }

    confetti({
      particleCount: 6,
      angle: 90,
      spread: 60,
      startVelocity: 20,
      origin: { x: 0.5, y: -0.01 } // "falling from top"
    });

    confettiInterval = requestAnimationFrame(continuousConfetti);
  })();
}

function alignBoxesVerticallyUnderGif() {
  // We'll stack them under the GIF in the center of the page
  const gifRect = gifContainer.getBoundingClientRect();
  
  // Let's define a starting top position ~20px below the GIF
  // and center the boxes horizontally
  const startY = gifRect.bottom + 20;
  const centerX = window.innerWidth / 2;

  // Each box is about 60px tall, let's do 10px gap
  let currentY = startY;

  scrambledBoxes.forEach(box => {
    // transform from their current position to a new top/left
    // We'll center them on centerX => left = centerX - (boxWidth/2)
    const boxRect = box.getBoundingClientRect();
    const boxWidth = boxRect.width;

    const left = centerX - (boxWidth / 2);

    box.style.left = left + 'px';
    box.style.top  = currentY + 'px';

    currentY += (boxRect.height + 10);
  });
}
