import Loader from '@/components/Loader';
import itemsPerPage from '@/constants/perPage';
import { Category } from '@/interfaces/category';
import { Type } from '@/interfaces/type';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import {
  CreateButton, Datagrid, ExportButton, FieldProps, InfiniteList,
  TextField, TopToolbar, useListContext, useRecordContext,
} from 'react-admin';

const Actions = () => (
  <TopToolbar sx={{ minHeight: '60px', display: 'flex', alignItems: 'center' }}>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export default function TypesList() {
  return (
    <InfiniteList
      actions={<Actions />}
      perPage={itemsPerPage.types}
    >
      <DataList />
    </InfiniteList>
  );
}

function DataList() {
  const { isLoading } = useListContext();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Datagrid
      optimized
      rowClick="edit"
      sx={{
        '& .RaDatagrid-headerCell': {
          fontWeight: 700,
        },
      }}
    >
      <TextField label="ID" sortable={false} source="id" />
      <TextField sortable={false} source="name" />
      <SegmentFields sortable={false} source="categories" />
    </Datagrid>
  );
}

// eslint-disable-next-line no-unused-vars
function SegmentFields(_: FieldProps) {
  const record = useRecordContext<Type>();
  if (!record || !record.categories?.length) {
    return null;
  }

  return (
    <Stack direction="row" gap={1} flexWrap="wrap">
      {record.categories.map((c: Category) => (
        <Chip
          key={c._id}
          size="small"
          label={c.name}
        />
      ))}
    </Stack>
  );
}
