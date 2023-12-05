import { ReactNode } from 'react';

type Props = {
  condition: boolean;
  children: ReactNode;
  wrapper: CallableFunction;
}

const ConditionalWrapper = ({ condition, wrapper, children }: Props) => (
  condition ? wrapper(children) : children
);
export default ConditionalWrapper;
