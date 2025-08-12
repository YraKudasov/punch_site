const punchBag = document.getElementById('punchBag');
const powerDisplay = document.getElementById('powerDisplay');
const powerRating = document.getElementById('powerRating');
const leftBar = punchBag.querySelector('.power-bar.left .bar-fill');
const rightBar = punchBag.querySelector('.power-bar.right .bar-fill');
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
});


function getRandomPower() {
  return Math.floor(Math.random() * (MAX_POWER - MIN_POWER + 1)) + MIN_POWER;
}

function getRating(power) {
  let result = ratings[0].label; // по умолчанию самый маленький рейтинг
  for (const r of ratings) {
    if (power >= r.max) {
      result = r.label;
    } else {
      break; // дальше уже больше не подходит
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

function updatePowerBars(power) {
  const circumference = 2 * Math.PI * 54;
  const ratio = Math.min(power / MAX_POWER, 1);
  const offset = circumference * (1 - ratio);

  leftBar.style.strokeDashoffset = offset;
  rightBar.style.strokeDashoffset = offset;
}

function resetPowerBars() {
  const circumference = 2 * Math.PI * 54;
  leftBar.style.strokeDashoffset = circumference;
  rightBar.style.strokeDashoffset = circumference;
}

let currentPower = 0;
let hideTimeoutId = null; // для хранения ID таймера скрытия

async function playHitAnimation() {
  // Если анимация уже идёт, сбрасываем таймер скрытия и сбрасываем анимацию
  if (punchBag.classList.contains('animating')) {
    if (hideTimeoutId) {
      clearTimeout(hideTimeoutId);
      hideTimeoutId = null;
    }
    // Сбрасываем классы, чтобы анимация могла запуститься заново
    punchBag.classList.remove('recoil', 'hit');
    resetPowerBars();
  }

  punchBag.classList.remove('idle'); // выключаем пульсацию
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

  resetPowerBars();

  await animatePowerDisplay(currentPower);

  updatePowerBars(currentPower);

  powerRating.textContent = getRating(currentPower);
}

// Обработчик animationend вынесен отдельно и добавлен один раз
function onAnimationEnd(e) {
  if (e.animationName === 'recoilMove') {
    punchBag.classList.remove('recoil');

    // Запускаем таймер скрытия, который можно сбросить при новом клике
    hideTimeoutId = setTimeout(() => {
      powerDisplay.classList.add('hidden');
      powerRating.textContent = '';
      resetPowerBars();
      punchBag.classList.remove('animating');
      punchBag.classList.add('idle'); // включаем пульсацию обратно
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
