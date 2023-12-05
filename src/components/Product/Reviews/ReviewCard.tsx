import { Review } from '@/interfaces/review';
import Image from 'next/image';
import styles from '@/styles/modules/Review.module.scss';
import Rate from '@/components/Rate';
import { formatDate } from '@/utils/helpers';
import { memo } from 'react';

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className={styles.reviewCard}>
      <Image
        className={styles.reviewCardImage}
        src="https://secure.gravatar.com/avatar/4d769b1113f87c5043a3c604a193724e?s=60&d=mm&r=g"
        alt={`${review.name} avatar`}
        width={44}
        height={44}
        loading="lazy"
        decoding="async"
      />
      <div className={styles.reviewCardContent}>
        <div className={styles.reviewCardMeta}>
          {review.isChecked
            && <>
              <span className={`${styles.reviewCardName} bold`}>{review.name}</span>
              <time className={styles.reviewCardDate} dateTime={review.date}>
                {formatDate(review.date)}
              </time>
            </>
          }
          {!review.isChecked && <span>Your review is awaiting approval</span>}
        </div>
        <Rate isStatic={true} rating={review.rating} />
        <p className={styles.reviewCardText}>{review.text}</p>
      </div>
    </div>
  );
}

const ReviewCardMemo = memo(ReviewCard);
export default ReviewCardMemo;
