import useTheme from '@mui/material/styles/useTheme';
import { Identifier } from 'react-admin';
import { ContactFeedback } from '@/interfaces/contactFeedback';

const rowStyle = (selectedRow?: Identifier) => (record: ContactFeedback) => {
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
  if (record.reviewed) {
    return {
      ...style,
      borderLeftColor: '#4caf50',
      borderLeftWidth: 5,
      borderLeftStyle: 'solid',
    };
  }
  if (!record.reviewed) {
    return {
      ...style,
      borderLeftColor: '#ff9800',
      borderLeftWidth: 5,
      borderLeftStyle: 'solid',
    };
  }
  return style;
};

export default rowStyle;
