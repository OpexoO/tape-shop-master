import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {
  BulkDeleteWithConfirmButton, Datagrid, DateField, List, TextField,
} from 'react-admin';
import itemsPerPage from '@/constants/perPage';
import adminResourceMap from '@/constants/admin-resources';
import rowStyle from './rowStyle';
import returnedOrdersFilter from './filter';
import ReturnOrderEdit from './Edit';

export default function ReturnedOrderList() {
  const router = useRouter();
  const [currentId, setCurrentId] = useState<string>('');
  const matchRef = useRef<boolean>(false);

  const handleClose = useCallback(() => {
    router.push(`/admin#/${adminResourceMap.returnedOrders}`);
  }, [router]);

  const handleRowClick = (id: number | string, resource: string): false => {
    router.push(`/admin#/${resource}/${id}`);
    return false;
  };

  useEffect(() => {
    const onHashChanged = (url: string) => {
      matchRef.current = (/\/returned-orders\/.+/g).test(url.split('#')[1]);
      const segments = url.split('/');
      setCurrentId(segments[segments.length - 1]);
    };

    onHashChanged(router.asPath);
    router.events.on('hashChangeComplete', onHashChanged);
    return () => {
      router.events.off('hashChangeComplete', onHashChanged);
    };
  }, []);

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
        filters={returnedOrdersFilter}
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
          <TextField sortable={false} label="Order id (in Starshipit)" source="orderId" />
          <TextField sortable={false} source="user.email" />
          <TextField sortable={false} source="user.name" />
          <TextField sortable={false} source="status" />
        </Datagrid>
      </List>

      <Drawer
        variant="persistent"
        open={matchRef.current}
        anchor="right"
        onClose={handleClose}
        sx={{ zIndex: 100 }}
      >
        {matchRef.current && <ReturnOrderEdit
          id={currentId}
          onCancel={handleClose}
        />}
      </Drawer>
    </Box>
  );
}

function BulkActionButtons() {
  return (
    <BulkDeleteWithConfirmButton mutationMode="optimistic" />
  );
}
