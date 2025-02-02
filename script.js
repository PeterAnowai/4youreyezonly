const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const message = document.getElementById('message');

// When "Yes" is clicked
yesBtn.addEventListener('click', () => {
  document.body.style.backgroundColor = 'hotpink';
  message.textContent = 'Yay!';
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
});

// When "No" is clicked
noBtn.addEventListener('click', () => {
  message.textContent = 'Wrong answer! Try again.';
  setTimeout(() => {
    message.textContent = '';
  }, 1000);
});