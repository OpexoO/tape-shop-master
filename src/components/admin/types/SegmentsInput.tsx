import { Category } from '@/interfaces/category';
import { SelectArrayInput, SelectInputProps, required } from 'react-admin';

export default function SegmentsInput(
  { allCategories = [], ...props }: { allCategories: Category[], props?: SelectInputProps },
) {
  return (
    <SelectArrayInput
      {...props}
      validate={required()}
      source="categories"
      choices={allCategories}
    />
  );
}
