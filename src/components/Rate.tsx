import { useState } from 'react';
import styles from '@/styles/modules/Rate.module.scss';

type Props = Partial<{
  isStatic: boolean;
  max: number;
  rating: number;
  onChange: CallableFunction;
}>

function Star({ filled, isStatic }: { filled: boolean, isStatic: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`
        ${styles.rateIcon} ${!isStatic && styles.rateIconDynamic} ${filled && styles.rateIconFilled}
      `}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588
        1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0
        00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0
        00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}

export default function Rate({ isStatic = false, max = 5, rating = 0, onChange = () => { } }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const filledStars = (idx: number) => (hovered !== null && !isStatic ? idx <= hovered : idx < rating);

  return (
    <div className={`${styles.rateContainer} ${!isStatic && styles.rateContainerDynamic}`}>
      {Array.from({ length: max }).map((_: unknown, idx: number) => (
        <div key={idx}
          tabIndex={0}
          onMouseEnter={() => !isStatic && setHovered(idx)}
          onMouseLeave={() => !isStatic && setHovered(null)}
          onClick={() => !isStatic && onChange(idx + 1)}>
          <Star filled={filledStars(idx)} isStatic={isStatic} />
        </div>
      ))}
    </div>
  );
}
