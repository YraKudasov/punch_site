// Simple version without Firebase
const punchBag = document.getElementById('punchBag');
const powerDisplay = document.getElementById('powerDisplay');
const powerRating = document.getElementById('powerRating');
const fillCircle = document.querySelector('.fill-circle');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const bonusDisplay = document.getElementById('bonusDisplay');

punchBag.classList.add('idle');

const MAX_POWER = 1050;
const MIN_POWER = 30;

// Initialize global high score (use localStorage only)
let globalHighScore = parseInt(localStorage.getItem('punchHighScore')) || 0;
highScoreDisplay.textContent = `Рекорд: ${globalHighScore} кг`;
const ratings = [
  { max: 30, label: 'Мистер Бин', weight: '30кг', icon: '🧥', color: '#dcdcdc' },
  { max: 70, label: 'Гарри Поттер', weight: '70кг', icon: '🪄', color: '#6c5ce7' },
  { max: 120, label: 'Человек-паук', weight: '120кг', icon: '🕷️', color: '#ff4c4c' },
  { max: 180, label: 'Капитан Америка', weight: '180кг', icon: '🛡️', color: '#2b6cb0' },
  { max: 250, label: 'Криштиану Роналду', weight: '250кг', icon: '⚽', color: '#f5af19' },
  { max: 320, label: 'Конор Макгрегор', weight: '320кг', icon: '🥊', color: '#2ecc71' },
  { max: 400, label: 'Хабиб Нурмагомедов', weight: '400кг', icon: '🦅', color: '#8e44ad' },
  { max: 480, label: 'Дуэйн "Скала" Джонсон', weight: '480кг', icon: '🪨', color: '#7f8c8d' },
  { max: 560, label: 'Бэтмен', weight: '560кг', icon: '🦇', color: '#4d5e03' },
  { max: 650, label: 'Тор', weight: '650кг', icon: '⚡', color: '#3498db' },
  { max: 750, label: 'Халк', weight: '750кг', icon: '💚', color: '#27ae60' },
  { max: 830, label: 'Мелстрой', weight: '830кг', icon: '💸', color: '#ff0000' },
  { max: 920, label: 'Кратос', weight: '920кг', icon: '🪓', color: '#c0392b' },
  { max: 1000, label: 'Супермен', weight: '1000кг', icon: '🦸‍♂️', color: '#2980b9' },
  { max: 1050, label: 'Танос', weight: '1050кг', icon: '🟣', color: '#6c5ce7' }
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