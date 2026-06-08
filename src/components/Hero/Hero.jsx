import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import * as THREE from 'three';
import styles from './Hero.module.css';

export default function Hero({ isLoaded }) {
  const heroRef    = useRef(null);
  const canvasRef  = useRef(null);
  const innerRef   = useRef(null);
  const tagRef     = useRef(null);
  const blockRef   = useRef(null);
  const autoRef    = useRef(null);
  const socialRef  = useRef(null);
  const awRef      = useRef(null);
  const instaRef   = useRef(null);
  const fbRef      = useRef(null);
  const metaRef    = useRef(null);
  const subRef     = useRef(null);
  const actRef     = useRef(null);
  const ctasRef    = useRef(null);

  const [floating, setFloating]         = useState(false);

  /* ── THREE.JS PARTICLES ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 5;

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const count  = coarse ? 1400 : 3200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cG = new THREE.Color(0x2CBF3E);
    const cGl= new THREE.Color(0x4DFF74);
    const cY = new THREE.Color(0xFFC91D);

    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random()-0.5)*14;
      pos[i*3+1] = (Math.random()-0.5)*9;
      pos[i*3+2] = (Math.random()-0.5)*9;
      const r = Math.random();
      const c = r > 0.92 ? cY : r > 0.5 ? cGl : cG;
      col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col,3));
    const mat = new THREE.PointsMaterial({
      size:0.028, vertexColors:true, transparent:true,
      opacity:0.9, blending:THREE.AdditiveBlending, depthWrite:false,
    });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    let mx=0, my=0;
    const onMouse = e => { mx=e.clientX/window.innerWidth-0.5; my=e.clientY/window.innerHeight-0.5; };
    window.addEventListener('mousemove', onMouse);

    const resize = () => {
      const w=window.innerWidth, h=canvas.parentElement?.offsetHeight||window.innerHeight;
      renderer.setSize(w,h,false);
      camera.aspect=w/h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    let t=0, raf;
    const loop = () => {
      t+=0.0016;
      pts.rotation.y=t*0.5; pts.rotation.x=t*0.18;
      camera.position.x+=(mx*1.4-camera.position.x)*0.04;
      camera.position.y+=(-my*1.0-camera.position.y)*0.04;
      camera.lookAt(scene.position);
      renderer.render(scene,camera);
      raf=requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', resize);
      geo.dispose(); mat.dispose(); renderer.dispose();
    };
  }, []);

  /* ── ENTRANCE (runs once after Loader exits) ──
     Fades in tag, sub, CTAs, icons. Runs in PARALLEL with the scroll
     setup below; it never touches the auto/wordmark (the scroll timeline
     owns those). Decoupled from the scroll setup so a flaky entrance can
     never block the pin from being created/measured.
  */
  useGSAP(() => {
    if (!isLoaded) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const icons   = [instaRef.current, fbRef.current, metaRef.current].filter(Boolean);
    const ctaKids = ctasRef.current ? Array.from(ctasRef.current.children) : [];
    const words   = [socialRef.current, awRef.current].filter(Boolean);

    setFloating(true);

    if (reduce) {
      gsap.set([tagRef.current, subRef.current, actRef.current, ...icons, ...ctaKids, ...words],
               { opacity: 1, y: 0 });
      return;
    }

    gsap.set([tagRef.current, subRef.current, actRef.current], { opacity: 0, y: 20 });
    gsap.set(icons,   { opacity: 0 });
    gsap.set(ctaKids, { opacity: 0, y: 22 });
    // SOCIAL / AUTOWALA rise into view during the entrance so the wordmark is
    // already visible at rest — the scroll-driven auto needs the AUTOWALA
    // letters present to drive across them.
    gsap.set(words, { y: '112%' });

    gsap.timeline({ delay: 0.3 })
      .to(tagRef.current,
          { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' })
      .to(words,
          { y: '0%', duration: 0.7, stagger: 0.12, ease: 'power3.out' }, '-=0.3')
      .to(icons,
          { opacity: 1, duration: 0.45, stagger: 0.12, ease: 'power2.out' }, '-=0.45')
      .to([subRef.current, actRef.current],
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, '-=0.2')
      .to(ctaKids,
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power3.out' }, '-=0.2');

  }, { scope: heroRef, dependencies: [isLoaded] });

  /* ── SCROLL-DRIVEN AUTO (created as soon as loaded) ──
     As the user scrolls through the hero, the auto-rickshaw drives across the
     AUTOWALA wordmark: it starts aligned to the FIRST letter (left edge) of
     AUTOWALA and stops aligned to the LAST letter (right edge) of AUTOWALA.

     Approach (deliberately simple + robust):
       • NO pin. This is a short, contained motion over the AUTOWALA letters,
         so a plain scrubbed tween on the auto's `x` driven by normal scroll is
         far more reliable than the old +280% viewport pin (which was fragile
         under StrictMode and collapsed its scroll range once pinned).
       • Travel distance is computed from REAL geometry: the rendered width of
         the AUTOWALA span (awRef) minus the auto's own width. Recomputed on
         every refresh via invalidateOnRefresh, so it tracks resizes.
       • The auto is position:absolute; left:0 inside .block. Its start `x`
         offsets it so its LEFT edge sits exactly on AUTOWALA's left edge; it
         then travels (awWidth − autoWidth) so its RIGHT edge lands on
         AUTOWALA's right edge.
       • gsap.matchMedia() (same proven pattern as Grow.jsx) owns creation and
         teardown; mm.revert() in cleanup removes the tween + trigger so
         StrictMode's double-mount can't stack duplicates.
  */
  useGSAP(() => {
    if (!isLoaded) return;

    // Reduced-motion: static, accessible end-state. No scrub.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      gsap.set([socialRef.current, awRef.current], { y: '0%' });
      gsap.set(autoRef.current, { x: 0, opacity: 1 });
      return;
    }

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1px)', () => {
      const auto  = autoRef.current;
      const aw    = awRef.current;
      const block = blockRef.current;
      if (!auto || !aw || !block) return;

      // Compute the auto's start x (left edge → AUTOWALA left edge) and the
      // travel distance (AUTOWALA width − auto width) from live geometry.
      // Functions are re-read by invalidateOnRefresh on every refresh/resize.
      const startX = () => {
        const awRect    = aw.getBoundingClientRect();
        const blockRect = block.getBoundingClientRect();
        // auto is left:0 within .block, so its untransformed left edge is at
        // blockRect.left. Offset it so its left edge meets AUTOWALA's left.
        return awRect.left - blockRect.left;
      };
      const travel = () => {
        const awW   = aw.getBoundingClientRect().width;
        const autoW = auto.getBoundingClientRect().width;
        // Never negative: if the auto were wider than the word, don't travel.
        return Math.max(0, awW - autoW);
      };

      gsap.set(auto, { opacity: 1, x: startX });

      gsap.fromTo(auto,
        { x: () => startX() },
        {
          x: () => startX() + travel(),
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });
    });

    // App.jsx fires ScrollTrigger.refresh() after `loaded` flips, which
    // re-measures geometry. No competing refresh here.
    return () => mm.revert();

  }, { scope: heroRef, dependencies: [isLoaded] });

  return (
    <section ref={heroRef} className={styles.hero} id="home">
      <canvas ref={canvasRef} className={styles.particles} />

      <div ref={innerRef} className={styles.inner}>
        <p ref={tagRef} className={styles.tag}>From Local Streets To Social Feeds</p>

        <div ref={blockRef} className={`${styles.block} ${floating ? styles.blockFloat : ''}`}>

          {/* Icons — direct refs, isolated from blend modes via CSS */}
          <img ref={instaRef} src={`${import.meta.env.BASE_URL}instagram-3d.png`}
               className={`${styles.icon} ${styles.iconInsta} ${floating ? styles.iconFloat : ''}`}
               alt="" aria-hidden="true" />
          <img ref={fbRef} src={`${import.meta.env.BASE_URL}facebook-3d.png`}
               className={`${styles.icon} ${styles.iconFb} ${floating ? styles.iconFloat : ''}`}
               alt="" aria-hidden="true" />
          <img ref={metaRef} src={`${import.meta.env.BASE_URL}meta-3d.png`}
               className={`${styles.icon} ${styles.iconMeta} ${floating ? styles.iconFloat : ''}`}
               alt="" aria-hidden="true" />

          {/* Auto element — GSAP owns its x/opacity */}
          <img ref={autoRef} src={`${import.meta.env.BASE_URL}auto-3d.png`}
               className={styles.autoEl} alt="" aria-hidden="true" />

          {/* Word clips — overflow:hidden masks the y-sliding text */}
          <div className={styles.wordClip}>
            <span ref={socialRef} className={styles.wordInner}>SOCIAL</span>
          </div>
          <div className={styles.wordClip}>
            <span ref={awRef} className={`${styles.wordInner} ${styles.wordGreen}`}>
              AUTOWALA
            </span>
          </div>
        </div>

        <div ref={subRef} className={styles.sub}>
          Meter Down. <span className={styles.yellow}>Marketing On.</span>
        </div>
        <p ref={actRef} className={styles.act}>
          <b>Affordable.</b>&nbsp;&nbsp;<b>Convenient.</b>&nbsp;&nbsp;<b>Trusted.</b>
        </p>
        <div ref={ctasRef} className={styles.ctas}>
          <a href="#contact" className="btn-primary" data-magnet>Book A Free Strategy Call</a>
          <a href="#why" className="btn-ghost" data-magnet>
            Explore Our Journey <span className="arr">↓</span>
          </a>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <span>Scroll</span>
        <span className={styles.line} />
      </div>
    </section>
  );
}
