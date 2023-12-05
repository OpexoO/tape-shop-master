import Head from 'next/head';
import styles from '@/styles/modules/Contact.module.scss';
import { FormEvent, useState } from 'react';
import ContactFeedbackService from '@/services/contactFeedback.service';
import httpMethods from '@/constants/httpMethods';
import ToastService from '@/services/toast.service';
import { ServerData } from '@/interfaces/serverData';
import Loader from '@/components/Loader';
import LinkService from '@/services/link.service';

const CONTACT_URL = LinkService.apiContactLink();

export default function Contact() {
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const body = ContactFeedbackService.prepareFields({
      name: form.get('name')?.toString() || '',
      email: form.get('email')?.toString() || '',
      message: form.get('message')?.toString() || '',
    });

    try {
      const res = await fetch(CONTACT_URL, {
        method: httpMethods.post,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const { data }: ServerData<string> = await res.json();

      if (!res.ok) {
        throw new Error(data as string);
      }
      ToastService.success(data);
    } catch (error: any) {
      console.error(error);
      ToastService.error(error.message as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact - QuiPtaping</title>
        <meta
          name="description"
          content="QuiPtaping is a registered brand of Mypro BV., the Netherlands.
           We develop and market applications for tape.
           Our products are marketed in Europe, North America, Canada, Mexico, Australia and New Zealand."
        />
        <meta name="dc.title" content="Contact - QuiPtaping" />
        <meta
          name="dc.description"
          content="QuiPtaping is a registered brand of Mypro BV., the Netherlands.
           We develop and market applications for tape.
           Our products are marketed in Europe, North America, Canada, Mexico, Australia and New Zealand."
        />
        <meta name="dc.relation" content={LinkService.contactLink()} />
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link rel="canonical" href={LinkService.contactLink()} />
        <meta property="og:url" content={LinkService.contactLink()} />
        <meta property="og:title" content="Contact - QuiPtaping" />
        <meta
          property="og:description"
          content="QuiPtaping is a registered brand of Mypro BV., the Netherlands.
           We develop and market applications for tape.
           Our products are marketed in Europe, North America, Canada, Mexico, Australia and New Zealand."
        />
        <meta name="twitter:title" content="Contact - QuiPtaping" />
        <meta
          name="twitter:description"
          content="QuiPtaping is a registered brand of Mypro BV., the Netherlands.
           We develop and market applications for tape.
           Our products are marketed in Europe, North America, Canada, Mexico, Australia and New Zealand."
        />
      </Head>
      <div className={`${styles.contact} container`}>
        <section className={styles.contactForm}>
          <h2 className="title">Contact</h2>
          {loading && <Loader />}
          {!loading
            && <>
              <form action={CONTACT_URL} method="POST" className={styles.form} onSubmit={onSubmit}>
                <div className={styles.formItem}>
                  <label className={styles.formLabel} htmlFor="name">Name</label>
                  <input
                    className={styles.formInput}
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    required
                  />
                </div>
                <div className={styles.formItem}>
                  <label className={styles.formLabel} htmlFor="email">E-mail</label>
                  <input className={styles.formInput}
                    type="email" inputMode="email" id="email" name="email"
                    placeholder="E-mail" required />
                </div>
                <div className={styles.formItem}>
                  <label className={styles.formLabel} htmlFor="message">Message</label>
                  <textarea
                    className={`${styles.formInput} ${styles.formTextarea}`}
                    id="message" name="message"
                    rows={4} required
                  />
                </div>
                <button type="submit" className={styles.formBtn}>
                  Send
                </button>
              </form>
            </>}
        </section>
      </div>
    </>
  );
}
