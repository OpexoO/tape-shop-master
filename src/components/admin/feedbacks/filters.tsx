import { DateInput, SelectInput } from 'react-admin';

const feedbackFilters = [
  <SelectInput
    key="reviewed"
    alwaysOn
    source="reviewed"
    choices={[
      { id: 'true', name: 'Reviewed' },
      { id: 'false', name: 'Pending' },
    ]}
  />,
  <DateInput
    label="Posted since"
    alwaysOn
    key="dateGte"
    source="dateGte"
  />,
  <DateInput
    label="Posted before"
    alwaysOn
    key="dateLte"
    source="dateLte"
  />,
];

export default feedbackFilters;
