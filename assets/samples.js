/* Keep every entry accessible when scripts or animation are disabled. */
document.querySelectorAll('[data-filter-group]').forEach(group => {
  const controls = group.querySelector('.filters');
  const cards = group.querySelectorAll('[data-category]');
  if (!controls || !cards.length) return;
  controls.hidden = false;
  controls.addEventListener('click', event => {
    const selected = event.target.closest('button[data-filter]');
    if (!selected) return;
    const filter = selected.dataset.filter;
    controls.querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-pressed', String(button === selected));
    });
    cards.forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  });
});
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      target.classList.add('entered');
      observer.unobserve(target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('[data-enter]').forEach(element => observer.observe(element));
}
