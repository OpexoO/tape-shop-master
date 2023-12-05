import { DateInput, ReferenceInput, SelectArrayInput, SelectInput } from 'react-admin';
import adminResourceMap from '@/constants/admin-resources';

const reviewFilters = [
  <SelectInput
    key="reviewed"
    alwaysOn
    source="reviewed"
    choices={[
      { id: 'true', name: 'Checked' },
      { id: 'false', name: 'Pending' },
    ]}
  />,
  <SelectInput
    key="approved"
    alwaysOn
    source="approved"
    choices={[
      { id: 'true', name: 'Approved' },
      { id: 'false', name: 'Not approved' },
    ]}
  />,
  <SelectArrayInput
    key="rating"
    source="rating"
    choices={[
      { id: 1, name: 1 },
      { id: 2, name: 2 },
      { id: 3, name: 3 },
      { id: 4, name: 4 },
      { id: 5, name: 5 },
    ]}
  />,
  <ReferenceInput key="productId" source="productId" reference={adminResourceMap.products}>
    <SelectInput optionText="name" />
  </ReferenceInput>,
  <DateInput
    label="Posted since"
    key="dateGte"
    source="dateGte"
  />,
  <DateInput
    label="Posted before"
    key="dateLte"
    source="dateLte"
  />,
];

export default reviewFilters;
