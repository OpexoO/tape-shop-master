import useTheme from '@mui/material/styles/useTheme';
import { FullReview } from '@/interfaces/review';
import { Identifier } from 'react-admin';

const rowStyle = (selectedRow?: Identifier) => (record: FullReview) => {
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
  if (!record.isChecked) {
    return {
      ...style,
      borderLeftColor: '#ff9800',
      borderLeftWidth: 5,
      borderLeftStyle: 'solid',
    };
  }
  if (record.isChecked && record.isApproved) {
    return {
      ...style,
      borderLeftColor: '#4caf50',
      borderLeftWidth: 5,
      borderLeftStyle: 'solid',
    };
  }
  if (record.isChecked && !record.isApproved) {
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
