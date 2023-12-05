import Select, { SingleValue } from 'react-select';
import Thumbnails from '@/components/Thumbnails';
import { useCartContext } from '@/context/cartContext';
import { Category } from '@/interfaces/category';
import { Product } from '@/interfaces/product/product';
import CartService from '@/services/cart.service';
import styles from '@/styles/modules/Product.module.scss';
import Link from 'next/link';
import { FunctionComponent, memo, useMemo, useRef, useState } from 'react';
import { CartContextProps } from '@/interfaces/cart';
import { formatPrice } from '@/utils/helpers';
import { ProductOption } from '@/interfaces/product/productOption';
import { tapeWidth, Option, numberOfRoles } from '@/constants/tapeOptions';
import AmountHandler from '../AmountHandler';

interface PriceOption {
  [key: string]: number;
}

interface RoleOptions {
  [key: string]: Option[]
}

interface Props {
  product: Product;
}

interface PropsWithContext extends Props {
  addItems: CartContextProps['addItems'];
}

const withContext = (Component: FunctionComponent<PropsWithContext>) => {
  const ComponentMemo = memo(Component);
  // eslint-disable-next-line react/display-name
  return (props: Props) => {
    const { addItems } = useCartContext();
    return <ComponentMemo {...props} addItems={addItems} />;
  };
};

const ProductHeader = withContext(({ product, addItems }: PropsWithContext) => {
  const itemsAmount = useRef<number>(1);
  const [tapeWidthValue, setTapeWidthValue] = useState<Option | null>(null);
  const [rolesValue, setRolesValue] = useState<Option | null>(null);

  const tapeWidthOptions = useMemo(() => {
    const { options } = product;
    if (!options?.length) return [];

    return Array.from(new Set(options.map((o: ProductOption) => o.width)))
      .map((w: string) => tapeWidth.find((o: Option) => o.id === w)!);
  }, [product]);
  const rolesOptions = useMemo(() => {
    const { options } = product;
    if (!options?.length) return {};

    return options.reduce((acc: RoleOptions, curr: ProductOption) => {
      const { width } = curr;
      const role = numberOfRoles.find((v: Option) => v.id === curr.role)!;
      if (acc[width]) {
        acc[width].push(role);
      } else {
        acc[width] = [role];
      }
      return acc;
    }, {});
  }, [product]);
  const priceOptions = useMemo(() => {
    const { options } = product;
    if (!options?.length) return {};

    return options.reduce((acc: PriceOption, curr: ProductOption) => {
      acc[`${curr.width};${curr.role}`] = curr.price;
      return acc;
    }, {});
  }, [product]);
  const isOptionSelected = useMemo(
    () => !!tapeWidthValue && !!rolesValue,
    [tapeWidthValue, rolesValue],
  );

  const tapeWidthChange = (selected: SingleValue<Option>) => {
    setRolesValue(null);
    setTapeWidthValue(selected);
  };
  const rolesChange = (selected: SingleValue<Option>) => {
    setRolesValue(selected);
  };

  const onCartAdd = () => {
    if (itemsAmount.current <= 0 || (product.options?.length && !isOptionSelected)) {
      return;
    }

    let option: ProductOption | undefined;
    if (isOptionSelected) {
      option = {
        role: rolesValue!.id,
        width: tapeWidthValue!.id,
        price: priceOptions[`${tapeWidthValue!.id};${rolesValue!.id}`],
      };
    }
    addItems(CartService.prepareItem(product, itemsAmount.current, option));
  };

  const onChangeAmount = (value: number) => {
    itemsAmount.current = value;
    return Promise.resolve(true);
  };

  return (
    <div className={styles.productHeader}>
      <div className={styles.images}>
        <Thumbnails images={product.images} />
      </div>

      <div className={styles.productHeaderInfoContainer}>
        <h1 className="title">{product.name}</h1>
        <div className={styles.productHeaderInfo}>
          <div className={styles.productHeaderCaption}>
            <div>SKU {product.sku}</div>
            <div className={styles.productHeaderCategories}>
              <span>Categories</span>
              {product.categories.map((c: Category, idx: number) => (
                <Link className={styles.productHeaderCategoryLink} key={c._id} href={`/categories/${c._id}`}>
                  {idx === product.categories.length - 1 ? c.name : `${c.name},`}
                </Link>
              ))}
            </div>
          </div>
          <div className={`${styles.productHeaderPrice} bold`}>
            {!!product.options?.length && 'From '}
            $ {formatPrice(product.price)}
          </div>
          {(product.availability ?? 0) > 0
            && <div><span className="bold">Availability: </span>{product.availability} in stock</div>}
          {typeof product.availability === 'number' && product.availability === 0
            && <div><span className="bold">Availability: </span>Out of stock</div>}
          {
            !!tapeWidthOptions?.length
            && <>
            <div className={styles.productHeaderOptions}>
              <div className={styles.productHeaderOption}>
                <label className="bold" htmlFor="tape-width">Tape width</label>
                <Select
                  isClearable={true}
                  isSearchable={false}
                  id="tape-width" instanceId="tape-width" name="tape-width"
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  placeholder="Choose an option"
                  value={tapeWidthValue}
                  options={tapeWidthOptions}
                  onChange={tapeWidthChange}
                />
              </div>
              <div className={styles.productHeaderOption}>
                <label className="bold" htmlFor="roles">Number of roles</label>
                <Select
                  isClearable={true}
                  isSearchable={false}
                  isDisabled={!tapeWidthValue}
                  id="roles" instanceId="roles" name="roles"
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  placeholder="Choose an option"
                  value={rolesValue}
                  options={rolesOptions[tapeWidthValue?.id || '']}
                  onChange={rolesChange}
                />
              </div>
            </div>
            {
            isOptionSelected
              && <div className={`${styles.productHeaderPrice} bold`}>
                $ {formatPrice(priceOptions[`${tapeWidthValue!.id};${rolesValue!.id}`])}
              </div>
            }
          </>
          }
          <div className={styles.productHeaderActions}>
            <AmountHandler
              availability={product.availability}
              onChange={onChangeAmount}
            />
            <button
              className={styles.productHeaderBtn}
              disabled={!!product.options?.length && !isOptionSelected}
              onClick={onCartAdd}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductHeader;
