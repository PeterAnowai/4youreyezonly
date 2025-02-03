// ===================== CHANGED LINES =====================
// Updated sad GIF URL to Mocha Bear
const SAD_GIF_URL = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDhsb3N0eWJ5c3A5NnR6Z3Q4OGV0bmJ5N3Z0bG1jMGx0bGJ4aDZ1NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKsQ8UQ0ZPTBZHO/giphy.gif';

// Updated hexToRgb function (fixed regex)
function hexToRgb(hexColor) {
  if (hexColor.startsWith('#')) {
    const r = parseInt(hexColor.slice(1,3), 16);
    const g = parseInt(hexColor.slice(3,5), 16);
    const b = parseInt(hexColor.slice(5,7), 16);
    return [r,g,b];
  } else if (hexColor.startsWith('rgb')) {
    // FIXED REGEX PATTERN
    const match = hexColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
  }
  return [255, 235, 238]; // Return default if parsing fails
}

// Updated alignment functions
function alignBoxesVerticallyUnderGif() {
  const container = document.querySelector('.container');
  const gifRect = gifContainer.getBoundingClientRect();
  
  // Calculate total height needed
  let totalHeight = gifRect.height + 20;
  scrambledBoxes.forEach(box => {
    totalHeight += box.offsetHeight + 10;
  });

  // Move container up if needed
  const viewportHeight = window.innerHeight;
  if (totalHeight > viewportHeight * 0.8) {
    const moveUpBy = totalHeight - viewportHeight * 0.7;
    container.style.top = `-${moveUpBy}px`;
  }

  // Position boxes
  const startY = gifRect.bottom + 20 - parseInt(container.style.top || 0);
  const centerX = window.innerWidth / 2;
  let currentY = startY;

  scrambledBoxes.forEach(box => {
    const boxWidth = box.offsetWidth;
    const left = centerX - (boxWidth / 2);
    
    box.style.left = `${left}px`;
    box.style.top = `${currentY}px`;
    
    currentY += box.offsetHeight + 10;
  });
}

function handleFinalAlignment() {
  document.body.style.backgroundColor = 'black';
  const container = document.querySelector('.container');

  alignBoxesVerticallyUnderGif();

  startRoseRainFullScreen(5000, () => {
    document.body.style.backgroundColor = originalBodyColor;
    // Reset container position
    container.style.top = '0';
  });
}

// ===================== UNCHANGED LINES BELOW =====================
// (All other code remains exactly as in your original file)
// ----------------------------------------------------------------
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
  console.log("No button clicked.");
  message.textContent = noMessages[currentMessageIndex];
  currentMessageIndex = (currentMessageIndex + 1) % noMessages.length;

  // Darken background slightly
  darkenBackground();

  // Show sad GIF
  gifContainer.innerHTML = `<img src="${SAD_GIF_URL}" alt="Sad Mocha Bear GIF">`;
  gifContainer.style.opacity = 1; 

  setTimeout(() => {
    gifContainer.style.opacity = 0; 
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
  const containerRight  = containerRect.left + containerRect.width;
  const containerTop    = containerRect.top;
  const containerBottom = containerRect.top + containerRect.height;

  const overlapHoriz = (buttonLeft < containerRight) && (buttonRight > containerLeft);
  const overlapVert  = (buttonTop < containerBottom) && (buttonBottom > containerTop);

  return overlapHoriz && overlapVert;
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

window.addEventListener('load', createAllScrambledBoxes);

function createAllScrambledBoxes() {
  console.log("Creating scrambled boxes...");
  const mainContainer = document.querySelector('.container');

  scrambledTexts.forEach(sentence => {
    const box = document.createElement('div');
    box.className = 'scrambled-box';

    scrambleTextIntoBox(sentence, box);

    const neededWidth = measureScrambledBoxWidth(box);
    box.style.width = neededWidth + 'px';
    box.style.height = '60px';

    placeBoxRandomly(box, mainContainer, neededWidth, 60);

    document.body.appendChild(box);
    scrambledBoxes.push(box);
  });
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

/****************************************************************
 * "YES" BUTTON
 ****************************************************************/
yesBtn.addEventListener('click', handleYesClick);

function handleYesClick() {
  console.log("Yes button clicked.");
  confettiSound.currentTime = 0;
  confettiSound.play().catch(e => console.log(e));

  const heading = document.querySelector('h1');

  // CASE 1: Not all boxes unscrambled yet
  if (unscrambleIndex < scrambledBoxes.length) {
    console.log(`Unscrambling box #${unscrambleIndex+1}`);
    startUnscrambleProcess();
    return;
  }

  // CASE 2: All boxes unscrambled
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

  // Make sure happy GIF is visible
  gifContainer.innerHTML = `<img src="${HAPPY_GIF_URL}" alt="Happy GIF">`;
  gifContainer.style.opacity = 1;

  unscrambleBoxWithRoses(targetBox, () => {
    // After unscramble
    document.body.style.backgroundColor = originalBodyColor;

    // If all unscrambled, update heading
    if (unscrambleIndex >= scrambledBoxes.length) {
      document.querySelector('h1').textContent = "Will you be My Valentines?";
      console.log("All boxes unscrambled! Heading updated.");
      // Keep the GIF
    } else {
      // Hide the GIF until next unscramble
      gifContainer.style.opacity = 0;
      setTimeout(() => { gifContainer.innerHTML = ''; }, 2000);
    }
  });
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
      console.log("Box unscramble done.");
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
 * startRoseRainAroundBox
 */
function startRoseRainAroundBox(box, duration) {
  console.log("startRoseRainAroundBox for " + duration + "ms");
  const endTime = Date.now() + duration;
  const rect = box.getBoundingClientRect();

  (function frame() {
    const now = Date.now();
    if (now >= endTime) {
      console.log("Rose rain around box ended.");
      return;
    }

    spawnRose({
      xMin: rect.left,
      xMax: rect.right,
      yStart: rect.top - 30
    });
    requestAnimationFrame(frame);
  })();
}

/**
 * spawnRose
 */
function spawnRose({ xMin, xMax, yStart }) {
  const rose = document.createElement('img');
  // inline base64 rose PNG
  rose.src = RENDER_ROSE_BASE64;
  rose.className = 'falling-rose';

  const xPos = Math.floor(Math.random() * (xMax - xMin)) + xMin;
  rose.style.left = xPos + 'px';
  rose.style.top  = yStart + 'px';

  document.body.appendChild(rose);

  // remove after animation (~5s)
  setTimeout(() => {
    if (rose.parentNode) {
      rose.parentNode.removeChild(rose);
    }
  }, 5000);
}

/****************************************************************
 * FINAL ALIGNMENT
 ****************************************************************/
function startRoseRainFullScreen(duration, callback) {
  console.log(`startRoseRainFullScreen for ${duration}ms`);
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

/****************************************************************
 * ROSE IMAGE
 ****************************************************************/
const RENDER_ROSE_BASE64 = 
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAqCAYAAAB/YiEDAAAACXBIWXMAABYlAAAWJQFJUiTwAAACD0lEQVRYhe3XP2hTYRTG8ZdOGvAHaSN7DWUWA3WYuMeRDYiG6iFuJF4AkjQ3rIOLOHRAUa6CXYxUNhKUHkQEv9Dx5E0nvbj7KRnX66tyV+jrp