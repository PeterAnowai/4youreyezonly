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
const SAD_GIF_URL   = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDhsb3N0eWJ5c3A5NnR6Z3Q4OGV0bmJ5N3Z0bG1jMGx0bGJ4aDZ1NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKsQ8UQ0ZPTBZHO/giphy.gif';

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

/**
 * Randomly moves the "No" button (during the 5-second scramble).
 */
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

function hexToRgb(hexColor) {
  if (hexColor.startsWith('#')) {
    const r = parseInt(hexColor.slice(1,3), 16);
    const g = parseInt(hexColor.slice(3,5), 16);
    const b = parseInt(hexColor.slice(5,7), 16);
    return [r,g,b];
  } else if (hexColor.startsWith('rgb')) {
    const match = hexColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
  }
  return null;
}

/****************************************************************
 * CREATE SIX SCRAMBLED BOXES (START OFF RANDOM)
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

    // measure how wide the text wants to be
    const neededWidth = measureScrambledBoxWidth(box);
    box.style.width = neededWidth + 'px';
    box.style.height = '60px';

    // Place them randomly at first
    placeBoxRandomly(box, mainContainer, neededWidth, 60);

    document.body.appendChild(box);
    scrambledBoxes.push(box);
  });
}

/**
 * placeBoxRandomly - tries to find a random x,y so that:
 *   1) The box is fully within the window
 *   2) Doesn't overlap .container
 */
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

    // no overlap => place the box
    box.style.left = x + 'px';
    box.style.top  = y + 'px';
    box.style.position = 'absolute';
    placed = true;
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

    // random initial position for scramble effect
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
 * "YES" BUTTON
 * 1) If not all boxes unscrambled, unscramble the next one.
 * 2) If all boxes unscrambled and heading is "Will you be My Valentines?",
 *    line them up 3 left / 3 right next to .container, then rose rain.
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

  // CASE 2: All boxes unscrambled. 
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
 * startRoseRainAroundBox - spawns short-lived rose images 
 * near the top of the given box for 'duration' ms
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
 * spawnRose - 
 *  creates an <img> with inline base64 "rose" 
 *  at a random x between xMin, xMax, and top = yStart 
 *  uses .falling-rose CSS 
 */
function spawnRose({ xMin, xMax, yStart }) {
  const rose = document.createElement('img');
  // inline base64 rose PNG to avoid external links
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
 * FINAL ALIGNMENT:
 *   1) Screen -> black
 *   2) Boxes -> 3 on left, 3 on right of .container
 *   3) Roses from full screen top for 5s
 *   4) Return to pink
 ****************************************************************/
function handleFinalAlignment() {
  console.log("handleFinalAlignment => screen black, line up boxes left/right, rain roses.");
  document.body.style.backgroundColor = 'black';

  alignBoxesLeftAndRightOfContainer();

  startRoseRainFullScreen(5000, () => {
    console.log("Full-screen rose rain done. Return to pink.");
    document.body.style.backgroundColor = originalBodyColor;
  });
}

/**
 * Place the 6 boxes so that:
 *  - indices 0..2 on the left side of .container, stacked vertically
 *  - indices 3..5 on the right side of .container, stacked vertically
 */
function alignBoxesLeftAndRightOfContainer() {
  const mainContainer = document.querySelector('.container');
  const containerRect = mainContainer.getBoundingClientRect();

  // We'll assume each box is ~60px tall, with 10px spacing
  const spacing = 10;  
  const boxHeight = 60;

  scrambledBoxes.forEach((box, i) => {
    const boxRect = box.getBoundingClientRect();
    const boxWidth = boxRect.width;

    // For i in [0..2], place left; for i in [3..5], place right
    const colIndex = i < 3 ? i : i - 3;

    const leftCoord = i < 3 
      ? containerRect.left - (boxWidth + 20)  // left side
      : containerRect.right + 20;            // right side

    const topCoord = containerRect.top + colIndex * (boxHeight + spacing);

    box.style.left = leftCoord + 'px';
    box.style.top  = topCoord  + 'px';
  });
}

/**
 * startRoseRainFullScreen - spawns roses from top for 'duration' ms
 */
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
 * Our Inline Base64 Rose Image
 ****************************************************************/
const RENDER_ROSE_BASE64 = 
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAqCAYAAAB/YiEDAAAACXBIWXMAABYlAAAWJQFJUiTwAAACD0lEQVRYhe3XP2hTYRTG8ZdOGvAHaSN7DWUWA3WYuMeRDYiG6iFuJF4AkjQ3rIOLOHRAUa6CXYxUNhKUHkQEv9Dx5E0nvbj7KRnX66tyV+jrpvb/N2+939253/O/KiO6zhMG/Ze0Jqe3vjQZWguob31D59R+9EWOiNIlaRSIXONbdAW4GNLhXnUFou0EquB6my3kvXKSfGE/vxzUUQdFv5enbFRPVrSfRAKMLOiygd0twB8o4kssoNBQr3DyO93zN1wM2mvJJPDpnr/hzqg4odrXwNy9WdP5G0asNxK7jWTUzWpWJspqnMDqLxkRtrt9VDFSTvnw6kl7nOVZaq12mylg92UH7Mdq7w/Pp4zSCmwqHNU+G2dhZ5Dv5E09tWBHt1mXCxWPaZMVntMG9oRPEwNu1T/IVYI1EhgqHzY5GKKEGyd/j08pthYKCeaY3XhEjsMRuIURdJpUzpNrc3VTbnP4ryA1NmqU4rpGKn7r8bnWBqcxHaXfug05MR+ifCUPul2cxVt+o7er8VVUJFDxc98+c++KBDZz2LgRrXSlDSYkZMJu04rcrFK7c+S476u7LDp1Zrc+pAbpWZI9l4IOqEGykk+KC/lfJbPnQnXs2n9JacYVKUUpA99L2Y1uS6300bNX2pLnK/FZbl+SERk67uv1+8aOyODZE9ptXUtZBcoJ1NWXDJ0ERdBo+31dl0W7U3etNwqSjo1mT/nT30NFonFqX3e6KNhm9JO/DYLcLf+YG7yX19OWQEjG1BzKCt9ARdKLy0pH1nAgAAAABJRU5ErkJggg==";
