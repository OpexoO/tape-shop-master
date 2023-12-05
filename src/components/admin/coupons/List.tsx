import Loader from '@/components/Loader';
import adminResourceMap from '@/constants/admin-resources';
import couponType from '@/constants/coupon';
import itemsPerPage from '@/constants/perPage';
import {
  BulkDeleteWithConfirmButton, Button, useUpdate, useUpdateMany,
  CreateButton, Datagrid, DateField, ExportButton, FilterButton, InfiniteList,
  NumberField, TextField, TopToolbar, WithRecord, useListContext, useNotify, useUnselectAll,
} from 'react-admin';
import { Coupon } from '@/interfaces/coupon';
import { MouseEvent } from 'react';
import couponsFilters from './filters';

export default function CouponsList() {
  return (
    <InfiniteList
      actions={<Actions />}
      perPage={itemsPerPage.coupons}
      filters={couponsFilters}
      sort={{ field: 'startDate', order: 'DESC' }}
    >
      <DataList />
    </InfiniteList>
  );
}

function Actions() {
  return (
    <TopToolbar sx={{ minHeight: '60px', display: 'flex', alignItems: 'center' }}>
      <FilterButton />,
      <CreateButton />
      <ExportButton />
    </TopToolbar>
  );
}

function DataList() {
  const { isLoading } = useListContext();
  const notify = useNotify();
  const [update, { isLoading: isUpdating }] = useUpdate();

  const updateRecord = (id: string, isActive: boolean) => {
    update(
      adminResourceMap.coupons,
      { id, data: { isActive } },
      {
        mutationMode: 'undoable',
        onSuccess: () => {
          notify(`Coupon is marked as ${isActive ? 'active' : 'deactivated'}`, {
            type: 'info',
            undoable: true,
          });
        },
        onError: () => {
          notify('Error while updating coupon', { type: 'error' });
        },
      },
    );
  };

  const renderStatus = (record: any) => {
    if (new Date(record.endDate).getTime() < Date.now()) {
      return <span>Expired</span>;
    }

    return <span>{record.isActive ? 'Active' : 'Deactivated'}</span>;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Datagrid
      optimized
      bulkActionButtons={<BulkActionButtons />}
      rowClick="edit"
      sx={{
        '& .RaDatagrid-headerCell': {
          fontWeight: 700,
        },
      }}
    >
      <TextField source="name" sortable={false} />
      <TextField source="type" sortable={false} />
      <WithRecord
        label="Discount"
        render={(record) => <span>{
          record.type === couponType.Flat
            ? `$ ${record.discount}`
            : `${record.discount}%`
        }</span>}
      />
      <DateField label="Start date" source="startDate" />
      <DateField label="End date" source="endDate" />
      <WithRecord
        label="Usage amount per user"
        render={(record) => <span>{record.usageAmount || 'No restrictions'}</span>}
      />
      <NumberField label="Total usage" source="totalUsage" />
      <WithRecord
        label="Status"
        render={renderStatus}
      />
      <WithRecord
        label="Action"
        render={(record: Coupon) => <Button
          label={record.isActive ? 'Deactivate' : 'Activate'}
          disabled={isUpdating}
          onClick={(e: MouseEvent) => {
            e.stopPropagation();
            updateRecord(record.id, !record.isActive);
          }}
        />}
      />
    </Datagrid>
  );
}

function BulkActionButtons() {
  const { selectedIds = [] } = useListContext();
  const notify = useNotify();
  const unselectAll = useUnselectAll(adminResourceMap.coupons);
  const [updateMany, { isLoading }] = useUpdateMany();

  const update = (isActive: boolean) => {
    updateMany(
      adminResourceMap.coupons,
      { ids: selectedIds, data: { isActive } },
      {
        mutationMode: 'undoable',
        onSuccess: () => {
          notify(`All selected coupons are marked as ${isActive ? 'active' : 'deactivated'}`, {
            type: 'info',
            undoable: true,
          });
          unselectAll();
        },
        onError: () => {
          notify('Error while updating coupons', { type: 'error' });
        },
      },
    );
  };

  return (
    <>
      <Button
        label="Mark all as active"
        disabled={isLoading}
        onClick={() => update(true)}
      />
      <Button
        label="Mark all as deactivated"
        disabled={isLoading}
        onClick={() => update(false)}
      />
      <BulkDeleteWithConfirmButton mutationMode="optimistic" />
    </>
  );
}
