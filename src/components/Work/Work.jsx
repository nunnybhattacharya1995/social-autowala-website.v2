import { WORK_ITEMS } from '../../data/content';
import { useReveal } from '../../hooks/useReveal';
import styles from './Work.module.css';

function WorkItem({ name, tag, meta }) {
  const ref = useReveal();
  return (
    <div className={styles.item} ref={ref} data-cursor="View Project →">
      <div className={styles.glow} />
      <div>
        <div className={`${styles.name} display`}>{name}</div>
        <div className={styles.tag}>{tag}</div>
      </div>
      <div className={styles.meta}>
        {meta.map((m, i) => (
          <div className={styles.m} key={i}>{m.b && <b>{m.b}</b>}{m.t}</div>
        ))}
      </div>
    </div>
  );
}

export default function Work() {
  const head = useReveal();
  const eyebrow = useReveal();
  return (
    <section className="section-pad" id="work">
      <div className="eyebrow" ref={eyebrow}>Selected Work</div>
      <h2 className="sec-head" ref={head}>See Results, <span className="g">See Reinventions.</span></h2>
      <div className={styles.list}>
        {WORK_ITEMS.map(w => <WorkItem key={w.name} {...w} />)}
      </div>
    </section>
  );
}
