/* Only the first image is requested until the visitor or timer selects another. */
(() => {
  const deck = document.querySelector('.hero-deck');
  const controls = document.querySelector('.hero-controls');
  if (!deck || !controls) return;

  const buttons = Array.from(controls.querySelectorAll('[data-select-scene]'));
  const play = controls.querySelector('.hero-play');
  const progress = controls.querySelector('.hero-progress span');
  const status = controls.querySelector('.gallery-status');
  const firstPhoto = deck.querySelector('.hero-photo.is-active');
  const templates = new Map(Array.from(deck.querySelectorAll('template[data-photo]'),
    template => [template.dataset.photo, template]));
  if (!firstPhoto || !play || !status || buttons.length < 2) return;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const photos = new Map([[firstPhoto.dataset.scene, Promise.resolve(firstPhoto)]]);
  const unavailable = new Set();
  const duration = 6000;
  let activePhoto = firstPhoto;
  let activeIndex = 0;
  let request = 0;
  let changing = false;
  let timer = null;
  let progressAnimation = null;
  let automatic = !motion.matches;
  let visible = !('IntersectionObserver' in window);
  let hovering = false;

  function clearClock() {
    window.clearTimeout(timer);
    timer = null;
    progressAnimation?.cancel();
    progressAnimation = null;
  }

  function refreshClock() {
    const enabled = automatic && visible && !document.hidden && !hovering;
    controls.dataset.autoplay = String(automatic);
    play.setAttribute('aria-label', automatic
      ? '写真の自動切り替えを一時停止'
      : '写真の自動切り替えを開始');
    if (!enabled || changing) {
      clearClock();
      return;
    }
    if (timer !== null) return;
    const next = buttons.map((_, offset) => (activeIndex + offset + 1) % buttons.length)
      .find(index => index !== activeIndex && !unavailable.has(buttons[index].dataset.selectScene));
    if (next === undefined) return;
    if (!motion.matches && progress?.animate) {
      progressAnimation = progress.animate(
        [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
        { duration, fill: 'forwards' }
      );
    }
    timer = window.setTimeout(() => {
      timer = null;
      selectScene(next, false);
    }, duration);
  }

  function loadPhoto(scene) {
    if (photos.has(scene)) return photos.get(scene);
    const template = templates.get(scene);
    if (!template) return Promise.reject(new Error('Photo template missing'));
    const picture = template.content.querySelector('picture').cloneNode(true);
    const image = picture.querySelector('img');
    const loaded = new Promise((resolve, reject) => {
      image.addEventListener('load', () => resolve(picture), { once:true });
      image.addEventListener('error', reject, { once:true });
      deck.append(picture);
      if (image.complete && image.naturalWidth > 0) resolve(picture);
    }).catch(error => {
      photos.delete(scene);
      picture.remove();
      throw error;
    });
    photos.set(scene, loaded);
    return loaded;
  }

  async function selectScene(index, announce) {
    const currentRequest = ++request;
    const button = buttons[index];
    const scene = button.dataset.selectScene;
    changing = true;
    clearClock();
    try {
      const picture = await loadPhoto(scene);
      if (currentRequest !== request) return;
      unavailable.delete(scene);
      picture.classList.add('is-active');
      if (activePhoto !== picture) activePhoto.classList.remove('is-active');
      activePhoto = picture;
      activeIndex = index;
      buttons.forEach((item, itemIndex) => item.setAttribute('aria-pressed', String(itemIndex === index)));
      if (announce) status.textContent = button.textContent.trim() + 'の写真を表示しています。';
    } catch {
      if (currentRequest !== request) return;
      unavailable.add(scene);
      if (announce) status.textContent = '写真を読み込めませんでした。もう一度お試しください。';
    } finally {
      if (currentRequest === request) {
        changing = false;
        refreshClock();
      }
    }
  }

  controls.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (button === play) {
      automatic = !automatic;
      refreshClock();
      return;
    }
    const index = buttons.indexOf(button);
    if (index !== -1) selectScene(index, true);
  });
  let pointerFocus = false;
  controls.addEventListener('pointerdown', () => { pointerFocus = true; });
  controls.addEventListener('pointerup', () => { pointerFocus = false; });
  controls.addEventListener('pointercancel', () => { pointerFocus = false; });
  controls.addEventListener('focusin', event => {
    if (pointerFocus || controls.contains(event.relatedTarget)) return;
    automatic = false;
    refreshClock();
  });
  controls.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse') return;
    hovering = true;
    refreshClock();
  });
  controls.addEventListener('pointerleave', () => {
    pointerFocus = false;
    hovering = false;
    refreshClock();
  });
  document.addEventListener('visibilitychange', refreshClock);
  motion.addEventListener('change', event => {
    if (event.matches) automatic = false;
    refreshClock();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= .23;
      refreshClock();
    }, { threshold:[0, .23] });
    observer.observe(deck);
  }
  controls.hidden = false;
  refreshClock();
})();
