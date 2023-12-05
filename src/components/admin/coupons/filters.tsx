import adminResourceMap from '@/constants/admin-resources';
import couponType from '@/constants/coupon';
import { capitalize } from '@/utils/helpers';
import {
  DateInput, NumberInput, ReferenceInput, SearchInput, SelectArrayInput, SelectInput,
} from 'react-admin';

const couponsFilters = [
  <SearchInput
    key="name"
    source="name"
    alwaysOn
  />,
  <SelectInput
    key="type"
    source="type"
    alwaysOn
    choices={[
      { id: couponType.Flat, name: capitalize(couponType.Flat) },
      { id: couponType.Percentage, name: capitalize(couponType.Percentage) },
    ]}
  />,
  <DateInput
    key="dateGte"
    source="dateGte"
    label="Start date since"
  />,
  <DateInput
    key="dateLte"
    source="dateLte"
    label="End date before"
  />,
  <SelectInput
    key="isActive"
    source="isActive"
    label="Active"
    choices={[
      { id: 'true', name: 'Active' },
      { id: 'false', name: 'Deactivated' },
    ]}
  />,
  <ReferenceInput key="appliedProducts" source="appliedProducts" reference={adminResourceMap.products}>
    <SelectArrayInput optionText="name" />
  </ReferenceInput>,
  <NumberInput
    key="priceGte"
    source="priceGte"
    label="Discount from"
  />,
  <NumberInput
    key="priceLte"
    source="priceLte"
    label="Discount to"
  />,
];

export default couponsFilters;
