import { ReactElement } from 'react';

export interface Tab {
  id: string;
  text: string;
  content: () => ReactElement;
}
