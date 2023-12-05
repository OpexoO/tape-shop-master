/* eslint-disable no-unused-vars */
import couponType, { couponChoose } from '@/constants/coupon';
import { Coupon } from '@/interfaces/coupon';
import coupons from '@/utils/generateCouponCode';
import { capitalize } from '@/utils/helpers';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import debounce from '@mui/material/utils/debounce';
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import {
  DateTimeInput, NumberInput, SelectInput, TabbedForm, TextInput,
  minLength, required, useRecordContext,
} from 'react-admin';
import { User } from '@/interfaces/user';
import LinkService from '@/services/link.service';
import LocalStorageService from '@/services/storage.service';
import storageKeys from '@/constants/storageKeys';
import { ServerData } from '@/interfaces/serverData';
import ToastService from '@/services/toast.service';
import ProductsChoose from './ProductsChoose';

interface IProductChoose {
  [key: string]: Record<string, Record<string, boolean>>;
}
type CouponChoose = (typeof couponChoose)[keyof typeof couponChoose];

const req: any[] = [required()];
const reqWithMinLength = [...req, minLength(3, 'Should be at least 3 characters')];
const nonZeroValidation = (value: number) => {
  if (value <= 0) {
    return 'Value should be greater than 0';
  }
  return undefined;
};
const percentageDiscountValidation = (value: number, coupon: Coupon) => {
  if (coupon.type === couponType.Percentage && value > 100) {
    return 'Percentage discount can\'t be greater than 100';
  }
  return undefined;
};
const startDateValidation = (value: Date, coupon: Coupon) => {
  if (new Date(value) > new Date(coupon.endDate)) {
    return 'Start date should be earlier than end date';
  }
  return undefined;
};
const endDateValidation = (value: Date, coupon: Coupon) => {
  if (new Date(value) < new Date(coupon.endDate)) {
    return 'End date should be later than start date';
  }
  return undefined;
};

const appliedProductsChoose = [
  { id: couponChoose.All, name: capitalize(couponChoose.All) },
  { id: couponChoose.Custom, name: capitalize(couponChoose.Custom) },
];

const transformChoose = (value: string[] | CouponChoose) => {
  if (Array.isArray(value)) {
    return value?.length < 1 ? couponChoose.All : couponChoose.Custom;
  }
  return value;
};

const DEBOUNCE_TIME = 250;

interface Props {
  children: ReactElement;
  onApplyProducts: CallableFunction;
  onApplyUser: CallableFunction;
}

export default function CouponForm({ children, onApplyProducts, onApplyUser }: Props) {
  const record = useRecordContext<Coupon>();
  const [couponState, setCouponState] = useState<string>('');
  const [messageState, setMessageState] = useState<string>('');
  const [productsChoose, setProductsChoose] = useState<CouponChoose>(couponChoose.All);
  const [userOptions, setUserOptions] = useState<User[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [userValue, setUserValue] = useState<User[]>([]);

  const generateCode = (): string => coupons.generateCouponCode({})[0];

  const onChange = useCallback((products: IProductChoose | undefined) => {
    const applied: string[] = [];
    if (products) {
      Object.keys(products).forEach((typeKey: string) => {
        const type = products[typeKey];
        Object.keys(type).forEach((categoryKey: string) => {
          const category = type[categoryKey];
          Object.keys(category).forEach((productKey: string) => {
            const product = category[productKey];
            if (product) {
              applied.push(productKey);
            }
          });
        });
      });
    }
    onApplyProducts(applied);
  }, [onApplyProducts]);

  const fetchUsers = useMemo(
    () => debounce(
      (userQuery: string, cb: (data: any) => void) => {
        fetch(`${LinkService.apiAllUsersLink()}?email=${userQuery || ''}`, {
          headers: {
            Authorization: LocalStorageService.get(storageKeys.AdminAuth) || '',
          },
        })
          .then(async (res: Response) => {
            const { data }: ServerData<any> = await res.json();
            if (!res.ok) {
              throw new Error(data);
            }

            cb(data);
          })
          .catch((err: Error) => {
            ToastService.error(err.message);
          });
      },
      DEBOUNCE_TIME,
    ),
    [],
  );

  useEffect(() => {
    if (record) {
      setCouponState(record.code);
      setMessageState(record.message);
      setProductsChoose(transformChoose(record.appliedProducts));
      setUserValue(record.userIds as User[]);
    } else {
      setCouponState(generateCode());
    }
  }, [record]);

  useEffect(() => {
    if (productsChoose === couponChoose.All) {
      onApplyProducts([]);
    }
  }, [productsChoose, onApplyProducts]);

  useEffect(() => {
    onApplyUser(userValue);

    let active: boolean = true;
    if (userInput === '') {
      setUserOptions(userValue ? [...userValue] : []);
      return undefined;
    }

    fetchUsers(userInput, (data: User[]) => {
      if (!active) return;

      let newOptions: User[] = [];
      if (userValue) {
        newOptions = userValue;
      }
      if (data?.length) {
        newOptions = [...newOptions, ...data];
      }
      setUserOptions(newOptions);
    });

    return () => {
      active = false;
    };
  }, [userValue, userInput, fetchUsers, onApplyUser]);

  return (
    <TabbedForm
      sanitizeEmptyValues
      toolbar={children}
      warnWhenUnsavedChanges
      defaultValues={{
        usageAmount: 1,
        code: couponState,
        appliedProducts: couponChoose.All,
      }}
    >
      <TabbedForm.Tab label="General info">
        <Grid container columnSpacing={2}>
          <Grid item xs={12} sm={4}>
            <TextInput source="name" fullWidth validate={reqWithMinLength} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <SelectInput
              source="type"
              fullWidth
              validate={req}
              choices={[
                { id: couponType.Flat, name: capitalize(couponType.Flat) },
                { id: couponType.Percentage, name: capitalize(couponType.Percentage) },
              ]}
            />
          </Grid>
          <Grid item xs={0} sm={4} />
          <Grid item xs={12} sm={4}>
            <DateTimeInput
              source="startDate"
              fullWidth
              validate={[...req, startDateValidation]}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DateTimeInput
              source="endDate"
              fullWidth
              validate={[...req, endDateValidation]}
            />
          </Grid>
          <Grid item xs={0} sm={4} />
          <Grid item xs={0} sm={4} sx={{ display: 'flex', alignItems: 'center', columnGap: '8px' }}>
            <NumberInput
              source="discount"
              fullWidth
              validate={[...req, nonZeroValidation, percentageDiscountValidation]}
            />
            <Tooltip
              title={`Discount amount. If coupoun type is flat, then this number in dollars will be used, 
                otherwise percent.`}
            >
              <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faCircleInfo} />
            </Tooltip>
          </Grid>
          <Grid item xs={0} sm={4} sx={{ display: 'flex', alignItems: 'center', columnGap: '8px' }}>
            <NumberInput
              source="usageAmount"
              fullWidth
              validate={[...req, nonZeroValidation]}
            />
            <Tooltip title="Amount of coupon usage per one user, default is 1">
              <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faCircleInfo} />
            </Tooltip>
          </Grid>
        </Grid>
      </TabbedForm.Tab>
      <TabbedForm.Tab label="Usage info" path="usage">
        <Grid container columnSpacing={2}>
          <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center', columnGap: '8px' }}>
            <TextInput
              source="code"
              fullWidth
              validate={req}
              parse={(value: string) => {
                setCouponState(value);
                return value === '' ? null : value;
              }}
            />
            <Tooltip title="Coupon code that will be written by the user.
              Change the default value if you want to create the custom one">
              <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faCircleInfo} />
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextInput
              source="message"
              multiline
              fullWidth
              rows={3}
              validate={reqWithMinLength}
              parse={(value: string) => {
                setMessageState(value);
                return value === '' ? null : value;
              }}
            />
            <div>
              Output message:&nbsp;
              <span className="bold">
                {messageState ? `${messageState}. ` : ''}
                {couponState ? `Apply promo code ${couponState}.` : ''}
              </span>
            </div>
          </Grid>
        </Grid>
      </TabbedForm.Tab>
      <TabbedForm.Tab label="Applied products" path="applied">
        <Grid container columnSpacing={2}>
          <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center', columnGap: '8px' }}>
            <SelectInput
              source="appliedProducts"
              choices={appliedProductsChoose}
              format={(value: CouponChoose) => {
                const result = transformChoose(value);
                window.setTimeout(() => setProductsChoose(result), 0);
                return result;
              }}
            />
            <Tooltip title="Select All if coupon will be applied to all products,
           otherwise select Custom and choose necessary products">
              <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faCircleInfo} />
            </Tooltip>
          </Grid>
          <Grid item xs={0} sm={8} />
          {productsChoose === couponChoose.Custom
            && <Grid item xs={12} sm={8}>
              <ProductsChoose
                initialValue={record?.appliedProducts || []}
                onChange={onChange}
              />
            </Grid>
          }
        </Grid>
      </TabbedForm.Tab>
      <TabbedForm.Tab label="Additional info" path="additional-info">
        <Grid container columnSpacing={2}>
          <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'center', columnGap: '8px' }}>
            <NumberInput
              source="requiredCartTotal"
              fullWidth
            />
            <Tooltip title="Required minimum cart total in dollars for coupon to be applied.
            0 will be treated as not provided value">
              <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faCircleInfo} />
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'center', columnGap: '8px' }}>
            <NumberInput
              source="maximumDiscount"
              fullWidth
            />
            <Tooltip title="For percentage coupon, maximum amount of discount in dollars.
            0 will be treated as not provided value">
              <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faCircleInfo} />
            </Tooltip>
          </Grid>
          <Grid item xs={0} sm={6} />
          <Grid item xs={12} sm={10} sx={{ display: 'flex', alignItems: 'center', columnGap: '8px' }}>
            <Autocomplete
              id="users"
              multiple
              fullWidth
              filterOptions={(x) => x}
              options={userOptions}
              autoComplete
              includeInputInList
              filterSelectedOptions
              value={userValue}
              noOptionsText="No users"
              getOptionLabel={(option: User) => option.email}
              isOptionEqualToValue={(option: User, value: User) => option._id === value._id}
              onChange={(_: unknown, newValue = []) => {
                setUserOptions([...newValue, ...userOptions]);
                setUserValue(newValue);
              }}
              onInputChange={(_: unknown, v: string) => {
                setUserInput(v);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Type to find users by email" fullWidth />
              )}
            />
            <Tooltip title="You can select particular users to use this coupon.
          Otherwise it will be available for all users.">
              <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faCircleInfo} />
            </Tooltip>
          </Grid>
        </Grid>
      </TabbedForm.Tab>
    </TabbedForm>
  );
}
