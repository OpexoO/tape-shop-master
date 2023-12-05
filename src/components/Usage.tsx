import Head from 'next/head';
import styles from '@/styles/modules/Usage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import LinkService from '@/services/link.service';

export default function Usage() {
  return (
    <>
      <Head>
        <title>Usage - QuiPtaping</title>
        <meta
          name="description"
          content="Describing usage of QuiP tapes"
        />
        <meta name="dc.title" content="Usage - QuiPtaping" />
        <meta
          name="dc.description"
          content="Describing usage of QuiP tapes"
        />
        <meta name="dc.relation" content={LinkService.usageLink()} />
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link rel="canonical" href={LinkService.usageLink()} />
        <meta property="og:url" content={LinkService.usageLink()} />
        <meta property="og:title" content="Usage - QuiPtaping" />
        <meta
          property="og:description"
          content="Describing usage of QuiP tapes"
        />
        <meta name="twitter:title" content="Usage - QuiPtaping" />
        <meta
          name="twitter:description"
          content="Describing usage of QuiP tapes"
        />
      </Head>
      <section className={`${styles.usageContainer} container`}>
        <h2 className="title">What masking tape for what surface</h2>
        <ul>
          <li className={styles.usageListItem}>
            <FontAwesomeIcon icon={faCheck} className={styles.usageIcon} />
            The backing of the tape is made of washi (rice paper)
          </li>
          <li className={styles.usageListItem}>
            <FontAwesomeIcon icon={faCheck} className={styles.usageIcon} />
            It is very thin, strong, smooth and does’nt stretch
          </li>
          <li className={styles.usageListItem}>
            <FontAwesomeIcon icon={faCheck} className={styles.usageIcon} />
            Tape leaves absolutely no paint through, also not on water base
          </li>
          <li className={styles.usageListItem}>
            <FontAwesomeIcon icon={faCheck} className={styles.usageIcon} />
            Easy to remove at an angle of 45 degrees
          </li>
          <li className={styles.usageListItem}>
            <FontAwesomeIcon icon={faCheck} className={styles.usageIcon} />
            Leaves no glue residue on removal
          </li>
          <li className={styles.usageListItem}>
            <FontAwesomeIcon icon={faCheck} className={styles.usageIcon} />
            This creates beautiful sharp paint edges.
          </li>
        </ul>
      </section>
      <div className={`${styles.usageContainer} ${styles.usageBlock} container`}>
        <section>
          <h2 className="title centered">Glass, tiles and metal</h2>
          <p className={styles.usageText}>
            <span className="bold">QuiP® tape Gold</span> is best suited for masking smooth surfaces.
          </p>
          <p className={styles.usageText}>
            If the varnish has hardened enough (at least 6 weeks after application),
            QuiP® tape Gold can also be used.
          </p>
        </section>
        <section>
          <h2 className="title centered">Stone en gips</h2>
          <p className={styles.usageText}>
            For these surfaces, tape with greater adhesion is required due to the
            coarse structure of walls and ceilings.
            However, the tape must not have too much adhesive force.
          </p>
          <p className={styles.usageText}>
            We therefore advise you on <span className="bold">QuiP® tape RED.</span>
          </p>
        </section>
      </div>
      <div className={`${styles.usageContainer} ${styles.usageBlock} container`}>
        <section>
          <h2 className="title centered">Wallpaper & latex</h2>
          <p className={styles.usageText}>
            Suitable for sensitive surfaces such as wallpaper and latex.
            If the wall paint is applied “fresh” and you want to stick tape,
            then we recommend a tape with less adhesive strength, in this case &nbsp;
            <span className="bold">QuiP® tape PURPLE.</span>
          </p>
        </section>
        <section>
          <h2 className="title centered">Newly painted surface</h2>
          <p className={styles.usageText}>
            <span className="bold">QuiP® Tape GREEN</span> is strong, smooth and tight so that
            solvents and moisture no longer have a chance to penetrate under the tape.
            This creates beautiful sharp paint edges. QuiP® Tape GREEN
            works optimally on freshly painted surfaces.
          </p>
        </section>
      </div>
    </>
  );
}
