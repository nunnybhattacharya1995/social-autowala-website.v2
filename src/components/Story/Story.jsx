import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from './Story.module.css';

export default function Story() {
  const sectionRef = useRef(null);
  const line1Ref   = useRef(null);
  const line2Ref   = useRef(null);
  const divRef     = useRef(null);

  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      gsap.set([line1Ref.current, line2Ref.current], { x: 0, opacity: 1 });
      gsap.set(divRef.current, { scaleX: 1 });
      return;
    }

    // Off-screen start positions are OWNED BY the fromTo tweens. The hidden
    // state is a property of each tween, so even if StrictMode's useGSAP
    // cleanup reverts a stray gsap.set, the scrubbed tween re-asserts its
    // from-state on refresh — the lines can't get stranded at the CSS default
    // (x:0, visible). NOTE: no `immediateRender` — for a SCRUBBED ScrollTrigger
    // the from/to rendering must be driven by scroll progress; forcing
    // immediateRender makes the tween paint its end-state until the first
    // update, which is exactly the "already visible at rest" bug.

    // Line 1: FROM LOCAL STREETS — slides in FROM THE RIGHT, scrubbed
    gsap.fromTo(line1Ref.current,
      { x: '110%', opacity: 0 },
      { x: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 90%', end: 'top 20%', scrub: 1.2 },
      });

    // Line 2: TO SOCIAL FEEDS. — slides in FROM THE LEFT, scrubbed
    gsap.fromTo(line2Ref.current,
      { x: '-110%', opacity: 0 },
      { x: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', end: 'top 15%', scrub: 1.2 },
      });

    // Divider draws left → right as the section reaches center
    gsap.fromTo(divRef.current,
      { scaleX: 0 },
      { scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', end: 'top 30%', scrub: 1 },
      });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.story} id="story">
      <div className={styles.inner}>
        {/* white text, slides in from the right */}
        <p ref={line1Ref} className={`${styles.line} ${styles.lineRight}`}>
          FROM LOCAL STREETS
        </p>
        <div ref={divRef} className={styles.divider} />
        {/* green text, slides in from the left */}
        <p ref={line2Ref} className={`${styles.line} ${styles.lineLeft}`}>
          TO SOCIAL FEEDS.
        </p>
      </div>
    </section>
  );
}
