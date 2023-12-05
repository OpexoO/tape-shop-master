import styles from '@/styles/modules/Thumbnails.module.scss';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { MouseEvent, memo, useRef, useState } from 'react';
import FullscreenSlider from './FullscreenSlider';

const Thumbnails = memo(ThumbnailsMemo);
export default Thumbnails;

function ThumbnailsMemo({ images }: { images: string[] }) {
  const imgSliderRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number>(0);
  const [isSliderOpened, setIsSliderOpened] = useState<boolean>(false);

  const getZoomImage = () => document
    .querySelector(`[data-id="${images[selected]}_${selected}"]`) as HTMLImageElement;

  const changeImage = (idx: number) => {
    setSelected(idx);
    const position = -(idx * imgSliderRef.current!.getBoundingClientRect().width);
    imgSliderRef.current!.style.transform = `translateX(${position}px)`;
  };

  const onMouseOver = () => {
    getZoomImage().style.opacity = '1';
  };

  const onMouseOut = () => {
    const el = getZoomImage();
    el.style.opacity = '0';
    el.style.top = '0px';
    el.style.left = '0px';
  };

  const onMouseMove = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const { left, top } = target.getBoundingClientRect();
    const x = left - e.clientX;
    const y = top - e.clientY;

    const el = getZoomImage();
    el.style.top = `${y}px`;
    el.style.left = `${x}px`;
  };

  return (
    <>
      <div>
        <div className={styles.mainBlockWrapper}>
          <div ref={imgSliderRef} className={styles.mainBlock}>
            {images.map((img: string, idx: any) => (
              <div
                key={`${img}_${idx}`}
                className={styles.mainImgWrapper}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onMouseMove={onMouseMove}
              >
                <div className={styles.mainImgBlock}>
                  <Image
                    className={`${styles.mainImg}`}
                    src={img}
                    alt={''}
                    width={295}
                    height={295}
                    priority
                  />
                  <div className={styles.mainBlockIcon}>
                    <FontAwesomeIcon
                      onClick={() => setIsSliderOpened(true)}
                      icon={faMagnifyingGlass}
                      size="lg"
                    />
                  </div>
                </div>
                <Image
                  data-id={`${img}_${idx}`}
                  className={styles.zoomImg}
                  width={590}
                  height={590}
                  src={img}
                  alt=''
                  decoding="async"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {
          images.length > 1
          && <ul className={styles.thumbContainer}>
            {images.map((img: string, idx: number) => (
              <li
                key={`${img}_${idx}`}
                className={`${styles.thumbImg} ${selected === idx && styles.thumbImgActive}`}
                onClick={() => changeImage(idx)}
              >
                <Image
                  src={img}
                  alt={''}
                  width={100}
                  height={100}
                  priority
                />
              </li>
            ))}
          </ul>
        }
      </div>

      {isSliderOpened && <FullscreenSlider images={images} onClose={() => setIsSliderOpened(false)} />}
    </>
  );
}
