import Select, { SingleValue } from 'react-select';
import styles from '@/styles/modules/Sorting.module.scss';
import { useEffect, useState } from 'react';
import { ProductItemPreview } from '@/interfaces/product/product';
import LocalStorageService from '@/services/storage.service';
import storageKeys from '@/constants/storageKeys';
import { options, Option, SortingOptions, DEFAULT_OPTION } from './options';

export default function ProductsSorting(
  { value, onChange }: { value: ProductItemPreview[], onChange: CallableFunction },
) {
  const [currentOption, setCurrentOption] = useState<Option>(DEFAULT_OPTION);

  const selectStyles = {
    control: (styles: any) => ({ ...styles, width: '250px', cursor: 'pointer' }),
    option: (styles: any) => ({ ...styles, cursor: 'pointer' }),
  };

  const selectChange = (selected: SingleValue<Option>) => {
    const optionValue: SortingOptions = selected?.value || SortingOptions.Price;
    const option = options.find((o: Option) => o.value === optionValue)!;
    LocalStorageService.set<Option>(storageKeys.Sorting, option);
    setCurrentOption(option);
    onChange(sort(value, optionValue));
  };

  useEffect(() => {
    selectChange(LocalStorageService.get<Option>(storageKeys.Sorting) || DEFAULT_OPTION);
  }, []);

  return (
    <div className={styles.sortingContainer}>
      <Select
        instanceId="sort"
        name="sort"
        isSearchable={false}
        value={currentOption}
        options={options}
        styles={selectStyles}
        onChange={selectChange} />
    </div>
  );
}

function sort(array: ProductItemPreview[], option: SortingOptions) {
  const getDateTime = (date: string) => new Date(date).getTime();

  switch (option) {
    case SortingOptions.Price:
      return array.sort((a: ProductItemPreview, b: ProductItemPreview) => a.price - b.price);
    case SortingOptions.PriceDesc:
      return array.sort((a: ProductItemPreview, b: ProductItemPreview) => b.price - a.price);
    case SortingOptions.Rating:
      return array.sort((a: ProductItemPreview, b: ProductItemPreview) => b.rate - a.rate);
    case SortingOptions.Date:
      return array.sort(
        (a: ProductItemPreview, b: ProductItemPreview) => getDateTime(b.dateAdded) - getDateTime(a.dateAdded),
      );
    case SortingOptions.Popularity:
      return array;
    default:
      console.warn(`No such sorting option: ${option}`);
      return array;
  }
}
