import Image from 'next/image';
import styles from '@/styles/modules/UserInstructions.module.scss';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';

export default function TapeInsctructions() {
  return (
    <div className={`${styles.steps} ${styles.instructionsBlock} container`}>
      <div className={styles.step}>
        <div className={styles.stepAsset}>
          <LiteYouTubeEmbed
            id="bh2vlymVoyU"
            title="QuiP tape dispenser - User instructions"
            iframeClass={styles.stepAsset}
            noCookie={true}
            aspectWidth={3}
            aspectHeight={2}
          />
        </div>
        <div>
          <h3 className={`${styles.instructionsTitle} title`}>Instruction video</h3>
          <p>
            When you use QuiPtaping for the first time, it is helpful to use this step-by-step plan.<br />
            Watch the video following the eight steps.
          </p>
        </div>
      </div>

      <div className={styles.step}>
        <Image
          className={styles.stepAsset}
          src="/images/instructions/step1.jpg"
          alt="QuiPtaping logo"
          priority
          width={320}
          height={200} />
        <div>
          <h3 className={`${styles.instructionsTitle} title`}>Step 1:</h3>
          <p>
            Open the lid and put the tape on the spool. Enter the tape throught to the SAFETY LOCK.<br />
            Close the lid again.
          </p>
        </div>
      </div>

      <div className={styles.step}>
        <Image
          className={styles.stepAsset}
          src="/images/instructions/step2.jpg"
          alt="QuiPtaping logo"
          priority
          width={320}
          height={200} />
        <div>
          <h3 className={`${styles.instructionsTitle} title`}>Step 2:</h3>
          <p>Press the tape against the SAFETY LOCK and keep the front free.</p>
        </div>
      </div>

      <div className={styles.step}>
        <Image
          className={styles.stepAsset}
          src="/images/instructions/step3.jpg"
          alt="QuiPtaping logo"
          loading="lazy"
          decoding="async"
          width={320}
          height={200} />
        <div>
          <h3 className={`${styles.instructionsTitle} title`}>Step 3:</h3>
          <p>Now push the trigger. The tape is cut straight. The dispenser is now ready for use.</p>
        </div>
      </div>

      <div className={styles.step}>
        <Image
          className={styles.stepAsset}
          src="/images/instructions/step4.jpg"
          alt="QuiPtaping logo"
          loading="lazy"
          decoding="async"
          width={320}
          height={200} />
        <div>
          <h3 className={`${styles.instructionsTitle} title`}>Step 4:</h3>
          <p>
            Press the indicator and bottom of the dispenser first against the corner and surface,
            then press the tape. Do not put much force or the tape will slip.
          </p>
        </div>
      </div>

      <div className={styles.step}>
        <Image
          className={styles.stepAsset}
          src="/images/instructions/step5.jpg"
          alt="QuiPtaping logo"
          loading="lazy"
          decoding="async"
          width={320}
          height={200} />
        <div>
          <h3 className={`${styles.instructionsTitle} title`}>Step 5:</h3>
          <p>
            Move the dispenser down and maintains contact along which the tape becomes applied.
            Turn the dispenser during unrolling.
          </p>
          <p>Do <span className="bold">NOT</span> press the trigger during taping!</p>
        </div>
      </div>

      <div className={styles.step}>
        <Image
          className={styles.stepAsset}
          src="/images/instructions/step6.jpg"
          alt="QuiPtaping logo"
          loading="lazy"
          decoding="async"
          width={320}
          height={200} />
        <div>
          <h3 className={`${styles.instructionsTitle} title`}>Step 6:</h3>
          <p>
            Turn the top of the dispenser completely
            against the surface until the indicator reaches the corner.
          </p>
        </div>
      </div>

      <div className={styles.step}>
        <Image
          className={styles.stepAsset}
          src="/images/instructions/step7.jpg"
          alt="QuiPtaping logo"
          loading="lazy"
          decoding="async"
          width={320}
          height={200} />
        <div>
          <h3 className={`${styles.instructionsTitle} title`}>Step 7:</h3>
          <p>The SAFETY LOCK is now pressed, which activates the trigger.</p>
        </div>
      </div>

      <div className={styles.step}>
        <Image
          className={styles.stepAsset}
          src="/images/instructions/step6.jpg"
          alt="QuiPtaping logo"
          loading="lazy"
          decoding="async"
          width={320}
          height={200} />
        <div>
          <h3 className={`${styles.instructionsTitle} title`}>Step 8:</h3>
          <p>
            Press the trigger: the tape is cut exactly to the corner.
            The tape is to length for the next surface to be taped.
          </p>
        </div>
      </div>
    </div>
  );
}
