import { ContactFeedback } from '@/interfaces/contactFeedback';
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
  TextField, Toolbar, WithRecord, useRecordContext,
} from 'react-admin';
import adminResourceMap from '@/constants/admin-resources';

interface Props extends EditProps<ContactFeedback> {
  onCancel: () => void;
}

export default function FeedbackEdit({ onCancel, ...props }: Props) {
  return (
    <EditBase {...props} mutationMode="optimistic" redirect={false}>
      <Box pt={5} width={{ xs: '100vW', sm: 400 }} mt={{ xs: 2, sm: 1 }}>
        <Stack direction="row" p={2}>
          <Typography variant="h6" flex="1">
            Feedback details
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
                  render={({ reviewed }: ContactFeedback) => <span>{reviewed ? 'Reviewed' : 'Pending'}</span>}
                />
              </Labeled>
            </Grid>
          </Grid>

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
  const record = useRecordContext<ContactFeedback>();

  if (!record) {
    return null;
  }

  const redirect = (resource: string | undefined = `/${adminResourceMap.feedback}`) => {
    onRedirect();
    return resource;
  };
  const transform = (record: ContactFeedback): ContactFeedback => ({
    ...record,
    reviewed: !record.reviewed,
  });

  return (
    <Toolbar
      sx={{
        backgroundColor: 'background.paper',
        display: 'flex',
        columnGap: '16px',
        minHeight: { sm: 0 },
        paddingLeft: { sm: '16px' },
      }}
    >
      <SaveButton
        type="button"
        alwaysEnable
        transform={transform}
        label={`Mark as ${record.reviewed ? 'pending' : 'reviewed'}`}
      />
      <DeleteWithConfirmButton redirect={redirect} />
    </Toolbar>
  );
}
