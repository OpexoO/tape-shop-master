import { CartItem } from '@/interfaces/cart';
import { ShippingDestination, ShippingRate, ShippingRatesRequest } from '@/interfaces/shippingRates';
import storageKeys from '@/constants/storageKeys';
import LocalStorageService from './storage.service';

export default class ShippingService {
  private static readonly apiKey = process.env.STARSHIPIT_API_KEY || '';
  private static readonly subKey = process.env.STARSHIPIT_SUB_KEY || '';

  public static prepareHeaders() {
    return {
      'StarShipIT-Api-Key': this.apiKey,
      'Ocp-Apim-Subscription-Key': this.subKey,
    };
  }

  public static prepareDestination(form: FormData): ShippingRatesRequest['destination'] {
    const getFormField = (field: string) => form.get(field)?.toString() || '';
    return {
      street: getFormField('street'),
      city: getFormField('city'),
      post_code: getFormField('postal'),
      country_code: getFormField('country'),
    };
  }

  public static prepareRatesBody(destination: ShippingRatesRequest['destination'], cart: CartItem[])
    : ShippingRatesRequest {
    return {
      destination,
      packages: cart.map((item: CartItem) => ({
        weight: (item.total * item.info.weight) / 1000,
      })),
    };
  }

  public static getShippingRateFromStorage(): ShippingRate | null {
    return LocalStorageService.get<ShippingRate>(storageKeys.ShippingRate);
  }

  public static saveShippingRateInStorage(rate: ShippingRate): void {
    LocalStorageService.set<ShippingRate>(storageKeys.ShippingRate, rate);
  }

  public static deleteShippingRateFromStorage(): void {
    LocalStorageService.delete(storageKeys.ShippingRate);
  }

  public static destinationFromServer(obj: any): ShippingDestination | null {
    if (!obj) return null;
    const destination: ShippingDestination = {
      street: obj.street,
      city: obj.city,
      post_code: obj.post_code,
      country_code: obj.country_code,
    };
    if (obj.suburb) {
      destination.suburb = obj.suburb;
    }
    if (obj.state) {
      destination.state = obj.state;
    }
    return destination;
  }
}
