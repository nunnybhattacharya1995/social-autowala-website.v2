import { CONTACT_INFO } from '../../data/content';
import { useReveal } from '../../hooks/useReveal';
import styles from './Contact.module.css';

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/surya_media.hr/', path: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="1.2" fill="currentColor" /></>, stroke: true },
  { label: 'Facebook', href: 'https://www.facebook.com/boyofjoy', path: <path d="M13 22v-8h3l1-4h-4V8c0-1.1.3-1.8 1.8-1.8H17V2.8C16.4 2.7 15.3 2.6 14 2.6 11.2 2.6 9.3 4.3 9.3 7.5V10H6v4h3.3v8z" />, stroke: false },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/suryabhattacharya/', path: <path d="M4.5 3.5a2 2 0 11-.01 4.01A2 2 0 014.5 3.5zM3 9h3v12H3zM9 9h2.9v1.7h.04C12.3 9.6 13.7 9 15.4 9c3 0 3.6 2 3.6 4.6V21h-3v-6c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21H9z" />, stroke: false },
  { label: 'WhatsApp', href: 'https://wa.me/918981660511', path: <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1012 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .3-3.4-.7s-3.9-3.4-4-3.6c-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.6c-.2.2-.3.4-.1.7s.7 1.2 1.5 1.9c1 .9 1.8 1.1 2 1.2.3.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .2 0 .7-.2 1.1z" />, stroke: false },
];

function InfoCard({ k, v }) {
  const ref = useReveal();
  return (
    <div className={styles.ci} ref={ref}>
      <div className={styles.k}>{k}</div>
      <div className={styles.v}>{v}</div>
    </div>
  );
}

export default function Contact() {
  const belt = useReveal();
  const head = useReveal();
  const socials = useReveal();
  return (
    <section className={`section-pad ${styles.contact}`} id="contact">
      <div className={styles.belt} ref={belt}>Kursi ki peti bandh liya na?</div>
      <h2 className={styles.head} ref={head}>Let's Build<br />Something<br /><span className="g">That Works.</span></h2>
      <a href="mailto:info@socialautowala.com" className={`btn-primary ${styles.start}`} data-magnet>Start Your Journey</a>
      <div className={styles.info}>
        {CONTACT_INFO.map(c => <InfoCard key={c.k} {...c} />)}
      </div>
      <div className={styles.socials} ref={socials}>
        {SOCIALS.map(s => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener" aria-label={s.label} data-magnet>
            <svg viewBox="0 0 24 24" fill={s.stroke ? 'none' : 'currentColor'} stroke={s.stroke ? 'currentColor' : 'none'} strokeWidth="1.6">{s.path}</svg>
          </a>
        ))}
      </div>
    </section>
  );
}
