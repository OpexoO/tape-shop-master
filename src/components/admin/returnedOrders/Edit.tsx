import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  DateField, DeleteWithConfirmButton, EditBase, EditProps,
  EmailField, Labeled, SaveButton, SimpleForm,
  TextField, Toolbar, useRecordContext,
} from 'react-admin';
import adminResourceMap from '@/constants/admin-resources';
import { ReturnedOrder } from '@/interfaces/order';
import returnStatuses from '@/constants/returnStatuses';

interface Props extends EditProps<ReturnedOrder> {
  onCancel: () => void;
}

export default function ReturnOrderEdit({ onCancel, ...props }: Props) {
  return (
    <EditBase {...props} mutationMode="optimistic" mutationOptions={{ meta: { id: '1' } }} redirect={false}>
      <Box pt={5} width={{ xs: '100vW', sm: 400 }} mt={{ xs: 2, sm: 1 }}>
        <Stack direction="row" p={2}>
          <Typography variant="h6" flex="1">
            Return order details
          </Typography>
          <IconButton onClick={onCancel} size="small">
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </Stack>

        <SimpleForm sx={{ pt: 0 }} toolbar={<EditToolbar onRedirect={onCancel} />}>
          <Grid container rowSpacing={1} mb={1}>
            <Grid item xs={4}>
              <Labeled>
                <DateField source="date" />
              </Labeled>
            </Grid>
            <Grid item xs={4}>
              <Labeled>
                <TextField label="Order id" source="orderId" />
              </Labeled>
            </Grid>
            <Grid item xs={4}>
              <Labeled label="Status">
                <TextField source="status" />
              </Labeled>
            </Grid>
            <Grid item xs={7}>
              <Labeled>
                <EmailField source="user.email" />
              </Labeled>
            </Grid>
            <Grid item xs={5}>
              <Labeled>
                <TextField source="user.name" />
              </Labeled>
            </Grid>
          </Grid>

          <Labeled sx={{ marginBottom: '10px' }}>
            <TextField
              sx={{ wordBreak: 'break-word' }}
              component="div"
              fullWidth
              source="reason" />
          </Labeled>
          <Labeled>
            <TextField
              sx={{ wordBreak: 'break-word' }}
              component="div"
              fullWidth
              source="message" />
          </Labeled>
        </SimpleForm>
      </Box>
    </EditBase>
  );
}

function EditToolbar({ onRedirect }: { onRedirect: CallableFunction }) {
  const record = useRecordContext<ReturnedOrder>();

  if (!record) {
    return null;
  }

  const redirect = (resource: string | undefined = `/${adminResourceMap.returnedOrders}`) => {
    onRedirect();
    return resource;
  };
  const transform = (record: ReturnedOrder, status: string): ReturnedOrder => ({
    ...record,
    status,
  });

  return (
    <Toolbar
      sx={{
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        rowGap: '12px',
        minHeight: { sm: 0 },
        paddingLeft: { sm: '16px' },
      }}
    >
      {record.status !== returnStatuses.Created
        && <SaveButton
          type="button"
          alwaysEnable
          transform={(record: ReturnedOrder) => transform(record, returnStatuses.Created)}
          label={'Mark as Created'}
        />
      }
      {record.status !== returnStatuses.InReturn
        && <SaveButton
          type="button"
          alwaysEnable
          transform={(record: ReturnedOrder) => transform(record, returnStatuses.InReturn)}
          label={'Mark as InReturn'}
        />
      }
      {record.status !== returnStatuses.Returned
        && <SaveButton
          type="button"
          alwaysEnable
          transform={(record: ReturnedOrder) => transform(record, returnStatuses.Returned)}
          label={'Mark as Returned'}
        />
      }
      <DeleteWithConfirmButton redirect={redirect} />
    </Toolbar>
  );
}
