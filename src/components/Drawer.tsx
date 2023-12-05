import { MouseEvent, ReactNode } from 'react';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '@/styles/modules/Drawer.module.scss';

type Props = {
  isOpened: boolean;
  setIsOpened: CallableFunction;
  children: ReactNode;
}

// TODO: fix animation on closing drawer
export default function Drawer({ isOpened, setIsOpened, children }: Props) {
  const handleOutsideClick = (e: MouseEvent) => {
    const el = e.target as HTMLElement;
    if (el.classList.contains(styles.drawerContainer)) {
      setIsOpened(false);
    }
  };

  return (
    <div
      className={`${styles.drawerContainer} ${isOpened && styles.drawerContainerOpened}`}
      onClick={handleOutsideClick}>
      <div className={`${styles.drawer} ${isOpened && styles.drawerOpened}`}>
        <div className={styles.drawerHeader}>
          <FontAwesomeIcon
            className={styles.drawerIcon}
            onClick={() => setIsOpened(false)}
            icon={faXmark} size="lg" />
        </div>
        <div className={styles.drawerBody}>
          {children}
        </div>
      </div>
    </div>
  );
}
