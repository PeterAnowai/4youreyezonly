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

/* For background color transitions */
let originalBodyColor = '#ffebee'; // the pink
document.body.style.backgroundColor = originalBodyColor;

/* Giphy URLs */
const HAPPY_GIF_URL = 'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif';
const SAD_GIF_URL   = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDhsb3N0eWJ5c3A5NnR6Z3Q4OGV0bmJ5N3Z0bG1jMGx0bGJ4aDZ1NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKsQ8UQ0ZPTBZHO/giphy.gif';

/* NO BUTTON MESSAGES */
const noMessages = [
  "Wrong answer! Try again.",
  "Wrong answer. Don’t piss me off."
];
let currentMessageIndex = 0;

/****************************************************************
 * NO BUTTON LOGIC
 ****************************************************************/
noBtn.addEventListener('click', handleNoClick);

function handleNoClick() {
  message.textContent = noMessages[currentMessageIndex];
  currentMessageIndex = (currentMessageIndex + 1) % noMessages.length;

  darkenBackground();

  // Show sad GIF
  gifContainer.innerHTML = `<img src="${SAD_GIF_URL}" alt="Sad Mocha Bear GIF">`;
  gifContainer.style.opacity = 1; 
  setTimeout(() => { gifContainer.style.opacity = 0; }, 3000);

  // Switch to fixed for free movement
  noBtn.style.position = 'fixed';
  noBtn.style.transition = 'left 0.5s ease, top 0.5s ease';

  // Immediately move
  moveNoButton();

  // Keep moving for 5s
  const movementInterval = setInterval(() => {
    moveNoButton();
  }, 600);

  // Clear message & stop movement after 5s
  setTimeout(() => {
    message.textContent = '';
    clearInterval(movementInterval);
    resetNoButtonPosition();
  }, 5000);
}

function resetNoButtonPosition() {
  noBtn.style.position = '';
  noBtn.style.left = '';
  noBtn.style.top  = '';
}

function darkenBackground() {
  let [r,g,b] = hexToRgb(document.body.style.backgroundColor) || [255,235,238];
  r = Math.max(r - 20, 0);
  g = Math.max(g - 20, 0);
  b = Math.max(b - 20, 0);
  document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

function moveNoButton() {
  const buttonWidth  = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;
  const maxX = window.innerWidth - buttonWidth;
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
  noBtn.style.pointerEvents = 'none'; 
  setTimeout(() => { noBtn.style.pointerEvents = 'auto'; }, 10);
}

function doesOverlap(x, y, width, height, containerRect) {
  const buttonLeft   = x;
  const buttonRight  = x + width;
  const buttonTop    = y;
  const buttonBottom = y + height;

  const containerLeft   = containerRect.left;
  const containerRight  = containerRect.right;
  const containerTop    = containerRect.top;
  const containerBottom = containerRect.bottom;

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
  }
  else if (hexColor.startsWith('rgb')) {
    const match = hexColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
  }
  return null;
}

/****************************************************************
 * CREATE THE SCRAMBLED BOXES (MOBILE vs DESKTOP)
 ****************************************************************/
const scrambledTexts = [
  "You are beautiful",
  "You are smart",
  "You are amazing",
  "You are mine",
  "You are gorgeous",
  "You are pretty",
  "Thank you for all of your love",
  "You are a blessing",
  "You are an angel",
  "I love you"
];

let scrambledBoxes = [];
let unscrambleIndex = 0;

// Determine mobile vs. desktop
function isMobileView() {
  return window.innerWidth < 600;
}

window.addEventListener('load', createAllScrambledBoxes);

function createAllScrambledBoxes() {
  scrambledTexts.forEach(sentence => {
    const box = document.createElement('div');
    box.className = 'scrambled-box';
    scrambleTextIntoBox(sentence, box);

    // Desktop => 60px, Mobile => 40px
    const boxHeight = isMobileView() ? 40 : 60;
    const neededWidth = measureScrambledBoxWidth(box);
    const boxWidth  = isMobileView()
      ? Math.floor(neededWidth * 0.8) // shrink 20% on mobile
      : neededWidth;

    box.style.width  = boxWidth + 'px';
    box.style.height = boxHeight + 'px';

    placeBoxRandomly(box, boxWidth, boxHeight);
    document.body.appendChild(box);
    scrambledBoxes.push(box);
  });
}

/**
 * placeBoxRandomly => no overlap with container, yes/no, other boxes
 */
function placeBoxRandomly(box, boxWidth, boxHeight) {
  const MAX_ATTEMPTS = 200;
  let attempts = 0;
  let placed   = false;

  const containerRect = document.querySelector('.container').getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const noRect  = noBtn.getBoundingClientRect();

  const existingBoxRects = scrambledBoxes.map(b => b.getBoundingClientRect());

  while (!placed && attempts < MAX_ATTEMPTS) {
    attempts++;

    const x = Math.floor(Math.random() * (window.innerWidth  - boxWidth));
    const y = Math.floor(Math.random() * (window.innerHeight - boxHeight));

    if (rectsOverlap({ x, y, w: boxWidth, h: boxHeight }, containerRect)) continue;
    if (rectsOverlap({ x, y, w: boxWidth, h: boxHeight }, yesRect))       continue;
    if (rectsOverlap({ x, y, w: boxWidth, h: boxHeight }, noRect))        continue;

    let overlapFound = false;
    for (let r of existingBoxRects) {
      if (rectsOverlap({ x, y, w: boxWidth, h: boxHeight }, r)) {
        overlapFound = true;
        break;
      }
    }
    if (overlapFound) continue;

    // If we get here, we found a non-overlapping spot
    box.style.left = x + 'px';
    box.style.top  = y + 'px';
    box.style.position = 'absolute';
    placed = true;
  }
}

/**
 * rectsOverlap => used by placeBoxRandomly
 */
function rectsOverlap(rect1, rect2) {
  const left1   = rect1.x;
  const right1  = rect1.x + rect1.w;
  const top1    = rect1.y;
  const bottom1 = rect1.y + rect1.h;

  const left2   = rect2.left;
  const right2  = rect2.right;
  const top2    = rect2.top;
  const bottom2 = rect2.bottom;

  return (left1 < right2) && (right1 > left2) &&
         (top1 < bottom2) && (bottom1 > top2);
}

function scrambleTextIntoBox(sentence, box) {
  const words = sentence.split(' ');
  const allLetters = [];

  const letterWidth = isMobileView() ? 7 : 10;
  const wordSpacing = isMobileView() ? 3 : 5;

  words.forEach((word, wIndex) => {
    const letters = [...word];
    if (wIndex < words.length - 1) letters.push(" ");
    letters.forEach(char => {
      allLetters.push({ char, wordIndex: wIndex });
    });
  });

  let currentX = 10;
  let currentY = 20;

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

function measureScrambledBoxWidth(box) {
  const allLetters = box.__letters || [];
  if (!allLetters.length) return 200;
  const maxFinalX = Math.max(...allLetters.map(l => l.finalX));
  return maxFinalX + 30; 
}

/****************************************************************
 * "YES" BUTTON => unscramble or final alignment
 *   with rose rain + fireworks
 ****************************************************************/
yesBtn.addEventListener('click', handleYesClick);

function handleYesClick() {
  console.log("Yes button clicked.");
  confettiSound.currentTime = 0;
  confettiSound.play().catch(e => console.log(e));

  const heading = document.querySelector('h1');

  // Not all boxes unscrambled
  if (unscrambleIndex < scrambledBoxes.length) {
    console.log(`Unscrambling box #${unscrambleIndex+1}`);
    startUnscrambleProcess();
    return;
  }

  // All boxes unscrambled => final alignment
  if (heading.textContent === "Will you be My Valentines?") {
    console.log("Final alignment triggered.");
    handleFinalAlignment();
  }
}

function startUnscrambleProcess() {
  if (unscrambleIndex >= scrambledBoxes.length) return;
  const targetBox = scrambledBoxes[unscrambleIndex];
  unscrambleIndex++;

  document.body.style.backgroundColor = 'black';

  // show happy GIF
  gifContainer.innerHTML = `<img src="${HAPPY_GIF_URL}" alt="Happy GIF">`;
  gifContainer.style.opacity = 1;

  // unscramble the box with a short (2.5s) rose rain
  unscrambleBoxWithRoses(targetBox, () => {
    document.body.style.backgroundColor = originalBodyColor;

    // update heading if last box
    if (unscrambleIndex >= scrambledBoxes.length) {
      document.querySelector('h1').textContent = "Will you be My Valentines?";
      console.log("All boxes unscrambled! Heading updated.");
    } else {
      // hide the GIF until next unscramble
      gifContainer.style.opacity = 0;
      setTimeout(() => { gifContainer.innerHTML = ''; }, 2000);
    }
  });

  // also 2.5s fireworks
  startFireworks(2500);
}

function unscrambleBoxWithRoses(box, onDone) {
  if (box.__isUnscrambled) {
    if (onDone) onDone();
    return;
  }
  box.__isUnscrambled = true;

  console.log("Starting rose rain around unscrambling box.");
  startRoseRainAroundBox(box, 2500);

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

/**
 * short rose rain ~2.5s
 */
function startRoseRainAroundBox(box, duration) {
  const endTime = Date.now() + duration;
  const rect = box.getBoundingClientRect();

  (function frame() {
    const now = Date.now();
    if (now >= endTime) return;

    spawnRose({
      xMin: rect.left,
      xMax: rect.right,
      yStart: rect.top - 30
    });
    requestAnimationFrame(frame);
  })();
}

/**
 * spawnRose => local rose.png
 */
function spawnRose({ xMin, xMax, yStart }) {
  const rose = document.createElement('img');
  rose.src = 'rose.png'; 
  rose.className = 'falling-rose';

  const xPos = Math.floor(Math.random() * (xMax - xMin)) + xMin;
  rose.style.left = xPos + 'px';
  rose.style.top  = yStart + 'px';

  document.body.appendChild(rose);

  // remove after ~5s fall
  setTimeout(() => {
    if (rose.parentNode) {
      rose.parentNode.removeChild(rose);
    }
  }, 5000);
}

/****************************************************************
 * FIREWORKS => runs fireworks for duration
 ****************************************************************/
let fireworksInstance = null;

function startFireworks(duration) {
  console.log(`startFireworks for ${duration}ms`);

  // If there's already an instance, stop it
  if (fireworksInstance) {
    fireworksInstance.stop();
    fireworksInstance = null;
  }

  const container = document.body;
  fireworksInstance = new Fireworks(container, {
    speed: 3,
    acceleration: 1.05,
    friction: 0.95,
    gravity: 1.5,
    particles: 50,
    trace: 3,
    explosion: 5,
    boundaries: {
      x: 50,
      y: 50,
      width: container.clientWidth - 100,
      height: container.clientHeight - 100
    },
    sound: { enable: false }
  });

  fireworksInstance.start();

  setTimeout(() => {
    if (fireworksInstance) {
      fireworksInstance.stop();
      fireworksInstance = null;
    }
  }, duration);
}

/****************************************************************
 * FINAL ALIGNMENT => 5s rose rain + fireworks
 ****************************************************************/
function handleFinalAlignment() {
  console.log("handleFinalAlignment => screen black, line up boxes, 5s rose rain + fireworks.");
  document.body.style.backgroundColor = 'black';

  alignBoxesVerticallyOrSides(); /* your choice of arrangement */

  // 5s rose rain
  startRoseRainFullScreen(5000, () => {
    console.log("Full-screen rose rain done. Return to pink.");
    document.body.style.backgroundColor = originalBodyColor;
  });

  // 5s fireworks
  startFireworks(5000);
}

/**
 * alignBoxesVerticallyOrSides => pick your final arrangement
 */
function alignBoxesVerticallyOrSides() {
  console.log("Aligning boxes for final arrangement...");
  // Example: 5 left, 5 right
  const mainContainer = document.querySelector('.container');
  const containerRect = mainContainer.getBoundingClientRect();
  const spacing = 10;  
  const boxHeight = isMobileView() ? 40 : 60;

  scrambledBoxes.forEach((box, i) => {
    const boxRect = box.getBoundingClientRect();
    const boxWidth = boxRect.width;

    // first 5 => left, next 5 => right
    if (i < 5) {
      const topCoord = containerRect.top + i * (boxHeight + spacing);
      const leftCoord = containerRect.left - (boxWidth + 20);
      box.style.left = leftCoord + 'px';
      box.style.top  = topCoord  + 'px';
    } else {
      const colIndex = i - 5;
      const topCoord = containerRect.top + colIndex * (boxHeight + spacing);
      const leftCoord = containerRect.right + 20;
      box.style.left = leftCoord + 'px';
      box.style.top  = topCoord  + 'px';
    }
  });
}

/**
 * 5s full-screen rose rain
 */
function startRoseRainFullScreen(duration, callback) {
  const endTime = Date.now() + duration;
  (function frame() {
    const now = Date.now();
    if (now >= endTime) {
      if (callback) callback();
      return;
    }
    for (let i = 0; i < 3; i++) {
      spawnRose({ 
        xMin: 0, 
        xMax: window.innerWidth, 
        yStart: -60 
      });
    }
    requestAnimationFrame(frame);
  })();
}
