import Loader from '@/components/Loader';
import { Type } from '@/interfaces/type';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import {
  DeleteWithConfirmButton, Edit, SaveButton, SimpleForm, TextInput,
  Toolbar, required, useRecordContext, useRedirect,
} from 'react-admin';
import { Category } from '@/interfaces/category';
import LinkService from '@/services/link.service';
import SegmentsInput from './SegmentsInput';

export default function TypesEdit() {
  const [allCategories, setAllCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(LinkService.apiCategoriesLink())
      .then(async (res: Response) => {
        const { data } = await res.json();
        if (!res.ok) {
          throw new Error(data);
        }
        setAllCategories(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  const transform = (data: any) => ({
    ...data,
    categories: data.categories.map((id: string) => allCategories.find((c: Category) => c._id === id)),
  });

  return (
    <Edit title={<EditTitle />}>
      <SimpleForm toolbar={<EditToolbar transform={transform} />} warnWhenUnsavedChanges>
        <TextInput source="name" validate={required()} />
        <SegmentsInput allCategories={allCategories} />
      </SimpleForm>
    </Edit>
  );
}

function EditTitle() {
  const record = useRecordContext<Type>();
  return (
    <span>Edit type {record?.name}</span>
  );
}

function EditToolbar(props: any) {
  const { transform, ...others } = props;
  const record = useRecordContext<Type>();
  const redirect = useRedirect();

  return (
    <Toolbar {...others} sx={{ display: 'flex', columnGap: '16px' }}>
      <SaveButton type="button" transform={transform} />
      <DeleteWithConfirmButton
        confirmTitle={`Delete type ${record.name}`}
      />
      <Button color="primary" onClick={() => redirect('/types')}>Back</Button>
    </Toolbar>
  );
}
