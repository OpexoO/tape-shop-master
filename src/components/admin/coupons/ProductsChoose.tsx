/* eslint-disable no-unused-vars */
import Loader from '@/components/Loader';
import adminResourceMap from '@/constants/admin-resources';
import { Category } from '@/interfaces/category';
import { Product } from '@/interfaces/product/product';
import { Type } from '@/interfaces/type';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Fragment, useEffect, useState } from 'react';
import { useGetList } from 'react-admin';

interface State {
  [key: string]: Record<string, Record<string, boolean>>;
}

interface Props {
  initialValue: string[];
  onChange: (state: State | undefined) => void,
}

export default function ProductsChoose({ initialValue, onChange }: Props) {
  const { data: types = [], isLoading: isTypesLoading } = useGetList(
    adminResourceMap.types,
    { pagination: { page: 1, perPage: 100 } },
  );
  const { data: products = [], isLoading: isProductsLoading } = useGetList(
    adminResourceMap.products,
    { pagination: { page: 1, perPage: 100 } },
  );

  const [checked, setChecked] = useState<State>();

  const findTypeCategoryProducts = (typeId: string, categoryId: string): Product[] => (products || [])
    .filter((p: Product) => p.productType[0]._id === typeId
      && p.categories.map((c: Category) => c._id).includes(categoryId));

  useEffect(() => {
    if (isTypesLoading || isProductsLoading) {
      return;
    }

    const form: any = {};
    types.forEach((t: Type) => {
      const categoriesForm: any = {};
      t.categories.forEach((c: Category) => {
        const productsForm: Record<string, boolean> = {};
        findTypeCategoryProducts(t._id, c._id).forEach((p: Product) => {
          productsForm[p._id] = initialValue.includes(p._id);
        });
        categoriesForm[c.id] = productsForm;
      });
      form[t.id] = categoriesForm;
    });
    setChecked(form);
  }, [types, products]);

  useEffect(() => {
    onChange(checked);
  }, [checked, onChange]);

  const extractTypeValues = (typeId: string) => {
    const values: boolean[] = [];
    const typeForm = checked![typeId];
    Object.keys(typeForm).forEach((key: string) => {
      const obj = typeForm[key];
      Object.keys(obj).forEach((newKey: string) => {
        values.push(obj[newKey]);
      });
    });
    return values;
  };

  const isEveryTypeChecked = (typeId: string) => {
    if (!checked) {
      return false;
    }
    return extractTypeValues(typeId).every((v: boolean) => !!v);
  };

  const isSomeTypeChecked = (typeId: string) => {
    if (!checked) {
      return false;
    }
    return !isEveryTypeChecked(typeId) && extractTypeValues(typeId).some((v: boolean) => !!v);
  };

  const checkType = (typeId: string, isChecked: boolean) => {
    const type = (types as Type[]).find((t: Type) => t.id === typeId)!;
    const typeForm: Record<string, Record<string, boolean>> = {};
    type.categories
      .forEach((c: Category) => {
        const productsForm: Record<string, boolean> = {};
        findTypeCategoryProducts(type._id, c._id).forEach((p: Product) => {
          productsForm[p._id] = isChecked;
        });
        typeForm[c.id] = productsForm;
      });

    const state = {
      ...checked,
      [typeId]: typeForm,
    };
    setChecked(state);
  };

  const extractCategoryValues = (typeId: string, categoryId: string) => {
    const products: Record<string, boolean> = checked![typeId][categoryId];
    return Object.keys(products).map((key: string) => products[key]);
  };

  const isEveryCategoryChecked = (typeId: string, categoryId: string) => {
    if (!checked) {
      return false;
    }
    return extractCategoryValues(typeId, categoryId).every((v: boolean) => !!v);
  };

  const isSomeCategoryChecked = (typeId: string, categoryId: string) => {
    if (!checked) {
      return false;
    }
    return !isEveryCategoryChecked(typeId, categoryId)
      && extractCategoryValues(typeId, categoryId).some((v: boolean) => !!v);
  };

  const checkCategory = (typeId: string, categoryId: string, isChecked: boolean) => {
    const productsForm: Record<string, boolean> = {};
    Object.keys(checked![typeId][categoryId]).forEach((key: string) => {
      productsForm[key] = isChecked;
    });

    const typeForm = {
      ...checked,
      [typeId]: {
        ...checked![typeId],
        [categoryId]: productsForm,
      },
    };
    setChecked(typeForm as State);
  };

  if (!checked || isTypesLoading || isProductsLoading) {
    return <Loader />;
  }

  return (
    <>
      {types.map((t: Type) => (
        <Fragment key={t.id}>
          <FormControlLabel
            label={t.name}
            control={
              <Checkbox
                checked={isEveryTypeChecked(t.id)}
                indeterminate={isSomeTypeChecked(t.id)}
                onChange={
                  (event: React.ChangeEvent<HTMLInputElement>) => checkType(t.id, event.target.checked)
                }
              />
            }
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
            {t.categories.map((c: Category) => (
              <Fragment key={c.id}>
                <FormControlLabel
                  label={c.name}
                  control={
                    <Checkbox
                      checked={isEveryCategoryChecked(t.id, c.id)}
                      indeterminate={isSomeCategoryChecked(t.id, c.id)}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                        checkCategory(t.id, c.id, event.target.checked)
                      )}
                    />
                  }
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                  {findTypeCategoryProducts(t._id, c._id).map((p: Product) => (
                    <FormControlLabel
                      key={p._id}
                      label={p.name}
                      control={
                        <Checkbox
                          checked={checked[t.id][c.id][p._id]}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const state = {
                              ...checked,
                              [t.id]: {
                                ...checked[t.id],
                                [c.id]: {
                                  ...checked[t.id][c.id],
                                  [p._id]: event.target.checked,
                                },
                              },
                            };
                            setChecked(state);
                          }}
                        />
                      }
                    />
                  ))}
                </Box>
              </Fragment>
            ))}
          </Box>
        </Fragment>
      ))}
    </>
  );
}
