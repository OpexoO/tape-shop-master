import itemsPerPage from '@/constants/perPage';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles/createTheme';
import {
  CreateButton, ExportButton, FilterButton, FilterContext,
  FilterForm, ListBase, Pagination, SortButton, Title, TopToolbar,
} from 'react-admin';
import ImageList from './ImageList';
import AsideFilter, { productFilters } from './Filters';

export default function ProductsList() {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

  return (
    <ListBase perPage={itemsPerPage.products} sort={{ field: 'date', order: 'DESC' }}>
      <Title defaultTitle="Products" />
      <FilterContext.Provider value={productFilters}>
        <ListActions isSmall={isSmall} />
        {isSmall && (
          <Box m={1}>
            <FilterForm />
          </Box>
        )}
      </FilterContext.Provider>

      <Box display="flex">
        <AsideFilter />
        <Box width={isSmall ? 'auto' : 'calc(100% - 17em)'}>
          <ImageList />
          <Pagination rowsPerPageOptions={[12, 24, 48, 72]} />
        </Box>
      </Box>
    </ListBase>
  );
}

function ListActions({ isSmall }: { isSmall: boolean }) {
  return (
    <TopToolbar sx={{ minHeight: { sm: 56 } }}>
      {isSmall && <FilterButton />}
      <SortButton fields={['dateAdded', 'price', 'availability', 'rate']} />
      <CreateButton />
      <ExportButton />
    </TopToolbar>
  );
}
