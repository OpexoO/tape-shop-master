import returnStatuses from '@/constants/returnStatuses';
import { DateInput, SelectInput } from 'react-admin';

const returnedOrdersFilter = [
  <SelectInput
    key="status"
    alwaysOn
    source="status"
    choices={[
      { id: returnStatuses.Created, name: returnStatuses.Created },
      { id: returnStatuses.InReturn, name: returnStatuses.InReturn },
      { id: returnStatuses.Returned, name: returnStatuses.Returned },
    ]}
  />,
  <DateInput
    label="Creted since"
    alwaysOn
    key="dateGte"
    source="dateGte"
  />,
  <DateInput
    label="Created before"
    alwaysOn
    key="dateLte"
    source="dateLte"
  />,
];

export default returnedOrdersFilter;
