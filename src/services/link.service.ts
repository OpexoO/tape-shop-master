import getDomain from '@/utils/getDomain';

export default class LinkService {
  private static readonly baseUrl = process.env.NEXT_PUBLIC_DOMAIN;
  private static readonly apiBaseUrl = `${getDomain()}/api`;
  private static readonly shippingBaseUrl = 'https://api.starshipit.com/api';

  private static generateLink(url: string, api?: boolean, customBase?: string): string {
    const base = customBase ?? (api ? this.apiBaseUrl : this.baseUrl);
    return `${base}/${url}`;
  }

  public static apiUserLink(): string {
    return this.generateLink('user', true);
  }

  public static apiAllUsersLink(): string {
    return this.generateLink('user/all', true);
  }

  public static apiUserLoginLink(): string {
    return this.generateLink('user/login', true);
  }

  public static apiUserVerifyLink(): string {
    return this.generateLink('user/verify', true);
  }

  public static apiUserResetLink(): string {
    return this.generateLink('user/reset', true);
  }

  public static apiUserPasswordLink(): string {
    return this.generateLink('user/password', true);
  }

  public static apiReviewsLink(): string {
    return this.generateLink('reviews', true);
  }

  public static apiTypesProductsLink(typeId: string): string {
    return this.generateLink(`types/${typeId}/products`, true);
  }

  public static apiTypesLink(): string {
    return this.generateLink('types', true);
  }

  public static apiCategoriesLink(): string {
    return this.generateLink('categories', true);
  }

  public static apiContactLink(): string {
    return this.generateLink('contact-feedback', true);
  }

  public static apiOrdersRatesLink(): string {
    return this.generateLink('orders/rates', true);
  }

  public static apiOrders(): string {
    return this.generateLink('orders', true);
  }

  public static apiOrderDetails(id: string): string {
    return this.generateLink(`/orders/${id}/details`, true);
  }

  public static apiOrderReturn(id: string): string {
    return this.generateLink(`/orders/${id}/return`, true);
  }

  public static apiApplyCouponLink(): string {
    return this.generateLink('coupons/apply', true);
  }

  public static apiCartLink(id: string): string {
    return this.generateLink(`cart/${id}`, true);
  }

  public static apiMergeCartLink(id: string): string {
    return this.generateLink(`cart/${id}/merge`, true);
  }

  public static apiCreateCartLink(): string {
    return this.generateLink('cart', true);
  }

  public static apiCsrfToken(): string {
    return this.generateLink('csrf', true);
  }

  public static aboutLink(): string {
    return this.generateLink('about');
  }

  public static accountLink(): string {
    return this.generateLink('account');
  }

  public static advisesLink(): string {
    return this.generateLink('advises');
  }

  public static cartLink(): string {
    return this.generateLink('cart');
  }

  public static contactLink(): string {
    return this.generateLink('contact');
  }

  public static disclaimerLink(): string {
    return this.generateLink('disclaimer');
  }

  public static faqLink(): string {
    return this.generateLink('frequently-asked-questions');
  }

  public static maskingTapeLink(): string {
    return this.generateLink('info/masking-tape');
  }

  public static systainerLink(): string {
    return this.generateLink('info/systainer');
  }

  public static dispensersLink(): string {
    return this.generateLink('info/tape-dispensers');
  }

  public static resetLink(): string {
    return this.generateLink('reset');
  }

  public static registerLink(): string {
    return this.generateLink('register');
  }

  public static ppLink(): string {
    return this.generateLink('privacy-policy');
  }

  public static productLink(id: string): string {
    return this.generateLink(`products/${id}`);
  }

  public static returnPolicyLink(): string {
    return this.generateLink('shipping-return-policy');
  }

  public static tcLink(): string {
    return this.generateLink('terms-conditions');
  }

  public static typesLink(id: string): string {
    return this.generateLink(`types/${id}`);
  }

  public static usageLink(): string {
    return this.generateLink('usage');
  }

  public static instructionsLink(): string {
    return this.generateLink('user-instructions');
  }

  public static webshopLink(): string {
    return this.generateLink('webshop');
  }

  public static typeCategoryLink(typeId: string, categoryId: string): string {
    return this.generateLink(`types/${typeId}/category/${categoryId}`);
  }

  public static categoryLink(id: string): string {
    return this.generateLink(`categories/${id}`);
  }

  public static mailVerifyLink(hash: string): string {
    return this.generateLink(`account?hash=${hash}`);
  }

  public static mailResetLink(hash: string): string {
    return this.generateLink(`password?hash=${hash}`);
  }

  public static shippingRatesLink(): string {
    return this.generateLink('rates', true, this.shippingBaseUrl);
  }

  public static shippingOrdersLink(): string {
    return this.generateLink('orders', true, this.shippingBaseUrl);
  }
}
