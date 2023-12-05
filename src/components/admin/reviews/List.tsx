import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {
  BulkDeleteWithConfirmButton, Button, Datagrid, DateField, List,
  TextField, WithRecord, useGetList, useListContext, useNotify,
  useUnselectAll, useUpdateMany,
} from 'react-admin';
import itemsPerPage from '@/constants/perPage';
import Rate from '@/components/Rate';
import { isBoolean } from '@/utils/validTypes';
import { Product } from '@/interfaces/product/product';
import Loader from '@/components/Loader';
import adminResourceMap from '@/constants/admin-resources';
import rowStyle from './rowStyle';
import reviewFilters from './filters';
import ReviewEdit from './Edit';

export default function ReivewsList() {
  const router = useRouter();
  const [currentId, setCurrentId] = useState<string>('');
  const matchRef = useRef<boolean>(false);
  const { data: products } = useGetList<Product>(adminResourceMap.products, {
    pagination: { page: 1, perPage: 100 },
  });

  const handleClose = useCallback(() => {
    router.push(`/admin#/${adminResourceMap.reviews}`);
  }, [router]);

  const handleRowClick = (id: number | string, resource: string): false => {
    router.push(`/admin#/${resource}/${id}`);
    return false;
  };

  useEffect(() => {
    const onHashChanged = (url: string) => {
      matchRef.current = (/\/reviews\/.+/g).test(url.split('#')[1]);
      const segments = url.split('/');
      setCurrentId(segments[segments.length - 1]);
    };

    onHashChanged(router.asPath);
    router.events.on('hashChangeComplete', onHashChanged);
    return () => {
      router.events.off('hashChangeComplete', onHashChanged);
    };
  }, []);

  if (!products) {
    return <Loader />;
  }

  const currentProduct = (productId: string) => products?.find((p: Product) => p._id === productId)!;

  return (
    <Box display="flex">
      <List
        sx={{
          flexGrow: 1,
          marginRight: matchRef.current ? '400px' : 0,
          transition: (theme: any) => theme.transitions.create(['all'], {
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
        perPage={itemsPerPage.feedbacks}
        filters={reviewFilters}
        sort={{ field: 'date', order: 'DESC' }}
      >
        <Datagrid
          optimized
          rowClick={handleRowClick}
          rowStyle={rowStyle(matchRef.current ? currentId : undefined)}
          bulkActionButtons={<BulkActionButtons />}
          sx={{
            '& .RaDatagrid-headerCell': {
              fontWeight: 700,
            },
            '& .RaDatagrid-thead': {
              borderLeftColor: 'transparent',
              borderLeftWidth: 5,
              borderLeftStyle: 'solid',
            },
            '& .column-message': {
              minWidth: '14em',
              maxWidth: '22em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
          }}
        >
          <DateField source="date" />
          <TextField sortable={false} source="email" />
          <TextField sortable={false} source="name" />
          <TextField sortable={false} source="text" />
          <WithRecord
            label="Product"
            render={(record) => <span>{currentProduct(record.productId)?.name}</span>}
          />
          <WithRecord
            label="Rating"
            render={(record) => <Rate isStatic={true} max={5} rating={record.rating} />}
          />
          <WithRecord
            label="Status"
            render={(record) => <>
              {record.isChecked && <span>{record.isApproved ? 'Approved' : 'Not approved'}</span>}
              {!record.isChecked && <span>Pending</span>}
            </>}
          />
        </Datagrid>
      </List>

      <Drawer
        variant="persistent"
        open={matchRef.current}
        anchor="right"
        onClose={handleClose}
        sx={{ zIndex: 100 }}
      >
        {matchRef.current && <ReviewEdit
          id={currentId}
          onCancel={handleClose}
          products={products}
        />}
      </Drawer>
    </Box>
  );
}

function BulkActionButtons() {
  const { selectedIds = [] } = useListContext();
  const notify = useNotify();
  const unselectAll = useUnselectAll(adminResourceMap.reviews);
  const [updateMany, { isLoading }] = useUpdateMany();

  const update = (isChecked: boolean | null, isApproved: boolean | null) => {
    const data: any = {};
    if (isBoolean(isChecked)) {
      data.isChecked = isChecked;
    }
    if (isBoolean(isApproved)) {
      data.isApproved = isApproved;
    }

    updateMany(
      adminResourceMap.reviews,
      { ids: selectedIds, data },
      {
        mutationMode: 'undoable',
        onSuccess: () => {
          notify('All reviews are updated', {
            type: 'info',
            undoable: true,
          });
          unselectAll();
        },
        onError: () => {
          notify('Error while updating reviews', { type: 'error' });
          unselectAll();
        },
      },
    );
  };

  return (
    <>
      <Button
        label="Mark all as checked"
        onClick={() => update(true, null)}
        disabled={isLoading}
      />
      <Button
        label="Mark all as unchecked"
        onClick={() => update(false, null)}
        disabled={isLoading}
      />
      <Button
        label="Mark all as approved"
        onClick={() => update(null, true)}
        disabled={isLoading}
      />
      <Button
        label="Mark all as not approved"
        onClick={() => update(null, false)}
        disabled={isLoading}
      />
      <BulkDeleteWithConfirmButton mutationMode="optimistic" />
    </>
  );
}
