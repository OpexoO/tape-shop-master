import useTheme from '@mui/material/styles/useTheme';
import { ReturnedOrder } from '@/interfaces/order';
import { Identifier } from 'react-admin';
import returnStatuses from '@/constants/returnStatuses';

const rowStyle = (selectedRow?: Identifier) => (record: ReturnedOrder) => {
  const theme = useTheme();
  let style = {};
  if (!record) {
    return style;
  }
  if (selectedRow && selectedRow === record.id) {
    style = {
      ...style,
      backgroundColor: theme.palette.action.selected,
    };
  }
  if (record.status === returnStatuses.InReturn) {
    return {
      ...style,
      borderLeftColor: '#ff9800',
      borderLeftWidth: 5,
      borderLeftStyle: 'solid',
    };
  }
  if (record.status === returnStatuses.Returned) {
    return {
      ...style,
      borderLeftColor: '#4caf50',
      borderLeftWidth: 5,
      borderLeftStyle: 'solid',
    };
  }
  if (record.status === returnStatuses.Created) {
    return {
      ...style,
      borderLeftColor: '#f44336',
      borderLeftWidth: 5,
      borderLeftStyle: 'solid',
    };
  }
  return style;
};

export default rowStyle;
