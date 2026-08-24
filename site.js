const siteHeader = document.querySelector('.site-header');
const cursorDot = document.querySelector('.tuning-dot');
const reduceMotionSite = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('scroll', () => {
  siteHeader?.classList.toggle('scrolled', window.scrollY > 16);
});

if (cursorDot && !reduceMotionSite && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    cursorDot.style.left = `${event.clientX}px`;
    cursorDot.style.top = `${event.clientY}px`;
  });
  document.querySelectorAll('a,button').forEach((element) => {
    element.addEventListener('pointerenter', () => cursorDot.classList.add('active'));
    element.addEventListener('pointerleave', () => cursorDot.classList.remove('active'));
  });
}

const archiveFilters = document.querySelectorAll('.archive-filter');
const collectionItems = document.querySelectorAll('.collection-item');

archiveFilters.forEach((filter) => {
  filter.addEventListener('click', () => {
    const kind = filter.dataset.filter;
    archiveFilters.forEach((item) => item.classList.remove('active'));
    filter.classList.add('active');
    collectionItems.forEach((item) => {
      const visible = kind === 'todos' || item.dataset.kind === kind;
      item.hidden = !visible;
    });
  });
});
