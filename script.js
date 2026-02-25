const topbar = document.getElementById('topbar');
const revealElements = document.querySelectorAll('.reveal');
const searchForm = document.getElementById('search-form');
const quickOp = document.getElementById('quick-operation');
const cards = [...document.querySelectorAll('.listing-card')];
const resultCount = document.getElementById('result-count');

const modal = document.getElementById('property-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalPrice = document.getElementById('modal-price');

const propertyDetails = {
  p1: {
    image: './assets/dept2.jpg',
    title: 'Departamento 3 ambientes en Palermo',
    description: 'Ubicado a metros de Av. Santa Fe, con balcon corrido, cocina integrada y bajas expensas.',
    price: 'USD 120.000',
  },
  p2: {
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    title: 'Semipiso moderno en Belgrano',
    description: 'Excelente planta con amenities premium, seguridad y conectividad inmediata.',
    price: 'ARS 980.000 / mes',
  },
  p3: {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    title: 'Casa de diseno en barrio privado',
    description: 'Propiedad lista para mudarse, con jardin, pileta y espacios de reunion familiar.',
    price: 'USD 340.000',
  },
  p4: {
    image: './assets/dept1.webp',
    title: 'Cochera fija cubierta en Recoleta',
    description: 'Excelente punto de acceso y seguridad 24h para uso personal o renta.',
    price: 'USD 18.000',
  },
  p5: {
    image: './assets/dept3.webp',
    title: 'Lote residencial en Canning',
    description: '500 m2 con potencial de valorizacion en zona consolidada.',
    price: 'USD 65.000',
  },
  p6: {
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    title: 'Casa al lago en Nordelta',
    description: 'Entorno premium con vistas abiertas, ideal para alquiler ejecutivo.',
    price: 'USD 3.200 / mes',
  },
};

function updateTopbar() {
  if (window.scrollY > 20) topbar.classList.add('scrolled');
  else topbar.classList.remove('scrolled');
}

window.addEventListener('scroll', updateTopbar);
updateTopbar();

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  },
  { threshold: 0.16 },
);

revealElements.forEach((el) => revealObserver.observe(el));

const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const node = entry.target;
      const target = Number(node.getAttribute('data-count'));
      const start = performance.now();
      const duration = 1100;

      function frame(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        const value = Math.floor(target * eased);
        node.textContent = `${value}${target === 97 ? '%' : ''}`;
        if (progress < 1) requestAnimationFrame(frame);
      }

      requestAnimationFrame(frame);
      counterObserver.unobserve(node);
    }
  },
  { threshold: 0.6 },
);

counters.forEach((counter) => counterObserver.observe(counter));

function applyFilters(operation = '', type = '', zone = '') {
  let shown = 0;

  cards.forEach((card) => {
    const cardOp = card.dataset.operation || '';
    const cardType = card.dataset.type || '';
    const cardZone = card.dataset.zone || '';

    const opMatch = !operation || cardOp === operation;
    const typeMatch = !type || cardType === type;
    const zoneMatch = !zone || cardZone.includes(zone.trim().toLowerCase());

    const visible = opMatch && typeMatch && zoneMatch;
    card.style.display = visible ? '' : 'none';
    if (visible) shown += 1;
  });

  resultCount.textContent = `Mostrando ${shown} ${shown === 1 ? 'propiedad' : 'propiedades'}`;
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(searchForm);
  const operation = String(form.get('operation') || '');
  const type = String(form.get('type') || '');
  const zone = String(form.get('zone') || '');

  const activeBtn = quickOp.querySelector('button.active');
  if (activeBtn) activeBtn.classList.remove('active');
  const allBtn = quickOp.querySelector('button[data-op=""]');
  if (allBtn) allBtn.classList.add('active');

  applyFilters(operation, type, zone);
  document.getElementById('propiedades').scrollIntoView({ behavior: 'smooth' });
});

quickOp.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  [...quickOp.querySelectorAll('button')].forEach((btn) => btn.classList.remove('active'));
  target.classList.add('active');

  const op = target.dataset.op || '';
  const type = document.getElementById('type').value;
  const zone = document.getElementById('zone').value;

  document.getElementById('operation').value = op;
  applyFilters(op, type, zone);
});

function openModal(id) {
  const item = propertyDetails[id];
  if (!item) return;

  modalImage.src = item.image;
  modalTitle.textContent = item.title;
  modalDescription.textContent = item.description;
  modalPrice.textContent = item.price;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.open-modal').forEach((button) => {
  button.addEventListener('click', () => openModal(button.dataset.id));
});

modal.addEventListener('click', (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.dataset.close === 'true') {
    closeModal();
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

applyFilters();
