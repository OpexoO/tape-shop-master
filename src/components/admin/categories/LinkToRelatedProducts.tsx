import { Category } from '@/interfaces/category';
import { faImages } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@mui/material/Button';
import { useRecordContext, useRedirect } from 'react-admin';
import adminResourceMap from '@/constants/admin-resources';

export default function LinkToRelatedProducts() {
  const record = useRecordContext<Category>();
  const redirect = useRedirect();

  if (!record) {
    return null;
  }

  const redirectToProducts = () => {
    const query = new URLSearchParams({
      filter: JSON.stringify({ categories: [record._id] }),
    });
    redirect(`/${adminResourceMap.products}?${query}`);
  };

  return (
    <Button
      size="small"
      color="primary"
      sx={{ display: 'flex', alignItems: 'center', columnGap: '8px' }}
      onClick={redirectToProducts}
    >
      <FontAwesomeIcon icon={faImages} />
      Products
    </Button>
  );
}
