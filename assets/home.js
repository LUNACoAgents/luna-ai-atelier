/* Content, navigation and FAQ work without JavaScript. */
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!motion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.replace('is-waiting', 'is-visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08 });
    const elements = document.querySelectorAll('.editorial-head,.work,.problem-copy,.problem-photo,.svc,.why>div,.maker,.two>div,.main-plan,.sp,.steps li,.col-card');
    elements.forEach((element, index) => {
      if (element.getBoundingClientRect().top <= window.innerHeight) return;
      element.classList.add('reveal', 'is-waiting');
      element.style.setProperty('--reveal-delay', (index % 3) * 75 + 'ms');
      observer.observe(element);
    });
    motion.addEventListener('change', event => {
      if (!event.matches) return;
      observer.disconnect();
      elements.forEach(element => element.classList.remove('is-waiting'));
    });
  }
  const bar = document.querySelector('.mobile-contact');
  const hero = document.querySelector('.hero');
  const contact = document.querySelector('#contact');
  if (bar && hero && contact && 'IntersectionObserver' in window) {
    let heroVisible = true, contactVisible = false;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === contact) contactVisible = entry.isIntersecting;
      }
      const visible = !heroVisible && !contactVisible;
      bar.classList.toggle('is-visible', visible);
      bar.inert = !visible;
    });
    observer.observe(hero);
    observer.observe(contact);
  }
})();


const contactAddress = document.querySelector('#contact-address');
const copyContact = document.querySelector('#copy-contact');
const copyStatus = document.querySelector('#copy-contact-status');
if (contactAddress && copyContact && copyStatus) {
  copyContact.hidden = false;
  copyContact.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(contactAddress.textContent.trim());
      copyStatus.textContent = 'メールアドレスをコピーしました。';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(contactAddress);
      selection.removeAllRanges();
      selection.addRange(range);
      copyStatus.textContent = 'アドレスを選択しました。手動でコピーしてください。';
    }
  });
}
