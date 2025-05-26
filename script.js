let wakeLock = null;

async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake Lock is active.');

      wakeLock.addEventListener('release', () => {
        console.log('Wake Lock was released. Re-requesting...');
        wakeLock = null;
        requestWakeLock();
      });
    } else {
      console.warn('Wake Lock API not supported in this browser.');
    }
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
}

function updateTime() {
  const now = moment();

  document.documentElement.style.setProperty('--timer-day', `"${now.format("dd")}"`);
  document.documentElement.style.setProperty('--timer-hours', `"${now.format("hh")}"`);
  document.documentElement.style.setProperty('--timer-minutes', `"${now.format("mm")}"`);
  document.documentElement.style.setProperty('--timer-seconds', `"${now.format("ss")}"`);
  document.documentElement.style.setProperty('--timer-ampm', `"${now.format("A")}"`);

  requestAnimationFrame(updateTime);
}

document.addEventListener('DOMContentLoaded', () => {
  updateTime();
  requestWakeLock();
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && wakeLock === null) {
    requestWakeLock();
  }
});
