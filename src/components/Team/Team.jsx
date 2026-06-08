import { TEAM } from '../../data/content';
import { useReveal } from '../../hooks/useReveal';
import styles from './Team.module.css';

function TeamCard({ initials, name, role, desc }) {
  const ref = useReveal();
  return (
    <div className={styles.card} ref={ref}>
      <div className={styles.av}>{initials}</div>
      <div className={styles.name}>{name}</div>
      <div className={styles.role}>{role}</div>
      <div className={styles.desc}>{desc}</div>
    </div>
  );
}

export default function Team() {
  const head = useReveal();
  const eyebrow = useReveal();
  return (
    <section className="section-pad" id="team">
      <div className="eyebrow" ref={eyebrow}>Our Team</div>
      <h2 className="sec-head" ref={head}>The Crew Behind <span className="g">The Ride.</span></h2>
      <div className={styles.grid}>
        {TEAM.map(t => <TeamCard key={t.name} {...t} />)}
      </div>
    </section>
  );
}
