import httpMethods from '@/constants/httpMethods';
import statusCodes from '@/constants/statusCodes';
import LinkService from '@/services/link.service';
import ToastService from '@/services/toast.service';
import UserService from '@/services/user.service';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FormEvent, useState } from 'react';
import styles from '@/styles/modules/Contact.module.scss';
import fetchCsrfToken from '@/utils/fetchCsrfToken';
import { csrfHeader } from '@/constants/csrf';
import Loader from './Loader';

type Props = {
  isOpen: boolean;
  orderId: string;
  onClose: () => void;
}

export default function OrderReturnModal({ isOpen, onClose, orderId }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const body = {
      message: form.get('message')?.toString() || '',
      reason: form.get('reason')?.toString() || '',
    };

    try {
      setIsLoading(true);
      const token = await fetchCsrfToken();
      const res = await fetch(LinkService.apiOrderReturn(orderId), {
        headers: {
          Authorization: UserService.getUserToken(),
          [csrfHeader]: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        method: httpMethods.post,
      });
      const { data } = await res.json();
      if (res.status === statusCodes.Unauthorized) {
        UserService.deleteUserToken();
      }
      if (!res.ok) {
        ToastService.error(data);
      } else {
        ToastService.success(data);
      }
    } catch (error: any) {
      console.error(error.message);
      ToastService.error(error.message || 'An error has occured');
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  if (!orderId) {
    return null;
  }

  return (
    <Dialog
      fullWidth
      open={isOpen}
      onClose={onClose}
      scroll="paper"
    >
      <form action="" method={httpMethods.post} className={styles.contact} onSubmit={onSubmit}>
        <DialogTitle>Return for order {orderId}</DialogTitle>
        {isLoading && <Loader />}
        {!isLoading
          && <>
            <DialogContent dividers={true}>
              <div className={styles.formItem}>
                The email registered to this account will be used to contact with you.
              </div>
              <div className={styles.formItem}>
                <label className={`${styles.formLabel} ${styles.formLabelModal}`} htmlFor="reason">
                  Fill the reason for return
                </label>
                <textarea
                  className={`${styles.formInput} ${styles.formTextarea}`}
                  id="reason" name="reason"
                  rows={4} required minLength={3}
                />
              </div>
              <div className={styles.formItem}>
                <label className={`${styles.formLabel} ${styles.formLabelModal}`} htmlFor="message">
                  Provide the items you want to return from this order and information you will find usefull
                </label>
                <textarea
                  className={`${styles.formInput} ${styles.formTextarea}`}
                  id="message" name="message"
                  rows={4} required minLength={3}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button type="reset" onClick={onClose}>Close</Button>
              <Button type="submit">Create return</Button>
            </DialogActions>
          </>
        }
      </form>
    </Dialog>
  );
}
