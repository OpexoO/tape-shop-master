import { Product } from '@/interfaces/product/product';

/* eslint-disable max-len */
export function faqJsonLd() {
  return {
    __html: `{
      "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is it possible to apply double sided tape with the QuiP tape dispenser?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "<p>Yes it certainly is. For masking large surfaces with
              foil or other materials you first apply the double sided tape and
              then you apply the foil. Flexible masking tape can be applied easily with the tape dispneser.</p>"
            }
          }, 
          {
            "@type": "Question",
            "name": "Things to know when applying tape?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "<p>Depending on what Quip tape dispenser you are using also smaller bandwidth of tapes cab
              be applies and when required you can determine the distance from appliance yourself.
              Importnat are tapewidth, surface, adhesion strength and durability.
              QuiP taping has put these in a quadrant. so that you can select the best suitable tape.</p>"
            }
          },
          {
            "@type": "Question",
            "name": "What tape widths can be applied with Quip tape dispensers?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "<p>QuiP® has tape dispensers for the appliance of tape up to 38mm.
              In general de length of a tape is up to 50 – 60 meters.</p>"
            }
          },
          {
            "@type": "Question",
            "name": "What brand of tape is be advised?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "<p>In principle every tape can be used.
              However the quality of the tape finally determines the result of your painting job.
              QuiPtaping has masking tapes of superior quality that gives you that result.
              Different tapes for different surfaces. No leaking, sharp and clean edges.</p>"
            }
          },
          {
            "@type": "Question",
            "name": "Can the knife be replaced?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "<p>The knife can not be replaced.
              The knife of the QuiP tape dispenser is produced of the right hardness that in case
              the knife hits the surface it will not be damaged and the knife will keep its function.
              But in case of incorrect usage the knife will finally damaged too much and loses its function.
              We therefor advise you to read the instructions carefully.</p>"
            }
          },
          {
            "@type": "Question",
            "name": "I put a lot of tension and press the tape dispenser firmly at the surface.
            Why does the tape slip?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "<p>
              At the start it is import without rolling off the tape you press the tape against the surface.
              Do not us too much tension when applying the tape further as this makes
              it a hard job and prevents you to apply the tape in the right way.</p>"
            }
          },
          {
            "@type": "Question",
            "name": "Why the QuiP tape dispenser is designed with a cover?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "<p>Tape “bleeds”; at theside and atrracts dist and dirt.
              After applying tape and start to paint you see that grease sits in the way.
              After removing the tape you see the particles coming back in your paint job.
              The cover of the tape dispenser prevents this.</p>"
            }
          }
        ]
    }`,
  };
}

export function userInstructionsJsonLd() {
  return {
    __html: `{
      "@context": "https://schema.org/",
      "@type": "Recipe",
      "name": "Details of the Quip Tape Dispenser & Systainer",
      "description": "When you use QuiPtaping for the first time, it is helpful to use this step-by-step plan.",
      "keywords": "quiptaping instructions, quiptaping steps, quiptaping, quip tape, quip tape dispenser",
      "recipeYield": "10",
      "recipeInstructions": [
        {
          "@type": "HowToStep",
          "name": "Step 1",
          "text": "Open the lid and put the tape on the spool. Enter the tape throught to the SAFETY LOCK. Close the lid again.",
          "image": "${process.env.NEXT_PUBLIC_DOMAIN}/images/instructions/step1.jpg"
        },
        {
          "@type": "HowToStep",
          "name": "Step 2",
          "text": "Press the tape against the SAFETY LOCK and keep the front free.",
          "image": "${process.env.NEXT_PUBLIC_DOMAIN}/images/instructions/step2.jpg"
        },
        {
          "@type": "HowToStep",
          "name": "Step 3",
          "text": "Now push the trigger. The tape is cut straight. The dispenser is now ready for use.",
          "image": "${process.env.NEXT_PUBLIC_DOMAIN}/images/instructions/step3.jpg"
        },
        {
          "@type": "HowToStep",
          "name": "Step 4",
          "text": "Press the indicator and bottom of the dispenser first against the corner and surface, then press the tape. Do not put much force or the tape will slip.",
          "image": "${process.env.NEXT_PUBLIC_DOMAIN}/images/instructions/step4.jpg"
        },
        {
          "@type": "HowToStep",
          "name": "Step 5",
          "text": "Move the dispenser down and maintains contact along which the tape becomes applied. Turn the dispenser during unrolling. Do NOT press the trigger during taping!",
          "image": "${process.env.NEXT_PUBLIC_DOMAIN}/images/instructions/step5.jpg"
        },
        {
          "@type": "HowToStep",
          "name": "Step 6",
          "text": "Turn the top of the dispenser completely against the surface until the indicator reaches the corner.",
          "image": "${process.env.NEXT_PUBLIC_DOMAIN}/images/instructions/step6.jpg"
        },
        {
          "@type": "HowToStep",
          "name": "Step 7",
          "text": "The SAFETY LOCK is now pressed, which activates the trigger.",
          "image": "${process.env.NEXT_PUBLIC_DOMAIN}/images/instructions/step7.jpg"
        },
        {
          "@type": "HowToStep",
          "name": "Step 8",
          "text": "Press the trigger: the tape is cut exactly to the corner. The tape is to length for the next surface to be taped.",
          "image": "${process.env.NEXT_PUBLIC_DOMAIN}/images/instructions/step8.jpg"
        }
      ],
      "video": {
        "@type": "VideoObject",
        "name": "Demo and Details of the Quip Tape Dispenser & Systainer - QuiPtaping",
        "description": "When you use QuiPtaping for the first time, it is helpful to use this step-by-step plan. Watch the video following the eight steps.",
        "thumbnailUrl": [
          "http://i3.ytimg.com/vi/bh2vlymVoyU/hqdefault.jpg"
        ],
        "uploadDate": "2022-07-25T08:00:00+08:00",
        "duration": "PT1M01S",
        "contentUrl": "https://www.youtube.com/watch?v=bh2vlymVoyU"
      }
    }`,
  };
}

export function productJsonLs(product: Product) {
  return {
    __html: `{
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "${product.name}",
      "image": [
        "${product.images[0]}"
       ],
      "description": "${product.description}",
      "sku": "${product.sku}",
      "brand": {
        "@type": "Brand",
        "name": "QuipTaping"
      },
      "offers": {
        "@type": "Offer",
        "url": "${process.env.NEXT_PUBLIC_DOMAIN}/products/${product._id}",
        "priceCurrency": "USD",
        "price": "${product.price.toString()}"
      }
    }`,
  };
}
