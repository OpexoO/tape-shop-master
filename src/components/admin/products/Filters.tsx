import { faChartSimple, faDollarSign, faTag } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {
  FilterList, FilterListItem, FilterLiveSearch, SavedQueriesList, SearchInput, useGetList,
} from 'react-admin';
import { Type } from '@/interfaces/type';
import { Category } from '@/interfaces/category';
import adminResourceMap from '@/constants/admin-resources';

export const productFilters = [
  <SearchInput
    key="name"
    source="name"
    alwaysOn
  />,
];

export default function AsideFilter() {
  const { data: types } = useGetList<Type>(adminResourceMap.types, {
    pagination: { page: 1, perPage: 100 },
  });
  const { data: categories } = useGetList<Category>(adminResourceMap.categories, {
    pagination: { page: 1, perPage: 100 },
  });

  return (
    <Card
      sx={{
        display: { xs: 'none', md: 'block' },
        order: -1,
        width: '16em',
        mr: 2,
        alignSelf: 'flex-start',
      }}
    >
      <CardContent sx={{ pt: 1 }}>
        <SavedQueriesList />
        <FilterLiveSearch label="Name" source="name" />
        <FilterLiveSearch label="SKU" source="sku" />

        <FilterList
          label="Stock"
          icon={<FontAwesomeIcon icon={faChartSimple} />}
        >
          <FilterListItem
            label="No information"
            value={{
              stockLt: undefined,
              stockGt: undefined,
              stock: 'null',
            }}
          />
          <FilterListItem
            label="Out of stock"
            value={{
              stockLt: undefined,
              stockGt: undefined,
              stock: 0,
            }}
          />
          <FilterListItem
            label="1 - 9 items"
            value={{
              stockLt: 10,
              stockGt: 0,
              stock: undefined,
            }}
          />
          <FilterListItem
            label="10 - 49 items"
            value={{
              stockLt: 50,
              stockGt: 9,
              stock: undefined,
            }}
          />
          <FilterListItem
            label="50 and more items"
            value={{
              stockLt: undefined,
              stockGt: 49,
              stock: undefined,
            }}
          />
        </FilterList>

        <FilterList
          label="Price"
          icon={<FontAwesomeIcon icon={faDollarSign} />}
        >
          <FilterListItem
            label="< 50$"
            value={{
              priceLt: 50,
              priceLte: undefined,
              priceGte: undefined,
              priceGt: undefined,
            }}
          />
          <FilterListItem
            label="50$ - 100$"
            value={{
              priceLte: 100,
              priceGte: 50,
              priceGt: undefined,
              priceLt: undefined,
            }}
          />
          <FilterListItem
            label="> 100$"
            value={{
              priceGt: 100,
              priceLt: undefined,
              priceLte: undefined,
              priceGte: undefined,
            }}
          />
        </FilterList>

        <FilterList
          label="Categories"
          icon={<FontAwesomeIcon icon={faBookmark} />}
        >
          {categories && categories.map((c: Category) => (
            <FilterListItem
              label={c.name}
              key={c._id}
              value={{ categories: c._id }}
              isSelected={isSelectedCategory}
              toggleFilter={toggleCategories}
            />
          ))}
        </FilterList>

        <FilterList
          label="Types"
          icon={<FontAwesomeIcon icon={faTag} />}
        >
          {types && types.map((t: Type) => (
            <FilterListItem
              label={t.name}
              key={t._id}
              value={{ type: t._id }}
            />
          ))}
        </FilterList>
      </CardContent>
    </Card>
  );
}

function isSelectedCategory(value: { categories: string }, filters: any) {
  return (filters.categories || []).includes(value.categories);
}

function toggleCategories(value: { categories: string }, filters: any) {
  const categories = filters.categories || [];
  const currentValue = value.categories;
  return {
    ...filters,
    categories: categories.includes(currentValue)
      ? categories.filter((c: string) => c !== currentValue)
      : [...categories, currentValue],
  };
}
