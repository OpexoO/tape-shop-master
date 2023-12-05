import Loader from '@/components/Loader';
import itemsPerPage from '@/constants/perPage';
import { Category } from '@/interfaces/category';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
  CreateButton, EditButton, ExportButton, InfiniteList, RecordContextProvider, TopToolbar, useListContext,
} from 'react-admin';
import LinkToRelatedProducts from './LinkToRelatedProducts';

const Actions = () => (
  <TopToolbar sx={{ minHeight: '60px', display: 'flex', alignItems: 'center' }}>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export default function CategoiresList() {
  return (
    <InfiniteList
      actions={<Actions />}
      sort={{ field: 'name', order: 'ASC' }}
      perPage={itemsPerPage.categories}
    >
      <DataList />
    </InfiniteList>
  );
}

function DataList() {
  const { data, isLoading } = useListContext();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Grid container spacing={2} sx={{ marginTop: '1em' }}>
      {data.map((record: Category) => (
        <RecordContextProvider key={record._id} value={record}>
          <Grid
            key={record._id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            item
          >
            <Card sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '1px solid #dddddd',
            }}>
              <CardMedia
                image={(record.imageUrl as any).src || record.imageUrl}
                sx={{ height: 220, aspectRatio: 1, width: 'auto' }}
              />
              <CardContent sx={{ paddingBottom: '0.5em' }}>
                <Typography
                  variant="h5"
                  component="h2"
                  align="center"
                >
                  {record.name}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  columnGap: '16px',
                }}
              >
                <LinkToRelatedProducts />
                <EditButton />
              </CardActions>
            </Card>
          </Grid>
        </RecordContextProvider>
      ))}
    </Grid>
  );
}
