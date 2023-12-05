import { Tab } from '@/interfaces/tabs';
import styles from '@/styles/modules/Tabs.module.scss';
import { memo, useState } from 'react';

function TabsMemo({ tabs }: { tabs: Tab[] }) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  const currentTab = tabs.find((t: Tab) => t.id === activeTab) || tabs[0];

  return (
    <div>
      <ul role="tablist" className={styles.tabs}>
        {tabs.map((t: Tab) => (
          <li
            role="tab"
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`${styles.tab} ${activeTab === t.id && styles.tabActive} bold`}>
            {t.text}
          </li>
        ))}
      </ul>

      <div className={styles.tabContent}>
        {currentTab.content()}
      </div>
    </div>
  );
}

const Tabs = memo(TabsMemo);
export default Tabs;
