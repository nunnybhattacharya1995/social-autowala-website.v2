import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.big}>From Local<br />Streets To<br /><span>Social Feeds.</span></div>
      <div className={styles.meta}>
        <b>SOCIAL AUTOWALA PVT LTD</b><br />
        Meter Down. Marketing On.<br />
        © 2026 Social Autowala.
      </div>
    </footer>
  );
}
