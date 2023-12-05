import itemsPerPage from '@/constants/perPage';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BulkDeleteWithConfirmButton, Button, Datagrid,
  DateField, List, TextField, WithRecord, useListContext, useNotify, useUnselectAll, useUpdateMany,
} from 'react-admin';
import { useRouter } from 'next/router';
import adminResourceMap from '@/constants/admin-resources';
import rowStyle from './rowStyle';
import FeedbackEdit from './Edit';
import feedbackFilters from './filters';

export default function FeedbacksList() {
  const router = useRouter();
  const [currentId, setCurrentId] = useState<string>('');
  const matchRef = useRef<boolean>(false);

  const handleClose = useCallback(() => {
    router.push(`/admin#/${adminResourceMap.feedback}`);
  }, [router]);

  const handleRowClick = (id: number | string, resource: string): false => {
    router.push(`/admin#/${resource}/${id}`);
    return false;
  };

  useEffect(() => {
    const onHashChanged = (url: string) => {
      matchRef.current = (/\/contact-feedback\/.+/g).test(url.split('#')[1]);
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
        filters={feedbackFilters}
        sort={{ field: 'date', order: 'DESC' }}
      >
        <Datagrid
          bulkActionButtons={<BulkActionButtons />}
          rowClick={handleRowClick}
          optimized
          rowStyle={rowStyle(matchRef.current ? currentId : undefined)}
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
          <TextField sortable={false} source="message" />
          <WithRecord
            label="Status"
            render={(record) => <span>{record.reviewed ? 'Reviewed' : 'Pending'}</span>}
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
        {matchRef.current && <FeedbackEdit id={currentId} onCancel={handleClose} />}
      </Drawer>
    </Box>
  );
}

function BulkActionButtons() {
  const { selectedIds = [] } = useListContext();
  const notify = useNotify();
  const unselectAll = useUnselectAll(adminResourceMap.feedback);
  const [updateMany, { isLoading }] = useUpdateMany();

  const update = (reviewed: boolean) => {
    updateMany(
      adminResourceMap.feedback,
      { ids: selectedIds, data: { reviewed } },
      {
        mutationMode: 'undoable',
        onSuccess: () => {
          notify(`All feedbacks are marked as ${reviewed ? 'reviewed' : 'pending'}`, {
            type: 'info',
            undoable: true,
          });
          unselectAll();
        },
        onError: () => {
          notify('Error while updating feedbacks', { type: 'error' });
        },
      },
    );
  };

  return (
    <>
      <Button
        label="Mark all as reviewed"
        onClick={() => update(true)}
        disabled={isLoading}
      />
      <Button
        label="Mark all as pending"
        onClick={() => update(false)}
        disabled={isLoading}
      />
      <BulkDeleteWithConfirmButton mutationMode="optimistic" />
    </>
  );
}
