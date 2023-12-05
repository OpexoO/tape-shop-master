export default class ScreenUtils {
  private static tabletResolution: number = 800;

  public static getWindowWidth(): number {
    return window.innerWidth;
  }

  public static isTablet(): boolean {
    return this.getWindowWidth() <= this.tabletResolution;
  }
}
