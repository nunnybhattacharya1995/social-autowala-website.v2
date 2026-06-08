import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { GROW_PANELS } from '../../data/content';
import styles from './Grow.module.css';

export default function Grow() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 881px)', () => {
      const track = trackRef.current;
      const getDistance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, { x: () => -getDistance(), ease: 'none' });
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: () => '+=' + getDistance(),
        pin: true,
        scrub: 1,
        animation: tween,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      });
      track.querySelectorAll('[data-stage]').forEach(s => {
        gsap.from(s, { opacity: 0, y: 30, duration: 0.6,
          scrollTrigger: { trigger: s, containerAnimation: tween, start: 'left 75%' } });
      });
    });
    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section className={styles.grow} id="grow" ref={containerRef}>
      <div className={styles.inner}>
        <div className={styles.track} ref={trackRef}>
          <div className={`${styles.panel} ${styles.intro}`}>
            <div className={styles.head}>
              <small>The Method</small>
              How We Grow <span style={{ color: 'var(--green)' }}>Your Brand.</span>
            </div>
          </div>
          {GROW_PANELS.map(p => (
            <div className={styles.panel} key={p.no}>
              <div className={styles.pno}>{p.no}</div>
              <div className={styles.stage} data-stage style={{ color: p.color }}>{p.stage}</div>
              <div className={styles.chips}>
                {p.chips.map(c => <span key={c}>{c}</span>)}
              </div>
              <div className={styles.q}>"<em>{p.q}</em>"</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
