import { FullReview } from '@/interfaces/review';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {
  DateField,
  DeleteWithConfirmButton, EditBase, EditProps, EmailField, Labeled, SaveButton,
  SimpleForm, TextField, Toolbar, WithRecord, useRecordContext, useRedirect,
} from 'react-admin';
import { isBoolean } from '@/utils/validTypes';
import Rate from '@/components/Rate';
import { Product } from '@/interfaces/product/product';
import adminResourceMap from '@/constants/admin-resources';

interface Props extends EditProps<FullReview> {
  onCancel: () => void;
  products: Product[];
}

export default function ReviewEdit({ onCancel, products, ...props }: Props) {
  const redirect = useRedirect();

  const renderProductButton = (record: FullReview) => {
    const { id, name } = products.find((p: Product) => p._id === record.productId)!;
    return (
      <Button
        sx={{ textTransform: 'initial', padding: 0, textAlign: 'left' }}
        type="button"
        color="primary"
        onClick={() => redirect(`/${adminResourceMap.products}/${id}`)}
      >
        {name}
      </Button>
    );
  };
  return (
    <EditBase {...props} mutationMode="optimistic" redirect={false}>
      <Box pt={5} width={{ xs: '100vW', sm: 400 }} mt={{ xs: 2, sm: 1 }}>
        <Stack direction="row" p={2}>
          <Typography variant="h6" flex="1">
            Review details
          </Typography>
          <IconButton onClick={onCancel} size="small">
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </Stack>

        <SimpleForm sx={{ pt: 0 }} toolbar={<EditToolbar onRedirect={onCancel} />}>
          <Grid container rowSpacing={1} mb={1}>
            <Grid item xs={8}>
              <Labeled>
                <EmailField source="email" />
              </Labeled>
            </Grid>
            <Grid item xs={4}>
              <Labeled>
                <DateField source="date" />
              </Labeled>
            </Grid>
            <Grid item xs={8}>
              <Labeled>
                <TextField source="name" />
              </Labeled>
            </Grid>
            <Grid item xs={4}>
              <Labeled label="Status">
                <WithRecord
                  render={({ isChecked, isApproved }: FullReview) => (
                    <span>
                      {isChecked ? 'Reviewed' : 'Pending'} and {isApproved ? 'approved' : 'not approved'}
                    </span>
                  )}
                />
              </Labeled>
            </Grid>
            <Grid item xs={8}>
              <Labeled label="Product">
                <WithRecord render={renderProductButton} />
              </Labeled>
            </Grid>
            <Grid item xs={4}>
              <Labeled label="Rating">
                <WithRecord
                  render={({ rating }: FullReview) => <Rate isStatic={true} rating={rating} />}
                />
              </Labeled>
            </Grid>
          </Grid>

          <Labeled>
            <TextField
              sx={{ wordBreak: 'break-word' }}
              component="div"
              fullWidth
              source="text" />
          </Labeled>
        </SimpleForm>
      </Box>
    </EditBase>
  );
}

function EditToolbar({ onRedirect }: { onRedirect: CallableFunction }) {
  const record = useRecordContext<FullReview>();

  if (!record) {
    return null;
  }

  const redirect = (resource: string | undefined = `/${adminResourceMap.reviews}`) => {
    onRedirect();
    return resource;
  };
  const transform = (
    record: FullReview,
    isChecked: boolean | null,
    isApproved: boolean | null,
  ): FullReview => {
    const obj: any = {};
    if (isBoolean(isChecked)) {
      obj.isChecked = isChecked;
    }
    if (isBoolean(isApproved)) {
      obj.isApproved = isApproved;
    }
    return {
      ...record,
      ...obj,
    };
  };

  return (
    <Toolbar
      sx={{
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        rowGap: '10px',
        minHeight: { sm: 0 },
        paddingLeft: { sm: '16px' },
      }}
    >
      <SaveButton
        type="button"
        alwaysEnable
        transform={(record: FullReview) => transform(record, !record.isChecked, null)}
        label={`Mark as ${record.isChecked ? 'pending' : 'reviewed'}`}
      />
      <SaveButton
        type="button"
        alwaysEnable
        transform={(record: FullReview) => transform(record, null, !record.isApproved)}
        label={`Mark as ${record.isApproved ? 'not approved' : 'approved'}`}
      />
      <DeleteWithConfirmButton redirect={redirect} />
    </Toolbar>
  );
}
