import Head from 'next/head';
import styles from '@/styles/modules/Policy.module.scss';
import LinkService from '@/services/link.service';

export default function Disclaimer() {
  return (
    <>
      <Head>
        <title>Disclaimer - QuiPtaping</title>
        <meta
          name="description"
          content="LEGAL NOTE COPYRIGHT 2011 MYPRO"
        />
        <meta name="dc.title" content="Disclaimer - QuiPtaping" />
        <meta
          name="dc.description"
          content="LEGAL NOTE COPYRIGHT 2011 MYPRO"
        />
        <meta name="dc.relation" content={LinkService.disclaimerLink()} />
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link rel="canonical" href={LinkService.disclaimerLink()} />
        <meta property="og:url" content={LinkService.disclaimerLink()} />
        <meta property="og:title" content="Disclaimer - QuiPtaping" />
        <meta
          property="og:description"
          content="LEGAL NOTE COPYRIGHT 2011 MYPRO"
        />
        <meta name="twitter:title" content="Disclaimer - QuiPtaping" />
        <meta
          name="twitter:description"
          content="LEGAL NOTE COPYRIGHT 2011 MYPRO"
        />
      </Head>
      <div className="container">
        <section>
          <h2 className={`title ${styles.policyTitle}`}>Legal note</h2>

          <p>AMS is the sole Importer and distributor of the QuipTape products in Australasia.</p>
          <p className={styles.policyIndent}>
            Please find below the following legal notes from the brand owners MYPRO BV, the Netherlands.
          </p>

          <p className={styles.policyIndent}>&copy; COPYRIGHT 2011 MYPRO</p>

          <div className={styles.policyBlock}>
            <h3 className={styles.policyBlockTitle}>Terms of usage</h3>
            <p>This information and communication service is provided by MYPRO BV, The Netherlands.</p>
            <p>With this access, the user accepts the following terms of usage without restriction:</p>
          </div>

          <div className={styles.policyBlock}>
            <h3 className={styles.policyBlockTitle}>Copyright – All rights reserved.</h3>
            <p>
              The information furnished on this website
              (text, pictures, graphics, animation, media objects and the layout)
              is subject to the copyright and other data protection acts.
            </p>
            <p>
              The content of these pages may not be copied, altered or provided to
              third parties without the consent of MYPRO BV.
              In particular, duplicates, translations,
              storage and processing in other electronic media are not permitted.
            </p>
            <p>
              Some pages contain pictures, text or media objects
              that are subject to the third party copyright protection.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h3 className={styles.policyBlockTitle}>Brand names</h3>
            <p>
              Unless specified otherwise, all brands on the website are trademarks of MYPRO BV.
              This particularly applies to MYPRO BV brand names, brand logos, company logos and other emblems.
            </p>
            <p>
              The brand names and design elements used on these
              web pages are the intellectual property of MYPRO BV, The Netherlands.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h3 className={styles.policyBlockTitle}>Non-warranty</h3>
            <p>
              The information on this website was created carefully.
              Nevertheless, we cannot guarantee the accuracy and correctness of the information.
            </p>
            <p>
              Therefore, MYPRO BV is excluded from any liability towards damages
              that might arise directly or indirectly from the use of information on this website.
            </p>
            <p className={styles.policyIndent}>
              MYPRO BV is only responsible for such damages in connection with
              the use of this Internet presence, which have been caused intentionally or due to negligence.
            </p>
            <p>
              For the instance involving a sales representative and damages
              that were caused intentionally or through negligence,
              the MYPRO BV’s responsibility is limited to the foreseeable, typical damages, as long as
              it is not due to negligent handling or omission by the vendor’s agencies,
              or as long as no important contractual obligation has been violated.
              The product liability and warranty promises of MYPRO BV remain inviolate.
              The above liability limitations are likewise not applied in case of
              injury to body, health or life.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h3 className={styles.policyBlockTitle}>Validity</h3>
            <p>
              The terms of usage are subject to Dutch Law excluding the UN purchase act.
              Jurisdiction for disputes concerning this Internet presence is Haarlem.
            </p>
            <p>
              Should any of the above terms of usage become ineffective,
              the validity of the remaining terms will remain unaffected by it.
            </p>
          </div>
        </section>

        <section>
          <h2 className={`title ${styles.policyTitle}`}>Privacy</h2>

          <div className={styles.policyBlock}>
            <h3 className={styles.policyBlockTitle}>MYPRO BV DATA PROTECTION PRINCIPLES</h3>
            <p>
              MYPRO welcomes you to the MYPRO website and is pleased with
              your interest in the company and its products.
            </p>
            <p>
              Data protection and information security are a component of our company policy.
              MYPRO takes its data protection duty very seriously.
              Our website is so designed that only as little
              person-related information as required is collected, processed or used.
            </p>
            <p>
              Please note that you can print out these data protection principles
              from your Browser to read them later or for your records
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h3 className={styles.policyBlockTitle}>
              Inquiry, processing and utilization of personal information
            </h3>
            <p>
              MYPRO collects, processes and utilizes personal information only as part of the
              applicable data privacy protection regulations,
              as is expressly permitted or has the active approval of the concerned person.
              When you visit our website, for purely technical reasons,
              we save the name of your Internet Service Provider, the page from which you reached us,
              the MYPRO pages you viewed as well as the date and time of the visit.
              We will delete this personal information later after we have finished using the information.
            </p>
            <p>
              We collect, process and use other personal information only
              if you have willingly furnished it, e.g. for a registration, survey or contract.
            </p>
            <p>
              We delete your personal information after completion and termination of a contract.
              Except such personal information that must be preserved for
              legal purposes for a stipulated period. We will lock such personal information.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h3 className={styles.policyBlockTitle}>
              Processing (particularly forwarding) and
              utilization of personal information (for specific purpose)
            </h3>
            <p>
              MYPRO processes and utilizes your personal information only in the required scope,
              regardless whether it pertains to the technical administration of
              the website or as part of an individual inquiry.
            </p>
            <p>Without your express approval, we will not forward your information to third parties.</p>
          </div>

          <div className={styles.policyBlock}>
            <h3 className={styles.policyBlockTitle}>Security</h3>
            <p>
              MYPRO takes adequate technical and organizational precautions to
              preserve your personal information from unauthorized access of
              persons, against manipulation, loss, destruction or unauthorized disclosure.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h3 className={styles.policyBlockTitle}>Your choice</h3>
            <p className={styles.policyIndent}>
              We also collect, process and utilize your personal information as part of
              Newsletter subscriptions, contests or product surveys, as long as this information is
              necessary for realizing the relevant activity.
              Participation in such actions is naturally voluntary. As part of Newsletter subscriptions,
              MYPRO only collects, saves and uses the E-mail address that is
              required for sending the Newsletter. You can unsubscribe from the Newsletter any time.
            </p>
            <p>
              Your E-mail address is then deleted immediately.
              This option to unsubscribe is given in every issue of the Newsletter.
              For contests, we collect, process and use personal information that is absolutely necessary
              for conducting the contests. This includes your name, your address, your telephone number and
              E-mail address to inform you about the conditions of a contest and to send your prize.
              For the purpose of sending prizes, we hand over the necessary information to a company
              that is responsible for sending the prize.
              Your data is deleted after the contest is finished and prizes have been sent.
              For product surveys, we collect, process and utilize the following personal information.
            </p>
            <p className={styles.policyIndent}>
              If you would not like us to collect and use your personal information,
              you can notify us at any time. We will delete the relevant data immediately.
            </p>
            <p>
              You can change your mind about allowing us to use your information anytime by
              either sending us an E-mail to&nbsp;
              <a className={styles.link} href="mailto:quipnzau@gmail.com">quipnzau@gmail.com</a>.
            </p>
            <p>For more information, go to the pages where the data was recorded.</p>
          </div>

          <div className={styles.policyBlock}>
            <h3 className={styles.policyBlockTitle}>Right to information</h3>
            <p>
              You are authorized at any time to request the personal information
              we have about you free of cost. You can send us such a request by E-mail to&nbsp;
              <a className={styles.link} href="mailto:quipnzau@gmail.com">quipnzau@gmail.com</a>.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h3 className={styles.policyBlockTitle}>Contact</h3>
            <p>
              For complaints and comments about the processing and utilization of your personal data,
              please contact our data security engineers. We are also happy to receive your suggestions.
            </p>
            <p>
              In spite of all our efforts to maintain data integrity,
              if any information is false, we will correct it on your request.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
