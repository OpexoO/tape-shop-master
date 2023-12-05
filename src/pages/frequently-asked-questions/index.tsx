import LinkService from '@/services/link.service';
import styles from '@/styles/modules/UserInstructions.module.scss';
import { faqJsonLd } from '@/utils/jsonLd';
import Head from 'next/head';

// TODO: Create accordion item instead of details tag
export default function FrequentlyAskedQuestions({ isStandalone = true }: { isStandalone: boolean }) {
  const containerClassName = isStandalone ? `container ${styles.instructionsBlock}` : styles.qa;

  return (
    <>
      {isStandalone
        && <Head>
          <title>Frequently Asked Questions - QuiPtaping</title>
          <meta
            name="description"
            content="The painting tape of QuiP meets the highest requirements for perfectly tight paintwork.
            QuiP tape has been specially developed for use on different surfaces.
            QuiP tape provides very tight paint lines and can be removed after a longer period of
            time without glue residue. Very nice if you have spent many hours masking and preparing.
            Good tape pays for itself quickly."
          />
          <meta name="dc.title" content="Frequently Asked Questions - QuiPtaping" />
          <meta
            name="dc.description"
            content="The painting tape of QuiP meets the highest requirements for perfectly tight paintwork.
            QuiP tape has been specially developed for use on different surfaces.
            QuiP tape provides very tight paint lines and can be removed after a longer period of
            time without glue residue. Very nice if you have spent many hours masking and preparing.
            Good tape pays for itself quickly."
          />
          <meta name="dc.relation" content={LinkService.faqLink()} />
          <meta name="robots" content="index, follow" />
          <meta
            name="googlebot"
            content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
          />
          <meta
            name="bingbot"
            content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
          />
          <link rel="canonical" href={LinkService.faqLink()} />
          <meta property="og:url" content={LinkService.faqLink()} />
          <meta property="og:title" content="Frequently Asked Questions - QuiPtaping" />
          <meta
            property="og:description"
            content="The painting tape of QuiP meets the highest requirements for perfectly tight paintwork.
            QuiP tape has been specially developed for use on different surfaces.
            QuiP tape provides very tight paint lines and can be removed after a longer period of
            time without glue residue. Very nice if you have spent many hours masking and preparing.
            Good tape pays for itself quickly."
          />
          <meta name="twitter:title" content="Frequently Asked Questions - QuiPtaping" />
          <meta
            name="twitter:description"
            content="The painting tape of QuiP meets the highest requirements for perfectly tight paintwork.
            QuiP tape has been specially developed for use on different surfaces.
            QuiP tape provides very tight paint lines and can be removed after a longer period of
            time without glue residue. Very nice if you have spent many hours masking and preparing.
            Good tape pays for itself quickly."
          />
          <script type="application/ld+json" dangerouslySetInnerHTML={faqJsonLd()} />
        </Head>
      }
      <article className={containerClassName}>
        <h2 className="title">QuiP tape dispenser: questions and answers</h2>
        <p>
          The painting tape of QuiP meets the highest requirements for perfectly tight paintwork.
          QuiP tape has been specially developed for use on different surfaces.
          QuiP tape provides very tight paint lines and can be removed
          after a longer period of time without glue residue.
        </p>
        <p>
          Very nice if you have spent many hours masking and preparing. Good tape pays for itself quickly
        </p>

        <article className={styles.qaBlock}>
          <h3 className={`${styles.qaTitle} title`}>Quip tape and dispenser</h3>

          <details className={styles.question}>
            <summary className={styles.questionTitle}>
              Is it possible to apply double sided tape with the QuiP tape dispenser?
            </summary>
            <p className={styles.questionText}>
              Yes it certainly is. For masking large surfaces with
              foil or other materials you first apply the double sided tape and
              then you apply the foil. Flexible masking tape can be applied easily with the tape dispneser.
            </p>
          </details>
          <details className={styles.question}>
            <summary className={styles.questionTitle}>Things to know when applying tape?</summary>
            <p className={styles.questionText}>
              Depending on what Quip tape dispenser you are using also smaller bandwidth of tapes cab
              be applies and when required you can determine the distance from appliance yourself.
              Importnat are tapewidth, surface, adhesion strength and durability.
              QuiP taping has put these in a quadrant. so that you can select the best suitable tape.
            </p>
          </details>
          <details className={styles.question}>
            <summary className={styles.questionTitle}>
              What tape widths can be applied with Quip tape dispensers?
            </summary>
            <p className={styles.questionText}>
              QuiP® has tape dispensers for the appliance of tape up to 38mm.
              In general de length of a tape is up to 50 – 60 meters.
            </p>
          </details>
          <details className={styles.question}>
            <summary className={styles.questionTitle}>What brand of tape is be advised?</summary>
            <p className={styles.questionText}>
              In principle every tape can be used.
              However the quality of the tape finally determines the result of your painting job.
              QuiPtaping has masking tapes of superior quality that gives you that result.
              Different tapes for different surfaces. No leaking, sharp and clean edges.
            </p>
          </details>
        </article>

        <article className={styles.qaBlock}>
          <h3 className={`${styles.qaTitle} title`}>Operation and use</h3>
          <details className={styles.question}>
            <summary className={styles.questionTitle}>Can the knife be replaced?</summary>
            <p className={styles.questionText}>
              The knife can not be replaced.
              The knife of the QuiP tape dispenser is produced of the right hardness that in case
              the knife hits the surface it will not be damaged and the knife will keep its function.
              But in case of incorrect usage the knife will finally damaged too much and loses its function.
              We therefor advise you to read the instructions carefully.
            </p>
          </details>
          <details className={styles.question}>
            <summary className={styles.questionTitle}>
              I put a lot of tension and press the tape dispenser firmly at the surface.
              Why does the tape slip?
            </summary>
            <p className={styles.questionText}>
              At the start it is import without rolling off the tape you press the tape against the surface.
              Do not us too much tension when applying the tape further as this makes
              it a hard job and prevents you to apply the tape in the right way.
            </p>
          </details>
          <details className={styles.question}>
            <summary className={styles.questionTitle}>
              Why the QuiP tape dispenser is designed with a cover?
            </summary>
            <p className={styles.questionText}>
              Tape “bleeds”; at theside and atrracts dist and dirt.
              After applying tape and start to paint you see that grease sits in the way.
              After removing the tape you see the particles coming back in your paint job.
              The cover of the tape dispenser prevents this.
            </p>
          </details>
        </article>
      </article>
    </>
  );
}
