import imagesMimeTypes from '@/constants/mimeTypes';
import { Category } from '@/interfaces/category';
import Button from '@mui/material/Button';
import {
  DeleteWithConfirmButton, Edit, ImageField, ImageInput,
  SaveButton, SimpleForm, TextInput, Toolbar, required, useRecordContext, useRedirect,
} from 'react-admin';

export default function CategoryEdit() {
  return (
    <Edit title={<EditTitle />}>
      <SimpleForm toolbar={<EditToolbar />} warnWhenUnsavedChanges>
        <TextInput source="name" validate={required()} />

        <ImageInput
          validate={required()}
          source="imageUrl"
          accept={imagesMimeTypes.join(',')}
          sx={{ '& .RaFileInput-dropZone': { textAlign: 'left' } }}
        >
          <ImageField
            source="src"
            sx={{ '& .RaImageField-image': { width: '240px', height: 'auto', aspectRatio: 1 } }}
          />
        </ImageInput>
      </SimpleForm>
    </Edit>
  );
}

function EditTitle() {
  const record = useRecordContext<Category>();
  return (
    <span>Edit category {record?.name}</span>
  );
}

function EditToolbar(props: any) {
  const record = useRecordContext<Category>();
  const redirect = useRedirect();

  return (
    <Toolbar {...props} sx={{ display: 'flex', columnGap: '16px' }}>
      <SaveButton />
      <DeleteWithConfirmButton
        confirmTitle={`Delete category ${record.name}`}
      />
      <Button color="primary" onClick={() => redirect('/categories')}>Back</Button>
    </Toolbar>
  );
}
