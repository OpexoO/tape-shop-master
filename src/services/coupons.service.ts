import { AppliedCoupon, Coupon, CouponType, NewCoupon } from '@/interfaces/coupon';
import coupons from '@/utils/generateCouponCode';
import CouponValidator from '@/validation/coupon.validator';
import { FullUser, User } from '@/interfaces/user';
import UserService from './user.service';

export default class CouponsService {
  public static fromServer(body: any | any[]): Coupon | Coupon[] {
    const mapObject = (o: any) => ({
      _id: o._id.toString(),
      id: o._id.toString(),
      name: o.name,
      type: o.type,
      startDate: o.startDate,
      endDate: o.endDate,
      discount: o.discount,
      isActive: o.isActive,
      requiredCartTotal: o.requiredCartTotal || 0,
      usageAmount: o.usageAmount,
      userIds: (o.userIds || []).map(UserService.fromServer),
      maximumDiscount: o.maximumDiscount || 0,
      code: o.code,
      message: o.message,
      totalUsage: o.totalUsage,
      appliedProducts: o.appliedProducts,
    });

    if (Array.isArray(body)) {
      return body.map(mapObject);
    }
    return mapObject(body);
  }

  public static toServer(fields: any): NewCoupon {
    return ({
      name: fields.name,
      type: fields.type,
      startDate: new Date(fields.startDate).toISOString(),
      endDate: new Date(fields.endDate).toISOString(),
      discount: +fields.discount,
      isActive: true,
      requiredCartTotal: fields.requiredCartTotal ?? 0,
      usageAmount: fields.usageAmount ?? 1,
      userIds: fields.userIds || [],
      maximumDiscount: fields.maximumDiscount ?? 0,
      code: fields.code || coupons.generateCouponCode({
        length: 7,
      })[0],
      message: fields.message,
      appliedProducts: fields.appliedProducts || [],
    });
  }

  public static toApplied(coupon: Coupon): AppliedCoupon {
    return ({
      _id: coupon._id,
      id: coupon.id,
      name: coupon.name,
      type: coupon.type,
      code: coupon.code,
      discount: coupon.discount,
      requiredCartTotal: coupon.requiredCartTotal || 0,
      maximumDiscount: coupon.maximumDiscount || 0,
      appliedProducts: coupon.appliedProducts,
    });
  }

  public static preparePatchedFields(fields: any): Partial<NewCoupon> | string {
    const validator = new CouponValidator({});
    const obj: Partial<NewCoupon> = {};

    if (fields.name) {
      const result = validator.isValidName(fields.name as string);
      if (typeof result === 'string') {
        return result;
      }
      obj.name = fields.name as string;
    }
    if (fields.type) {
      const result = validator.isValidType(fields.type as string);
      if (typeof result === 'string') {
        return result;
      }
      obj.type = fields.type as CouponType;
    }
    if (fields.startDate) {
      const result = validator.isValidStartDate(fields.startDate as string);
      if (typeof result === 'string') {
        return result;
      }
      obj.startDate = fields.startDate as string;
    }
    if (fields.endDate) {
      const result = validator.isValidEndDate(fields.endDate as string);
      if (typeof result === 'string') {
        return result;
      }
      obj.endDate = fields.endDate as string;
    }
    if (new Date(fields.startDate) > new Date(fields.endDate)) {
      return 'Start date should be earlier than end date';
    }
    if (fields.discount) {
      const result = validator.isValidDiscount(+fields.discount);
      if (typeof result === 'string') {
        return result;
      }
      obj.discount = +fields.discount;
    }
    if (![null, undefined].includes(fields.isActive)) {
      const result = validator.isValidActiveField(fields.isActive);
      if (typeof result === 'string') {
        return result;
      }
      obj.isActive = fields.isActive;
    }
    if (![null, undefined].includes(fields.requiredCartTotal)) {
      const result = validator.isValidRequiredCartTotal(+fields.requiredCartTotal);
      if (typeof result === 'string') {
        return result;
      }
      obj.requiredCartTotal = +fields.requiredCartTotal;
    }
    if (fields.usageAmount) {
      const result = validator.isValidUsageAmount(+fields.usageAmount);
      if (typeof result === 'string') {
        return result;
      }
      obj.usageAmount = +fields.usageAmount;
    }
    if (fields.userIds) {
      const result = validator.isValidUserIds(fields.userIds);
      if (typeof result === 'string') {
        return result;
      }
      obj.userIds = fields.userIds;
    }
    if (![null, undefined].includes(fields.maximumDiscount)) {
      const result = validator.isValidMaximumDiscount(+fields.maximumDiscount);
      if (typeof result === 'string') {
        return result;
      }
      obj.maximumDiscount = +fields.maximumDiscount;
    }
    if (fields.code) {
      const result = validator.isValidCode(fields.code);
      if (typeof result === 'string') {
        return result;
      }
      obj.code = fields.code;
    }
    if (fields.message) {
      const result = validator.isValidMessage(fields.message);
      if (typeof result === 'string') {
        return result;
      }
      obj.message = fields.message;
    }
    if (fields.appliedProducts) {
      const result = validator.isValidAppliedProducts(fields.appliedProducts);
      if (typeof result === 'string') {
        return result;
      }
      obj.appliedProducts = fields.appliedProducts;
    }

    return obj;
  }

  public static validate(body: any): string | boolean {
    const validator = new CouponValidator(body);
    return validator.isAllValid();
  }

  public static apply(coupon: Coupon, user: FullUser | null): string | AppliedCoupon {
    if (!coupon || !coupon.isActive) {
      return 'Applied coupon doesn\'t exist';
    }
    const date = new Date();
    if (!(new Date(coupon.startDate) <= date && new Date(coupon.endDate) >= date)) {
      return 'Applied coupon is expired';
    }
    if (coupon.userIds.length) {
      if (!user) {
        return 'You are not allowed to use applied coupon';
      }
      const candidate = (coupon.userIds as User[]).find(
        (u: User) => u._id.toString() === user._id.toString(),
      );
      if (!candidate) {
        return 'You are not allowed to use applied coupon';
      }
    }
    if (user) {
      const applied = user.appliedCoupons.find(
        (c: { id: string, amount: number }) => c.id.toString() === coupon._id.toString(),
      );
      const usage = applied?.amount || 0;
      if (usage >= coupon.usageAmount) {
        return 'You have used this coupon already';
      }
    }

    return this.toApplied(coupon);
  }
}
