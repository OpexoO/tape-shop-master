/* eslint-disable no-unused-vars */
import couponType from '@/constants/coupon';
import { CouponType } from '@/interfaces/coupon';
import { isValidDate, isValidNumber, isValidString } from '@/utils/validTypes';
import { isValidObjectId } from 'mongoose';

export default class CouponValidator {
  private readonly body: any;
  private type: CouponType;
  private readonly nameLength: number = 3;

  constructor(body: any = {}) {
    this.body = body;
    this.type = this.body?.type;
  }

  public isAllValid(): boolean | string {
    const allValidations = [
      this.isValidName, this.isValidType, this.isValidStartDate, this.isValidEndDate,
      this.isValidDiscount, this.isValidActiveField, this.isValidUserIds, this.isValidCode,
      this.isValidMessage, this.isValidAppliedProducts, this.isValidUsageAmount,
    ];
    for (let i = 0; i < allValidations.length; i += 1) {
      const result = allValidations[i].call(this);
      if (typeof result === 'string') {
        return result;
      }
    }
    if (new Date(this.body.startDate) > new Date(this.body.endDate)) {
      return 'Start date should be earlier than end date';
    }
    if (![null, undefined].includes(this.body.requiredCartTotal)) {
      const result = this.isValidRequiredCartTotal();
      if (typeof result === 'string') {
        return result;
      }
    }
    if (![null, undefined].includes(this.body.maximumDiscount)) {
      const result = this.isValidMaximumDiscount();
      if (typeof result === 'string') {
        return result;
      }
    }
    return true;
  }

  public isValidName(name?: string): boolean | string {
    if (!isValidString(name || this.body.name) || (name || this.body.name).length < this.nameLength) {
      return 'Name is required string field with minimum 3 characters length';
    }
    return true;
  }

  public isValidType(type?: string): boolean | string {
    const choice = Object.entries(couponType).map(([_, value]) => value);
    const value = type || this.body.type;
    if (!isValidString(value) || !choice.includes(value)) {
      return 'Type is required string and should be Flat or Percentage';
    }
    this.type = value;
    return true;
  }

  public isValidStartDate(date?: string): boolean | string {
    if (!isValidDate(date || this.body.startDate)) {
      return 'Start date should be valid date string';
    }
    return true;
  }

  public isValidEndDate(date?: string): boolean | string {
    if (!isValidDate(date || this.body.endDate)) {
      return 'End date should be valid date string';
    }
    return true;
  }

  public isValidDiscount(discount?: number): boolean | string {
    const value = discount ?? this.body.discount;
    if (!isValidNumber(value) || value <= 0) {
      return 'Discount is required positive number';
    }
    if (this.type === couponType.Percentage && value > 100) {
      return 'Percentage discount can\'t be more than 100';
    }
    return true;
  }

  public isValidActiveField(isActive?: boolean): boolean | string {
    if (typeof (isActive ?? this.body.isActive) !== 'boolean') {
      return 'Provide boolean for isActive field';
    }
    return true;
  }

  public isValidRequiredCartTotal(total?: number): boolean | string {
    const value = total ?? this.body.requiredCartTotal;
    if (!isValidNumber(value) || value < 0) {
      return 'Provide non-negative number for requiredCartTotal';
    }
    return true;
  }

  public isValidUserIds(userIds?: string[]): boolean | string {
    const value = userIds || this.body.userIds;
    if (!Array.isArray(value) || (value.length && !value.every((id: string) => isValidObjectId(id)))) {
      return 'Provide array of valid id\'s';
    }
    return true;
  }

  public isValidMaximumDiscount(discount?: number): boolean | string {
    const value = discount ?? this.body.maximumDiscount;
    if (!isValidNumber(value) || value < 0) {
      return 'Provide non-negative number for maximumDiscount';
    }
    return true;
  }

  public isValidCode(code?: string): boolean | string {
    if (!isValidString(code || this.body.code)) {
      return 'Code is required string';
    }
    return true;
  }

  public isValidMessage(message?: string): boolean | string {
    const value = message || this.body.message;
    if (!isValidString(value) || value.length < this.nameLength) {
      return 'Message is required string with minimum 3 characters length';
    }
    return true;
  }

  public isValidAppliedProducts(products?: string[]): boolean | string {
    const value = products || this.body.appliedProducts;
    if (!Array.isArray(value) || (value.length && !value.every((id: string) => isValidObjectId(id)))) {
      return 'Applied products is required array of product\'s id';
    }
    return true;
  }

  public isValidUsageAmount(amount?: number): boolean | string {
    const value = amount || this.body.usageAmount;
    if (!isValidNumber(value) || value <= 0) {
      return 'Usage amount is required positive number';
    }
    return true;
  }
}
