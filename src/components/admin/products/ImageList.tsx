import { Product } from '@/interfaces/product/product';
import MImageList from '@mui/material/ImageList';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Box from '@mui/material/Box';
import ImageListItem from '@mui/material/ImageListItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import Image from 'next/image';
import { NumberField, useListContext, useRedirect } from 'react-admin';
import adminResourceMap from '@/constants/admin-resources';

// eslint-disable-next-line no-unused-vars
const times = (nbChildren: number, fn: (key: number) => any) => (
  Array.from({ length: nbChildren }, (_, key) => fn(key))
);

export default function ImageList() {
  const { data, isLoading } = useListContext();
  if (!isLoading && !data?.length) {
    return <div style={{ textAlign: 'center', marginTop: '16px' }}>No results found</div>;
  }
  return isLoading ? <LoadingList /> : <LoadedList />;
}

function LoadingList() {
  const { perPage } = useListContext();
  const cols = useColsForWidth();
  return (
    <MImageList rowHeight={260} cols={cols} sx={{ m: 0 }}>
      {times(perPage, (key: number) => (
        <ImageListItem key={key}>
          <Box bgcolor="grey.300" height="100%" />
        </ImageListItem>
      ))}
    </MImageList>
  );
}

function LoadedList() {
  const { data } = useListContext();
  const cols = useColsForWidth();
  const redirect = useRedirect();

  if (!data) {
    return null;
  }

  return (
    <MImageList rowHeight={260} gap={12} cols={cols} sx={{ m: 0 }}>
      {data.map((record: Product) => (
        <ImageListItem
          key={record._id}
          onClick={() => redirect(`/${adminResourceMap.products}/${record._id}`)}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <Image
            src={(record.images[0] as any)?.src || record.images[0]}
            alt=""
            width={200}
            height={200}
            priority
          />
          <ImageListItemBar
            title={record.name}
            subtitle={
              <NumberField
                record={record}
                source="price"
                color="inherit"
                options={{
                  style: 'currency',
                  currency: 'USD',
                }}
              />
            }
            sx={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.4) 70%,rgba(0,0,0,0) 100%)',
            }}
          />
        </ImageListItem>
      ))}
    </MImageList>
  );
}

function useColsForWidth() {
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up('md'));
  const xl = useMediaQuery(theme.breakpoints.up('xl'));
  if (xl) return 6;
  if (md) return 3;
  return 2;
}
