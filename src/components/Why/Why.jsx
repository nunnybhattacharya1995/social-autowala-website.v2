import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReveal } from '../../hooks/useReveal';
import { STATS } from '../../data/content';
import styles from './Why.module.css';

function Stat({ count, suffix, label }) {
  const numRef = useRef(null);
  useGSAP(() => {
    const el = numRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const render = v => { el.innerHTML = `${Math.round(v)}<em>${suffix}</em>`; };
    if (reduce) { render(count); return; }
    const obj = { v: 0 };
    render(0);
    gsap.to(obj, {
      v: count, duration: 1.8, ease: 'power2.out',
      onUpdate: () => render(obj.v),
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  }, { scope: numRef });

  return (
    <div className={styles.stat}>
      <div className={styles.num} ref={numRef}>0<em>{suffix}</em></div>
      <div className={styles.lab}>{label}</div>
    </div>
  );
}

export default function Why() {
  const eyebrow = useReveal();
  const copy = useReveal();

  return (
    <section className="section-pad" id="why">
      <div className="eyebrow" ref={eyebrow}>Why Social Autowala</div>
      <p className={styles.copy} ref={copy}>
        We don't post. We plan. Then we deliver. We have done it for ourselves and for the brands we
        work with. We don't chase vanity metrics. <span>We build campaigns that move people and move businesses.</span>
      </p>
      <div className={styles.stats}>
        {STATS.map(s => <Stat key={s.label} {...s} />)}
      </div>
    </section>
  );
}
