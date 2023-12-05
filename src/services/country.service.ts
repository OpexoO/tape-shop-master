export default class CurrentCountry {
  private _name: string = '';
  private _countryCode: string = '';
  private static instance: CurrentCountry;

  private static getInstance() {
    if (!this.instance) {
      this.instance = new CurrentCountry();
      this.instance._name = process.env.NEXT_PUBLIC_COUNTRY === 'NZ'
        ? 'New Zeeland'
        : 'Australia';
      this.instance._countryCode = process.env.NEXT_PUBLIC_COUNTRY === 'NZ' ? 'NZ' : 'AU';
    }

    return this.instance;
  }

  public static get countryName(): string {
    return this.getInstance()._name;
  }

  public static get countryCode(): string {
    return this.getInstance()._countryCode;
  }
}
