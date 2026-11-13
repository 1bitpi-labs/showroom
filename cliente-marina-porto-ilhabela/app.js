const SERVICES = {
  coberta: {
    title: 'Vagas Cobertas Mensais até 65 pés',
    description:
      'Seu barco no mar na hora que você quiser, sem depender da tábua de marés. Os exclusivos rebocadores hidráulicos Seahorse e Rino descem embarcações de até 65 pés com precisão, além de racks cobertos para empilhamento até 28 pés.',
    image: 'assets/img/vaga-seca-hangar.jpg',
    alt: 'Vagas cobertas no hangar da Marina Porto Ilhabela',
    waText: 'Quero ser mensalista em vaga coberta na Marina Porto Ilhabela',
    specs: [
      { label: 'Capacidade', value: 'Até 65 pés (Racks até 28 pés)' },
      { label: 'Lançamento', value: 'Rebocadores Seahorse e Rino' },
      { label: 'Agendamento', value: 'WhatsApp direto e Sala Rádio' },
      { label: 'Proteção', value: 'Pátio coberto e assegurado 24h' }
    ]
  },
  poitas: {
    title: 'Vagas Molhadas & Poitas Avulsas',
    description:
      'Serviço completo de embarque 24 horas todos os dias do ano, com flutuante de apoio equipado com água doce. Poitas revisadas periodicamente por mergulhadores especializados para pernoite avulsa ou contrato mensal.',
    image: 'assets/img/poitas-avulsas.jpg',
    alt: 'Embarcações em poitas e flutuante de apoio 24h em Ilhabela',
    waText: 'Preciso apoitar meu barco na Marina Porto Ilhabela',
    specs: [
      { label: 'Operação', value: 'Boteiros 24h por dia, 365 dias' },
      { label: 'Inspeção', value: 'Mergulhadores e equipe subaquática' },
      { label: 'Apoio', value: 'Flutuante com água doce' },
      { label: 'Hospitalidade', value: 'Parceria com hotéis e pousadas' }
    ]
  },
  docagem: {
    title: 'Docagem para Manutenção Avulsa',
    description:
      'Equipe especializada em lançamento e docagem de lanchas e veleiros até 65 pés. Estrutura com carretas universais, tripés de apoio, água doce, energia dedicada e controle rigoroso de acesso na portaria.',
    image: 'assets/img/docagem-manutencao.jpg',
    alt: 'Docagem e manutenção técnica de embarcação na Marina Porto Ilhabela',
    waText: 'Quero fazer manutenção e docagem na Marina Porto Ilhabela',
    specs: [
      { label: 'Escala', value: 'Lanchas e veleiros até 65 pés' },
      { label: 'Equipamentos', value: 'Carretas universais e tripés' },
      { label: 'Utilidades', value: 'Água doce e energia no pátio' },
      { label: 'Segurança', value: 'Vigia 24h e portaria fiscalizada' }
    ]
  },
  jetski: {
    title: 'Diária para Jet Ski com Adoçamento',
    description:
      'Logística completa de reboque, embarque e desembarque no canal. Inclui limpeza e adoçamento imediato após o uso, acesso às áreas sociais de mensalistas (piscina, vestiários e restaurante) e apoio de barco resgate.',
    image: 'assets/img/estrutura-3.jpg',
    alt: 'Operação de Jet Ski em frente à Marina Porto Ilhabela',
    waText: 'Quero subir meu jet na Marina Porto Ilhabela',
    specs: [
      { label: 'Cuidado Pós-Mar', value: 'Limpeza e adoçamento completo' },
      { label: 'Logística', value: 'Reboque e rampa dedicados' },
      { label: 'Clube Incluso', value: 'Piscina, vestiários e deck' },
      { label: 'Segurança', value: 'Barco resgate e canal VHF 38' }
    ]
  },
  lazer: {
    title: 'Restaurante Panorâmico, Piscina & Clube',
    description:
      'Acesso completo ao deck gastronômico com café da manhã e jantar frente ao canal de São Sebastião, piscina cercada por palmeiras, vestiários amplos, clube de remo Paddle Club Ilhabela e manobrista em São Sebastião.',
    image: 'assets/img/lazer-piscina.jpg',
    alt: 'Área de lazer e piscina de frente para o canal na Marina Porto Ilhabela',
    waText: 'Quero visitar a Marina Porto Ilhabela',
    specs: [
      { label: 'Gastronomia', value: 'Restaurante com café e jantar' },
      { label: 'Esporte', value: 'Paddle Club Ilhabela e remo' },
      { label: 'Logística Terra', value: 'Estacionamento em São Sebastião' },
      { label: 'Rádio', value: 'Sala Rádio VHF Delta 38 24h' }
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  const hero = document.getElementById('hero');
  const menuOverlay = document.getElementById('menu-overlay');
  const openMenuBtn = document.getElementById('open-menu');
  const closeMenuBtn = document.getElementById('close-menu');
  const conciergeModal = document.getElementById('concierge-modal');
  const closeConciergeBtn = document.getElementById('close-concierge');

  // Sticky translucent slate bar once scrolled past hero threshold
  const syncHeader = () => {
    const threshold = window.innerHeight * 0.72;
    if (window.scrollY > threshold) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();

  // Fullscreen Wally menu overlay
  const setMenuOpen = (open) => {
    menuOverlay.classList.toggle('is-open', open);
    menuOverlay.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  openMenuBtn?.addEventListener('click', () => setMenuOpen(true));
  closeMenuBtn?.addEventListener('click', () => setMenuOpen(false));
  menuOverlay?.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  // Hero mode switch (Twilight bay still vs live 1080p MP4 sea channel)
  document.querySelectorAll('[data-hero-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-hero-mode');
      document.querySelectorAll('[data-hero-mode]').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      hero.classList.toggle('is-video-mode', mode === 'video');
      const vid = hero.querySelector('video');
      if (mode === 'video' && vid) {
        vid.play().catch(() => {});
      }
    });
  });

  // Interactive Services & Berths Explorer
  const tabs = document.querySelectorAll('[data-service-tab]');
  const titleEl = document.getElementById('service-title');
  const descEl = document.getElementById('service-desc');
  const imgEl = document.getElementById('service-img');
  const specsEl = document.getElementById('service-specs');
  const waBtn = document.getElementById('service-wa-btn');

  const renderService = (key) => {
    const item = SERVICES[key];
    if (!item) return;
    tabs.forEach((t) => t.classList.toggle('is-active', t.getAttribute('data-service-tab') === key));
    titleEl.textContent = item.title;
    descEl.textContent = item.description;
    imgEl.src = item.image;
    imgEl.alt = item.alt;
    specsEl.innerHTML = item.specs
      .map(
        (s) => `
        <li class="service-spec-item">
          <span class="service-spec-label">${s.label}</span>
          <span class="service-spec-val">${s.value}</span>
        </li>`
      )
      .join('');
    waBtn.href = `https://wa.me/5512996342782?text=${encodeURIComponent(item.waText)}`;
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => renderService(tab.getAttribute('data-service-tab')));
  });
  renderService('coberta');

  // FAQ Accordion
  document.querySelectorAll('.faq-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('is-open'));
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  // Concierge Modal
  const openConcierge = (presetService) => {
    if (presetService) {
      const select = document.getElementById('concierge-service');
      if (select) select.value = presetService;
    }
    conciergeModal.classList.add('is-open');
    conciergeModal.setAttribute('aria-hidden', 'false');
  };

  const closeConcierge = () => {
    conciergeModal.classList.remove('is-open');
    conciergeModal.setAttribute('aria-hidden', 'true');
  };

  document.querySelectorAll('[data-open-concierge]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openConcierge(el.getAttribute('data-open-concierge'));
    });
  });

  closeConciergeBtn?.addEventListener('click', closeConcierge);
  conciergeModal?.addEventListener('click', (e) => {
    if (e.target === conciergeModal) closeConcierge();
  });

  document.getElementById('concierge-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('concierge-name').value.trim();
    const tamanho = document.getElementById('concierge-size').value;
    const servico = document.getElementById('concierge-service').value;
    const obs = document.getElementById('concierge-notes').value.trim();
    const msg = `Olá Marina Porto Ilhabela! Sou ${nome || 'comandante'}. Tenho interesse em: ${servico} (${tamanho}). ${obs}`;
    window.open(`https://wa.me/5512996342782?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    closeConcierge();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setMenuOpen(false);
      closeConcierge();
    }
  });
});
