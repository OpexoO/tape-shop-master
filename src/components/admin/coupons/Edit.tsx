import adminResourceMap from '@/constants/admin-resources';
import { Coupon } from '@/interfaces/coupon';
import Button from '@mui/material/Button';
import {
  DeleteWithConfirmButton, Edit, SaveButton,
  Toolbar, TransformData, useRecordContext, useRedirect,
} from 'react-admin';
import { useCallback, useState } from 'react';
import { User } from '@/interfaces/user';
import CouponForm from './Form';

export default function CouponsEdit() {
  const [appliedProducts, setAppliedProducts] = useState<string[]>();
  const [appliedUsers, setAppliedUsers] = useState<User[]>();

  const applyProducts = useCallback(
    (v: string[]) => setAppliedProducts(v),
    [],
  );
  const applyUsers = useCallback(
    (v: User[]) => setAppliedUsers(v),
    [],
  );

  const transform = (coupon: Coupon) => {
    const newCoupon = { ...coupon };
    newCoupon.appliedProducts = appliedProducts || [];
    newCoupon.userIds = appliedUsers || [];
    return newCoupon;
  };

  return (
    <Edit mutationOptions={{ meta: { edit: true } }} title={<EditTitle />}>
      <CouponForm
        onApplyProducts={applyProducts}
        onApplyUser={applyUsers}
      >
        <EditToolbar transform={transform} />
      </CouponForm>
    </Edit>
  );
}

function EditTitle() {
  const record = useRecordContext<Coupon>();
  return (
    <span>Edit coupon {record?.name}</span>
  );
}

function EditToolbar({ transform }: { transform: TransformData }) {
  const record = useRecordContext<Coupon>();
  const redirect = useRedirect();

  return (
    <Toolbar sx={{ display: 'flex', columnGap: '16px' }}>
      <SaveButton type="button" alwaysEnable transform={transform} />
      <DeleteWithConfirmButton
        confirmTitle={`Delete coupon ${record.name}`}
      />
      <Button color="primary" onClick={() => redirect(`/${adminResourceMap.coupons}`)}>
        Back
      </Button>
    </Toolbar>
  );
}
