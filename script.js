const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const waveField = document.getElementById('wave-field');
const radioWrap = document.getElementById('radio-wrap');
const introButton = document.getElementById('intro-button');
const introLabel = document.getElementById('intro-label');
const storyPlay = document.getElementById('story-play');
const storyWave = document.querySelector('.story-wave');
const storyTime = document.getElementById('story-time');
const timelineButtons = document.querySelectorAll('.timeline-year');
const timelineBigYear = document.getElementById('timeline-big-year');
const timelineTitle = document.getElementById('timeline-title');
const timelineDescription = document.getElementById('timeline-description');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const timelineData = {
  1920: {
    title: 'O rádio começa a conquistar o Brasil',
    description: 'As primeiras experiências de radiodifusão abrem caminho para um novo meio capaz de levar informação, música e voz a milhares de pessoas ao mesmo tempo.'
  },
  1930: {
    title: 'A era de ouro ganha forma',
    description: 'Emissoras, auditórios e programas populares transformam o rádio em companhia diária e em um dos principais centros de entretenimento do país.'
  },
  1940: {
    title: 'Notícias chegam em tempo real',
    description: 'O rádio assume papel decisivo na cobertura de grandes acontecimentos e aproxima o público de fatos nacionais e internacionais.'
  },
  1950: {
    title: 'Vozes, novelas e ídolos nacionais',
    description: 'Radionovelas, humor, música e programas de auditório consolidam estrelas e criam uma cultura sonora compartilhada por milhões de ouvintes.'
  },
  1960: {
    title: 'O transistor torna o rádio portátil',
    description: 'Menor, mais leve e mais acessível, o rádio passa a acompanhar as pessoas na rua, no trabalho, no carro e em diferentes momentos do cotidiano.'
  },
  1970: {
    title: 'FM, música e novas linguagens',
    description: 'A expansão do FM melhora a qualidade sonora e fortalece formatos musicais, segmentados e voltados a públicos cada vez mais específicos.'
  },
  1980: {
    title: 'O rádio se reinventa ao vivo',
    description: 'Jornalismo, prestação de serviço, esporte e participação do ouvinte ganham força em uma programação cada vez mais dinâmica.'
  },
  1990: {
    title: 'Da antena para o mundo digital',
    description: 'Computadores, automação e novas tecnologias começam a mudar estúdios e formas de produção, preparando a transição para a internet.'
  },
  2000: {
    title: 'Streaming amplia o alcance das ondas',
    description: 'O áudio deixa de depender apenas da frequência local. Web rádios, streaming e, depois, podcasts levam a linguagem radiofônica a qualquer lugar.'
  }
};

function buildWave() {
  if (!waveField) return;
  const bars = window.innerWidth < 640 ? 64 : 110;
  waveField.innerHTML = '';

  for (let index = 0; index < bars; index += 1) {
    const bar = document.createElement('span');
    bar.className = 'wave-bar';
    const center = bars / 2;
    const distance = Math.abs(index - center) / center;
    const envelope = Math.max(0.15, 1 - distance * 0.75);
    const organic = 0.35 + Math.abs(Math.sin(index * 0.34)) * 0.65;
    const height = 12 + envelope * organic * 150;
    bar.style.height = `${height}px`;
    bar.style.opacity = `${0.35 + envelope * 0.65}`;
    bar.style.animation = reduceMotion ? 'none' : `pulseWave ${1.15 + (index % 7) * 0.09}s ease-in-out ${-(index % 13) * 0.08}s infinite alternate`;
    waveField.appendChild(bar);
  }
}

const dynamicStyle = document.createElement('style');
dynamicStyle.textContent = `
  @keyframes pulseWave {
    from { transform: scaleY(.35); filter: brightness(.7); }
    to { transform: scaleY(1); filter: brightness(1.25); }
  }
`;
document.head.appendChild(dynamicStyle);
buildWave();
window.addEventListener('resize', buildWave);

menuToggle?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

document.querySelectorAll('.mobile-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

if (!reduceMotion && radioWrap) {
  const heroArt = document.querySelector('.hero-art');
  heroArt?.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const rect = heroArt.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    radioWrap.style.transform = `rotateY(${x * 7}deg) rotateX(${y * -5}deg) translateY(-2px)`;
  });

  heroArt?.addEventListener('pointerleave', () => {
    radioWrap.style.transform = 'rotateY(0) rotateX(0) translateY(0)';
  });
}

let introActive = false;
introButton?.addEventListener('click', () => {
  introActive = !introActive;
  introButton.setAttribute('aria-pressed', String(introActive));
  introLabel.textContent = introActive ? 'Introdução em reprodução' : 'Ouvir introdução';
  introButton.querySelector('.play-icon').textContent = introActive ? 'Ⅱ' : '▶';
  waveField?.classList.toggle('intro-active', introActive);
});

timelineButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const year = button.dataset.year;
    const entry = timelineData[year];
    if (!entry) return;

    timelineButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    timelineBigYear.textContent = year;
    timelineTitle.textContent = entry.title;
    timelineDescription.textContent = entry.description;
  });
});

let storyPlaying = false;
let storySeconds = 0;
let storyTimer = null;

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

storyPlay?.addEventListener('click', () => {
  storyPlaying = !storyPlaying;
  storyPlay.textContent = storyPlaying ? 'Ⅱ' : '▶';
  storyPlay.setAttribute('aria-label', storyPlaying ? 'Pausar história' : 'Reproduzir história');
  storyWave.classList.toggle('playing', storyPlaying);

  if (storyPlaying) {
    storyTimer = window.setInterval(() => {
      storySeconds += 1;
      storyTime.textContent = formatTime(storySeconds);
      if (storySeconds >= 92) {
        storySeconds = 0;
        storyPlaying = false;
        storyPlay.textContent = '▶';
        storyWave.classList.remove('playing');
        storyTime.textContent = '00:00';
        window.clearInterval(storyTimer);
      }
    }, 1000);
  } else {
    window.clearInterval(storyTimer);
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => {
  if (reduceMotion) {
    element.classList.add('visible');
  } else {
    revealObserver.observe(element);
  }
});

const yearNode = document.getElementById('year');
if (yearNode) yearNode.textContent = new Date().getFullYear();
