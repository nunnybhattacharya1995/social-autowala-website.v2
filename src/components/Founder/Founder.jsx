import { useReveal } from '../../hooks/useReveal';
import styles from './Founder.module.css';

export default function Founder() {
  const eyebrow = useReveal();
  const text = useReveal();
  const vis = useReveal();
  return (
    <section className="section-pad" id="founder">
      <div className="eyebrow" ref={eyebrow}>The Founder</div>
      <div className={styles.wrap}>
        <div ref={text}>
          <h2 className={styles.h2}>Surya <span className="g">Bhattacharya.</span></h2>
          <p className={styles.p}>
            An HR professional turned digital marketing powerhouse. From corporate HR to founding
            Social Autowala — with deep expertise in influencer marketing, social media strategy, and
            Bengali-centric creative campaigns.
          </p>
          <p className={styles.p}>
            His passion for video creation and sophisticated, motivational content drives the creative
            engine. When he's not orchestrating campaigns, he's building the next big thing — 18 hours a day.
          </p>
          <div className={styles.contact}>
            <a href="mailto:info@socialautowala.com" data-magnet>info@socialautowala.com</a>
            <a href="tel:+918981660511" data-magnet>+91 89816 60511</a>
          </div>
        </div>
        <div className={styles.vis} ref={vis}>
          <span className={styles.ring} />
          <span className={styles.ring2} />
          <span className={styles.mono}>SB</span>
        </div>
      </div>
    </section>
  );
}
