import { Create, SaveButton, Toolbar, useRedirect } from 'react-admin';
import Button from '@mui/material/Button';
import adminResourceMap from '@/constants/admin-resources';
import { useCallback, useState } from 'react';
import { User } from '@/interfaces/user';
import { Coupon } from '@/interfaces/coupon';
import CouponForm from './Form';

export default function CouponsCreate() {
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
    <Create>
      <CouponForm
        onApplyProducts={applyProducts}
        onApplyUser={applyUsers}
      >
        <CreateToolbar transform={transform} />
      </CouponForm>
    </Create>
  );
}

function CreateToolbar(props: any) {
  const { transform, ...rest } = props;
  const redirect = useRedirect();

  return (
    <Toolbar {...rest} sx={{ display: 'flex', columnGap: '16px' }}>
      <SaveButton type="button" transform={transform} />
      <Button color="primary" onClick={() => redirect(`/${adminResourceMap.coupons}`)}>
        Back
      </Button>
    </Toolbar>
  );
}
