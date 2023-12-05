import imagesMimeTypes from '@/constants/mimeTypes';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import {
  ArrayInput, ImageField, ImageInput, Labeled,
  NumberInput, RecordContextProvider, ReferenceArrayInput,
  SelectArrayInput, SelectInput, SimpleFormIterator, TabbedForm,
  TextInput, minLength, required, useNotify, useRecordContext,
} from 'react-admin';
import { ReactElement, useEffect, useState } from 'react';
import { Product } from '@/interfaces/product/product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import adminResourceMap from '@/constants/admin-resources';
import { numberOfRoles, tapeWidth } from '@/constants/tapeOptions';

const req: any[] = [required()];
const reqWithMinLength = [...req, minLength(3, 'Should be at least 3 characters')];
const nonZeroValidation = (value: number) => {
  if (value <= 0) {
    return 'Value should be greater than 0';
  }
  return undefined;
};
const MAX_FILE_SIZE = 1000 * 1000;
const MAX_FILES = 8;

export default function ProductForm({ children }: { children: ReactElement }) {
  const [filesLength, setFilesLength] = useState<number>(0);
  const [context, setContext] = useState<any>();
  const record = useRecordContext<Product>();
  const notify = useNotify();

  const fileSizeValidation = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      notify('File size should not exceed 1MB', { type: 'error' });
      return {
        code: 'size-too-large',
        message: 'File size should not exceed 1MB',
      };
    }

    return null;
  };

  const fileSizeWithLengthValidation = (file: File) => {
    const sizeValidation = fileSizeValidation(file);
    if (sizeValidation) {
      return sizeValidation;
    }
    if (filesLength === MAX_FILES) {
      notify('Maximum files amount is 8', { type: 'error' });
      return {
        code: 'length-too-large',
        message: 'Maximum files amount is 8',
      };
    }

    setFilesLength((state: number) => state + 1);
    return null;
  };

  useEffect(() => {
    if (!record) return;
    setFilesLength(record.images.length);
    setContext({
      ...record,
      images: typeof record.images[0] === 'string'
        ? record.images.map((src: string) => ({ id: src, src }))
        : record.images,
      productType: typeof record?.productType === 'string'
        ? record.productType
        : record?.productType[0]._id,
      features: record.features
        ? { ...record.features, image: { id: record.features.image, src: record.features.image } }
        : record.features,
    });
  }, [record]);

  return (
    <RecordContextProvider value={context || record}>
      <TabbedForm
        sanitizeEmptyValues
        warnWhenUnsavedChanges
        toolbar={children}
      >
        <TabbedForm.Tab label="Main info">
          <Grid container columnSpacing={2}>
            <Grid item xs={12} sm={6}>
              <TextInput source="name" fullWidth validate={reqWithMinLength} />
            </Grid>
            <Grid item xs={0} sm={6} />
            <Grid item xs={12} sm={3}>
              <TextInput source="sku" fullWidth validate={reqWithMinLength} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <NumberInput
                source="price"
                validate={req.concat(nonZeroValidation)}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <NumberInput
                label="Weight, g"
                source="weight"
                validate={req.concat(nonZeroValidation)}
                fullWidth
              />
            </Grid>
            <Grid
              item xs={12} sm={3}
              sx={{ display: 'flex', alignItems: 'center', columnGap: '8px' }}
            >
              <NumberInput
                source="availability"
                fullWidth
              />
              <Tooltip
                title="Put 0 if there is no products in stock, leave input without any number to
                indicate no information for availability"
              >
                <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faCircleInfo} />
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextInput
                source="description"
                validate={reqWithMinLength}
                multiline
                rows={5}
                fullWidth
              />
            </Grid>
          </Grid>
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Images" path="images">
          <ImageInput
            validate={req}
            maxSize={MAX_FILE_SIZE}
            validateFileRemoval={() => {
              setFilesLength((state: number) => state - 1);
              return true;
            }}
            options={{ maxFiles: MAX_FILES, validator: fileSizeWithLengthValidation }}
            source="images"
            accept={imagesMimeTypes.join(',')}
            multiple
          >
            <ImageField
              source="src"
              sx={{ '& .RaImageField-image': { width: '240px', height: 'auto', aspectRatio: 1 } }}
            />
          </ImageInput>
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Characteristics" path="characteristics">
          <Grid container rowSpacing={2}>
            <Grid item xs={12} sm={5}>
              <TextInput fullWidth source="characteristics.phrase" defaultValue={''} />
            </Grid>
            <Grid item xs={0} sm={5} />
            <Grid item xs={12} sm={7}>
              <ArrayInput fullWidth validate={req} source="characteristics.items">
                <SimpleFormIterator fullWidth inline>
                  <TextInput validate={req} source="field" fullWidth />
                </SimpleFormIterator>
              </ArrayInput>
            </Grid>
          </Grid>
        </TabbedForm.Tab>
        <TabbedForm.Tab label="References" path="references">
          <ReferenceArrayInput validate={req} source="categories" reference={adminResourceMap.categories}>
            <SelectArrayInput validate={req} />
          </ReferenceArrayInput>
          <ReferenceArrayInput validate={req} source="productType" reference={adminResourceMap.types}>
            <SelectInput optionValue="_id" optionText="name" validate={req} />
          </ReferenceArrayInput>
          <ReferenceArrayInput
            source="related"
            reference={adminResourceMap.products}
            filter={record ? { excludeOne: record._id } : undefined}
          >
            <SelectArrayInput />
          </ReferenceArrayInput>
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Additional information" path="additional-info">
          <Labeled fullWidth label="Demo">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <TextInput label="Video id" source="demo.video" fullWidth />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextInput source="demo.description" fullWidth />
              </Grid>
            </Grid>
          </Labeled>

          <ArrayInput sx={{ mb: '16px' }} fullWidth source="additionalInformation">
            <SimpleFormIterator fullWidth inline>
              <TextInput source="caption" />
              <TextInput source="value" />
            </SimpleFormIterator>
          </ArrayInput>

          <Labeled label="Features">
            <>
              <ImageInput
                source="features.image"
                maxSize={MAX_FILE_SIZE}
                options={{ validator: fileSizeValidation }}
                accept={imagesMimeTypes.join(',')}
              >
                <ImageField
                  source="src"
                  sx={{ '& .RaImageField-image': { width: '240px', height: 'auto', aspectRatio: 1 } }}
                />
              </ImageInput>
              <ArrayInput fullWidth source="features.features" defaultValue={[]}>
                <SimpleFormIterator fullWidth inline>
                  <TextInput source="key" />
                  <TextInput source="value" />
                </SimpleFormIterator>
              </ArrayInput>
            </>
          </Labeled>
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Options">
          <ArrayInput fullWidth source="options" defaultValue={[]}>
            <SimpleFormIterator fullWidth inline>
              <SelectInput source="width" choices={tapeWidth} validate={req} />
              <SelectInput source="role" choices={numberOfRoles} validate={req} />
              <NumberInput
                source="price"
                validate={req.concat(nonZeroValidation)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </SimpleFormIterator>
          </ArrayInput>
        </TabbedForm.Tab>
      </TabbedForm>
    </RecordContextProvider>
  );
}
