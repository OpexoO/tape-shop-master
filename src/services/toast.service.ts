import { ToastOptions, toast } from 'react-toastify';

export default class ToastService {
  private static readonly defaultOptions: ToastOptions = {
    position: 'top-center',
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: 'light',
  };

  public static success(text: string, options: ToastOptions = {}): number | string {
    return toast.success(text, { ...this.defaultOptions, ...options });
  }

  public static warn(text: string, option: ToastOptions = {}): number | string {
    return toast.warn(text, { ...this.defaultOptions, autoClose: 3000, ...option });
  }

  public static error(text: string, options: ToastOptions = {}): number | string {
    return toast.error(text, { ...this.defaultOptions, autoClose: 4000, ...options });
  }

  public static isActive(id: string | number = ''): boolean {
    return toast.isActive(id);
  }
}
