import { TESTIMONIALS } from '../../data/content';
import { useReveal } from '../../hooks/useReveal';
import styles from './Testimonials.module.css';

function Card({ quote, who, role }) {
  const ref = useReveal();
  return (
    <div className={styles.card} ref={ref}>
      <div className={styles.quote}>&ldquo;</div>
      <p className={styles.text}>{quote}</p>
      <div className={styles.who}>{who}</div>
      <div className={styles.role}>{role}</div>
    </div>
  );
}

export default function Testimonials() {
  const head = useReveal();
  const eyebrow = useReveal();
  return (
    <section className="section-pad" id="testimonials">
      <div className="eyebrow" ref={eyebrow}>Testimonials</div>
      <h2 className="sec-head" ref={head}>Straight From <span className="g">The Feed.</span></h2>
      <div className={styles.grid}>
        {TESTIMONIALS.map(t => <Card key={t.who} {...t} />)}
      </div>
    </section>
  );
}
