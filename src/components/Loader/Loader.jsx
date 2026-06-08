import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './Loader.module.css';

export default function Loader({ onComplete }) {
  const root = useRef(null);
  const [hidden, setHidden] = useState(false);

  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.style.overflow = 'hidden';

    const finish = () => {
      document.body.style.overflow = '';
      setHidden(true);
      onComplete && onComplete();
    };

    if (reduce) {
      gsap.delayedCall(0.1, finish);
      return;
    }

    const tl = gsap.timeline();
    tl.to(`.${styles.dot}`, { opacity: 1, duration: 0.5, stagger: 0.15, ease: 'power2.out' })
      .from(`.${styles.title}`, { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2')
      .from(`.${styles.sub}`, { opacity: 0, duration: 0.5 }, '-=0.3')
      .to({}, { duration: 0.5 })
      .to(root.current, {
        xPercent: 110, duration: 1, ease: 'power3.inOut',
        onComplete: finish,
      });
  }, { scope: root });

  if (hidden) return null;

  return (
    <div ref={root} className={styles.loader}>
      <div className={styles.lights}>
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
      <div className={styles.title}>SOCIAL AUTOWALA</div>
      <div className={styles.sub}>Meter Down. Marketing On.</div>
    </div>
  );
}
