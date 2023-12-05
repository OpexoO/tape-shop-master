import { NewProductItem, Product } from '@/interfaces/product/product';
import Button from '@mui/material/Button';
import {
  DeleteWithConfirmButton, Edit, SaveButton, Toolbar, useRecordContext, useRedirect,
} from 'react-admin';
import { ProductItemAdditional } from '@/interfaces/product/productAdditional';
import adminResourceMap from '@/constants/admin-resources';
import ProductForm from './Form';

export default function ProductEdit() {
  return (
    <Edit title={<EditTitle />}>
      <ProductForm>
        <EditToolbar />
      </ProductForm>
    </Edit>
  );
}

function EditTitle() {
  const record = useRecordContext<Product>();
  return record
    ? <span>Edit product {record.name}</span>
    : null;
}

function EditToolbar(props: any) {
  const redirect = useRedirect();
  const record = useRecordContext<Product>();

  const transform = (record: NewProductItem) => {
    const updated = { ...record };
    if (record.features?.features?.length) {
      updated.features!.features = record.features.features
        .filter((r: Record<string, string>) => r.key && r.value);
    }
    updated.additionalInformation = record.additionalInformation
      ?.filter((i: ProductItemAdditional) => i.caption && i.value);
    updated.characteristics.items = (record.characteristics.items as any[])
      .map(({ field }) => field);
    return updated;
  };

  return (
    <Toolbar {...props} sx={{ display: 'flex', columnGap: '16px' }}>
      <SaveButton type="button" transform={transform} />
      <DeleteWithConfirmButton
        confirmTitle={`Delete product ${record.name}`}
      />
      <Button color="primary" onClick={() => redirect(`/${adminResourceMap.products}`)}>
        Back
      </Button>
    </Toolbar>
  );
}
