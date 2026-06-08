import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SERVICES } from '../../data/content';
import { useReveal } from '../../hooks/useReveal';
import styles from './Services.module.css';

const ICONS = [
  <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="1.2" fill="currentColor" /></>,
  <><circle cx="9" cy="8" r="3.2" /><circle cx="17" cy="9" r="2.4" /><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" /><path d="M15 19c0-2.4 1.6-3.6 4-3.6" /></>,
  <><path d="M3 11l16-7-4 16-4-6-8-3z" /></>,
  <><path d="M21 12a9 9 0 11-3-6.7" /><path d="M21 4v5h-5" /></>,
  <><path d="M12 21s-7-6.3-7-11a7 7 0 0114 0c0 4.7-7 11-7 11z" /><circle cx="12" cy="10" r="2.6" /></>,
  <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 8h18M7 21h10" /></>,
];

function ServiceCard({ no, title, desc, icon }) {
  const reveal = useReveal();
  const cardRef = useRef(null);

  useGSAP(() => {
    const card = cardRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || window.matchMedia('(pointer: coarse)').matches) return;
    const move = e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, { rotateX: -y * 12, rotateY: x * 12, duration: 0.4, ease: 'power2.out', transformPerspective: 600 });
    };
    const leave = () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' });
    card.addEventListener('mousemove', move);
    card.addEventListener('mouseleave', leave);
    return () => { card.removeEventListener('mousemove', move); card.removeEventListener('mouseleave', leave); };
  }, { scope: cardRef });

  return (
    <div className={styles.card} ref={reveal} data-magnet>
      <div ref={cardRef} className={styles.cardInner}>
        <div className={styles.no}>{no}</div>
        <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.6">{icon}</svg>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.desc}>{desc}</p>
      </div>
    </div>
  );
}

export default function Services() {
  const head = useReveal();
  const eyebrow = useReveal();
  return (
    <section className="section-pad" id="services">
      <div className="eyebrow" ref={eyebrow}>Things We Do</div>
      <h2 className="sec-head" ref={head}>Not Just <span className="g">Social Butterflies.</span></h2>
      <div className={styles.grid}>
        {SERVICES.map((s, i) => <ServiceCard key={s.no} {...s} icon={ICONS[i]} />)}
      </div>
    </section>
  );
}
