// Simple version without Firebase
const punchBag = document.getElementById('punchBag');
const powerDisplay = document.getElementById('powerDisplay');
const powerRating = document.getElementById('powerRating');
const fillCircle = document.querySelector('.fill-circle');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const bonusDisplay = document.getElementById('bonusDisplay');

punchBag.classList.add('idle');

const MAX_POWER = 850;
const MIN_POWER = 30;

// Initialize global high score (use localStorage only)
let globalHighScore = parseInt(localStorage.getItem('punchHighScore')) || 0;
highScoreDisplay.textContent = `Рекорд: ${globalHighScore} кг`;

const ratings = [
  { max: 30, label: 'Амёба', weight: '30кг', icon: '🐛', color: '#ffd700' },
  { max: 70, label: 'Слабак', weight: '70кг', icon: '👶', color: '#ffb347' },
  { max: 120, label: 'Новичок', weight: '120кг', icon: '🥺', color: '#ff8c42' },
  { max: 180, label: 'Любитель', weight: '180кг', icon: '🤼', color: '#ff6b6b' },
  { max: 250, label: 'Спортсмен', weight: '250кг', icon: '🏃', color: '#ee5a6f' },
  { max: 320, label: 'Ученый', weight: '320кг', icon: '🧠', color: '#cc5de8' },
  { max: 400, label: 'Боец', weight: '400кг', icon: '🥋', color: '#8e44ad' },
  { max: 480, label: 'Профессионал', weight: '480кг', icon: '🥊', color: '#3498db' },
  { max: 560, label: 'Где это физика?', weight: '560кг', icon: '🤯', color: '#2ecc71' },
  { max: 650, label: 'Супергерой', weight: '650кг', icon: '🦸', color: '#1abc9c' },
  { max: 740, label: 'Майк Тайсон', weight: '740кг', icon: '👑', color: '#f1c40f' },
  { max: 850, label: 'Босс', weight: '850кг', icon: '💀', color: '#e74c3c' }
];

const ratingScale = document.getElementById('ratingScale');

// Обновление лучшего результата
function updateHighScore(power) {
    if (power > globalHighScore) {
        globalHighScore = power;
        localStorage.setItem('punchHighScore', globalHighScore);
        highScoreDisplay.textContent = `Рекорд: ${globalHighScore} кг`;
        showBonus('Новый рекорд!', '⭐');
    }
}

// Показываем бонусный текст
function showBonus(text, icon) {
  bonusDisplay.textContent = `${icon} ${text}`;
  bonusDisplay.classList.remove('hidden');
  bonusDisplay.classList.add('show');
  
  setTimeout(() => {
    bonusDisplay.classList.remove('show');
    setTimeout(() => {
      bonusDisplay.classList.add('hidden');
    }, 500);
  }, 2000);
}

// Создаем элемент для подсказки
const tooltip = document.createElement('div');
tooltip.className = 'rating-tooltip';
tooltip.style.display = 'none';
document.body.appendChild(tooltip);

// Функция для показа подсказки
function showTooltip(event, rating) {
  tooltip.innerHTML = `
    <div class="tooltip-icon">${rating.icon}</div>
    <div class="tooltip-label">${rating.label}</div>
    <div class="tooltip-weight">Требуется: ${rating.weight}</div>
  `;
  tooltip.style.display = 'block';
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY + 10}px`;
}

// Функция для скрытия подсказки
function hideTooltip() {
  tooltip.style.display = 'none';
}

// Обработчик клика по документу
document.addEventListener('click', (event) => {
  if (!tooltip.contains(event.target)) {
    hideTooltip();
  }
});

ratings.forEach(rating => {
  const item = document.createElement('div');
  item.className = 'rating-item';

  const icon = document.createElement('div');
  icon.className = 'rating-icon';
  icon.textContent = rating.icon;
  icon.style.color = rating.color;

  const label = document.createElement('div');
  label.className = 'rating-label';
  label.textContent = rating.label;
  label.style.color = rating.color;

  item.appendChild(icon);
  item.appendChild(label);
  ratingScale.appendChild(item);

  // Добавляем обработчики для показа подсказки
  item.addEventListener('mouseenter', (event) => {
    showTooltip(event, rating);
  });
  item.addEventListener('mouseleave', hideTooltip);
  item.addEventListener('click', (event) => {
    event.stopPropagation();
  });
});

function getRandomPower() {
  // Генерация случайного числа с весом к меньшим значениям
  // Используем кубическое распределение, чтобы сильные удары были реже
  const random = Math.random();
  const power = MIN_POWER + (MAX_POWER - MIN_POWER) * Math.pow(random, 3);
  return Math.floor(power);
}

function getRating(power) {
  let result = ratings[0].label;
  for (const r of ratings) {
    if (power >= r.max) {
      result = r.label;
    } else {
      break;
    }
  }
  return result;
}

function getRatingColor(power) {
  let color = ratings[0].color;
  for (const r of ratings) {
    if (power >= r.max) {
      color = r.color;
    } else {
      break;
    }
  }
  return color;
}

function animatePowerDisplay(targetPower, duration = 1500) {
  let start = null;
  let currentPower = 0;

  function easeOutQuad(t) {
    return t * (2 - t);
  }

  return new Promise(resolve => {
    function step(timestamp) {
      if (!start) start = timestamp;
      let progress = (timestamp - start) / duration;
      if (progress > 1) progress = 1;

      const easedProgress = easeOutQuad(progress);
      currentPower = Math.floor(easedProgress * targetPower);
      powerDisplay.textContent = currentPower + ' кг';

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        powerDisplay.textContent = targetPower + ' кг';
        resolve();
      }
    }
    powerDisplay.textContent = '0 кг';
    requestAnimationFrame(step);
  });
}

function updateBigCircle(power) {
  // Определяем радиус круга в зависимости от ширины экрана
  const circleRadius = window.innerWidth <= 600 ? 90 : 140;
  const circumference = 2 * Math.PI * circleRadius;
  const ratio = Math.min(power / MAX_POWER, 1);
  const offset = circumference * (1 - ratio);

  // Обновляем стили SVG
  fillCircle.setAttribute('r', circleRadius);
  const bgCircle = document.querySelector('.bg-circle');
  if (bgCircle) {
    bgCircle.setAttribute('r', circleRadius);
  }

  fillCircle.style.strokeDasharray = circumference.toString();
  fillCircle.style.strokeDashoffset = offset.toString();
  fillCircle.style.stroke = getRatingColor(power);
}

function resetBigCircle() {
  const circleRadius = window.innerWidth <= 600 ? 90 : 140;
  const circumference = 2 * Math.PI * circleRadius;

  // Обновляем стили SVG
  fillCircle.setAttribute('r', circleRadius);
  const bgCircle = document.querySelector('.bg-circle');
  if (bgCircle) {
    bgCircle.setAttribute('r', circleRadius);
  }

  fillCircle.style.strokeDasharray = circumference.toString();
  fillCircle.style.strokeDashoffset = circumference.toString();
  fillCircle.style.stroke = '#ff4444';
}

// Обновляем круг при изменении размера экрана
window.addEventListener('resize', function() {
  updateBigCircle(currentPower);
});

let currentPower = 0;
let hideTimeoutId = null;

async function playHitAnimation() {
  if (punchBag.classList.contains('animating')) {
    if (hideTimeoutId) {
      clearTimeout(hideTimeoutId);
      hideTimeoutId = null;
    }
    punchBag.classList.remove('recoil', 'hit');
    resetBigCircle();
  }

  punchBag.classList.remove('idle');
  punchBag.classList.add('animating');

  punchBag.classList.add('hit');

  const flash = document.createElement('div');
  flash.className = 'flash';
  punchBag.appendChild(flash);

  setTimeout(() => {
    punchBag.classList.remove('hit');
    flash.remove();
  }, 150);

  setTimeout(() => {
    punchBag.classList.add('recoil');
  }, 150);

  currentPower = getRandomPower();

  powerDisplay.classList.remove('hidden');
  powerRating.textContent = '';
  powerRating.style.color = getRatingColor(currentPower);

  resetBigCircle();

  await animatePowerDisplay(currentPower);

  updateBigCircle(currentPower);
  updateHighScore(currentPower);

  powerRating.textContent = getRating(currentPower);
  powerRating.style.color = getRatingColor(currentPower);
}

function onAnimationEnd(e) {
  if (e.animationName === 'recoilMove' || e.animationName === 'recoilMoveMobile') {
    punchBag.classList.remove('recoil');

    hideTimeoutId = setTimeout(() => {
      powerDisplay.classList.add('hidden');
      powerRating.textContent = '';
      resetBigCircle();
      punchBag.classList.remove('animating');
      punchBag.classList.add('idle');
      hideTimeoutId = null;
    }, 10000);
  }
}

punchBag.addEventListener('animationend', onAnimationEnd);
punchBag.addEventListener('click', playHitAnimation);
punchBag.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    playHitAnimation();
  }
});