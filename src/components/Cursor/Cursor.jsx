import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Cursor.module.css';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let raf;

    const onMove = e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    };
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove);
    loop();

    const cleanups = [];
    const bind = (el, type, fn) => { el.addEventListener(type, fn); cleanups.push(() => el.removeEventListener(type, fn)); };

    // grow + label on [data-cursor]
    document.querySelectorAll('[data-cursor]').forEach(el => {
      bind(el, 'mouseenter', () => { label.textContent = el.getAttribute('data-cursor'); document.body.classList.add('cursor-grow'); });
      bind(el, 'mouseleave', () => document.body.classList.remove('cursor-grow'));
    });

    // link state
    document.querySelectorAll('a, button, [data-magnet]').forEach(el => {
      bind(el, 'mouseenter', () => { if (!document.body.classList.contains('cursor-grow')) document.body.classList.add('cursor-link'); });
      bind(el, 'mouseleave', () => document.body.classList.remove('cursor-link'));
    });

    // magnetic pull
    document.querySelectorAll('[data-magnet]').forEach(el => {
      bind(el, 'mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        gsap.to(el, { x: x * 0.35, y: y * 0.4, duration: 0.4, ease: 'power3.out' });
      });
      bind(el, 'mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' }));
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      cleanups.forEach(fn => fn());
      document.body.classList.remove('cursor-grow', 'cursor-link');
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={`${styles.dot} cursor-dot`} />
      <div ref={ringRef} className={`${styles.ring} cursor-ring`}>
        <span ref={labelRef} className={styles.label} />
      </div>
    </>
  );
}
