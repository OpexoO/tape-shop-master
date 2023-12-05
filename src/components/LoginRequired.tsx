import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
import { useRouter } from 'next/router';

type Props = {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginRequiredModal({ isOpen, onClose }: Props) {
  const router = useRouter();

  const redirectToLogin = () => {
    onClose();
    router.push('/account');
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Log in</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To proceed to checkout page, you need to log in or create a new account.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={redirectToLogin} autoFocus>Log in</Button>
      </DialogActions>
    </Dialog>
  );
}
