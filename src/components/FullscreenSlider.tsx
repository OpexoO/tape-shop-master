import { faArrowLeft, faArrowRight, faCompress, faExpand, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import styles from '@/styles/modules/Thumbnails.module.scss';
import Image from 'next/image';
import keyboardKeys from '@/constants/keys';

const GAP = 32;

// TODO: add draggable slider in v2.0
export default function FullscreenSlider(
  { images, onClose }: { images: string[], onClose: CallableFunction },
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handleFullscreenClick = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }

    containerRef.current!.requestFullscreen()
      .catch((err) => {
        console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
      });
  };

  const onArrowClick = (e: MouseEvent, action: string) => {
    e.preventDefault();
    e.stopPropagation();
    slideImages(action);
  };

  const slideImages = (action: string) => {
    setActiveIdx((state: number) => {
      let idx: number = state;
      if (action === keyboardKeys.ArrowLeft) {
        idx -= 1;
      } else if (action === keyboardKeys.ArrowRight) {
        idx += 1;
      } else {
        console.warn(`Unknown slider action: ${action}`);
        return state;
      }

      let nextIdx: number = idx;
      if (idx < 0) {
        nextIdx = images.length - 1;
      } else if (idx >= images.length) {
        nextIdx = 0;
      } else {
        nextIdx = idx;
      }

      const position = -(nextIdx * (sliderRef.current!.getBoundingClientRect().width + GAP));
      sliderRef.current!.style.transform = `translateX(${position}px)`;

      return nextIdx;
    });
  };

  useEffect(() => {
    const el = containerRef.current!;
    const screenChangeListener = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    el.addEventListener('fullscreenchange', screenChangeListener);

    const arrowClickHandler = (e: KeyboardEvent) => {
      if ([keyboardKeys.ArrowLeft, keyboardKeys.ArrowRight].includes(e.key)) {
        slideImages(e.key);
      } else if (e.key === keyboardKeys.Escape) {
        onClose();
      }
    };
    document.addEventListener('keydown', arrowClickHandler);

    return () => {
      document.removeEventListener('keydown', arrowClickHandler);
      el.removeEventListener('fullscreenchange', screenChangeListener);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.fullscreenSliderWrapper}>
      <div className={styles.fullscreenSliderBg}></div>

      <div className={styles.fullscreenSlider}>
        <div className={styles.fullscreenSliderHeader}>
          <div>{activeIdx + 1} / {images.length}</div>
          <div className={styles.fullscreenSliderHeaderActions}>
            <FontAwesomeIcon
              className={styles.fullscreenSliderIcon}
              icon={isFullscreen ? faCompress : faExpand}
              size="lg"
              onClick={handleFullscreenClick}
            />
            <FontAwesomeIcon
              onClick={() => onClose()}
              className={styles.fullscreenSliderIcon}
              icon={faXmark}
              size="xl"
            />
          </div>
        </div>

        <div className={styles.fullscreenSliderBody} onClick={() => onClose()}>
          <div
            className={styles.fullscreenSliderSwitch}
            onClick={(e) => onArrowClick(e, keyboardKeys.ArrowLeft)}
          >
            <FontAwesomeIcon
              className={styles.fullscreenSliderIcon}
              icon={faArrowLeft}
              size="lg"
            />
          </div>
          <div className={styles.sliderImgWrapper}>
            <div className={styles.sliderImgSlider} ref={sliderRef}>
              {images.map((i: string, idx: number) => (
                <Image
                  className={styles.sliderImg}
                  key={`${i}_${idx}`}
                  src={i}
                  width={640}
                  height={640}
                  alt=''
                  priority
                />
              ))}
            </div>
          </div>
          <div
            className={styles.fullscreenSliderSwitch}
            onClick={(e) => onArrowClick(e, keyboardKeys.ArrowRight)}
          >
            <FontAwesomeIcon
              className={styles.fullscreenSliderIcon}
              icon={faArrowRight}
              size="lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
