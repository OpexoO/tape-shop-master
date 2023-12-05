import Button from '@mui/material/Button';
import {
  Create, ImageField, ImageInput, SaveButton, SimpleForm, TextInput, Toolbar, required, useRedirect,
} from 'react-admin';
import imagesMimeTypes from '@/constants/mimeTypes';

export default function CategoryCreate() {
  return (
    <Create>
      <SimpleForm toolbar={<EditToolbar />} warnWhenUnsavedChanges>
        <TextInput
          autoFocus
          source="name"
          validate={required()}
        />

        <ImageInput
          validate={required()}
          source="image"
          sx={{ '& .RaFileInput-dropZone': { textAlign: 'left' } }}
          accept={imagesMimeTypes.join(',')}
        >
          <ImageField
            source="src"
            sx={{ '& .RaImageField-image': { width: '240px', height: 'auto', aspectRatio: 1 } }}
          />
        </ImageInput>
      </SimpleForm>
    </Create>
  );
}

function EditToolbar(props: any) {
  const redirect = useRedirect();

  return (
    <Toolbar {...props} sx={{ display: 'flex', columnGap: '16px' }}>
      <SaveButton />
      <Button color="primary" onClick={() => redirect('/categories')}>Back</Button>
    </Toolbar>
  );
}
