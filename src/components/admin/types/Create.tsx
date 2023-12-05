import Button from '@mui/material/Button';
import { Create, SaveButton, SimpleForm, TextInput, Toolbar, required, useRedirect } from 'react-admin';
import Loader from '@/components/Loader';
import { useEffect, useState } from 'react';
import LinkService from '@/services/link.service';
import SegmentsInput from './SegmentsInput';

export default function TypesCreate() {
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

  return (
    <Create>
      <SimpleForm toolbar={<EditToolbar />} warnWhenUnsavedChanges>
        <TextInput
          autoFocus
          source="name"
          validate={required()}
        />
        <SegmentsInput allCategories={allCategories} />
      </SimpleForm>
    </Create>
  );
}

function EditToolbar(props: any) {
  const redirect = useRedirect();

  return (
    <Toolbar {...props} sx={{ display: 'flex', columnGap: '16px' }}>
      <SaveButton />
      <Button color="primary" onClick={() => redirect('/types')}>Back</Button>
    </Toolbar>
  );
}
