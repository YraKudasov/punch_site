const punchBag = document.getElementById('punchBag');
const powerDisplay = document.getElementById('powerDisplay');
const powerRating = document.getElementById('powerRating');
const fillCircle = document.querySelector('.fill-circle'); // Новое обращение к единственному кругу

punchBag.classList.add('idle');

const MAX_POWER = 850;
const MIN_POWER = 30;

const ratings = [
  { max: 30, label: 'Амёба', weight: '30кг', icon: '🐛' },
  { max: 100, label: 'Слабак', weight: '100кг', icon: '👶' },
  { max: 250, label: 'Любитель', weight: '250кг', icon: '🤼' },
  { max: 400, label: 'Полупрофессионал', weight: '400кг', icon: '🥋' },
  { max: 600, label: 'Профи', weight: '600кг', icon: '🥊' },
  { max: 800, label: 'Майк Тайсон', weight: '800кг', icon: '👑' }
];

const ratingScale = document.getElementById('ratingScale');

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

  const label = document.createElement('div');
  label.className = 'rating-label';
  label.textContent = rating.label;

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
  return Math.floor(Math.random() * (MAX_POWER - MIN_POWER + 1)) + MIN_POWER;
}

function getRating(power) {
  let result = ratings[0].label; // По умолчанию самый низкий рейтинг
  for (const r of ratings) {
    if (power >= r.max) {
      result = r.label;
    } else {
      break; // Далее уже не подходит
    }
  }
  return result;
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
  const circumference = 2 * Math.PI * 140; // Наш новый радиус составляет 140px
  const ratio = Math.min(power / MAX_POWER, 1);
  const offset = circumference * (1 - ratio);

  fillCircle.style.strokeDashoffset = offset.toString();
}

function resetBigCircle() {
  const circumference = 2 * Math.PI * 140;
  fillCircle.style.strokeDashoffset = circumference.toString();
}

let currentPower = 0;
let hideTimeoutId = null; // Хранение таймаута

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

  resetBigCircle();

  await animatePowerDisplay(currentPower);

  updateBigCircle(currentPower);

  powerRating.textContent = getRating(currentPower);
}

function onAnimationEnd(e) {
  if (e.animationName === 'recoilMove') {
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