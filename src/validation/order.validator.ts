import trackingStatuses from '@/constants/trackingStatuses';
import { PreparedOrder, PreparedOrderItem } from '@/interfaces/order';
import { isValidDate, isValidNumber, isValidString } from '@/utils/validTypes';
import { isValidObjectId } from 'mongoose';

export default class OrderValidator {
  private readonly body: PreparedOrder;

  constructor(body: PreparedOrder) {
    this.body = body;
  }

  public isAllValid(): boolean | string {
    const allValidations = [
      this.isValidOrderId, this.isValidUserId, this.isValidTotal,
      this.isValidDate, this.isValidItems, this.isValidStatus,
      this.isValidTrackingUrl, this.isValidTrackingNumber,
    ];
    for (let i = 0; i < allValidations.length; i += 1) {
      const result = allValidations[i].call(this);
      if (typeof result === 'string') {
        return result;
      }
    }
    return true;
  }

  public isValidOrderId(): boolean | string {
    if (!this.body.orderId || !isValidString(this.body.orderId)) {
      return 'Provide order id';
    }
    return true;
  }

  public isValidUserId(): boolean | string {
    if (!this.body.userId || !isValidObjectId(this.body.userId)) {
      return 'Provide valid user id';
    }
    return true;
  }

  public isValidTotal(): boolean | string {
    if (!isValidNumber(this.body.total)) {
      return 'Provide valid total of order';
    }
    return true;
  }

  public isValidDate(): boolean | string {
    if (!isValidDate(this.body.date)) {
      return 'Date of order is invalid';
    }
    return true;
  }

  public isValidStatus(): boolean | string {
    if (this.body.status && !trackingStatuses[this.body.status]) {
      return 'Status of order is invalid';
    }
    return true;
  }

  public isValidTrackingUrl(): boolean | string {
    if (!isValidString(this.body.trackingUrl)) {
      return 'Tracking URL is invalid';
    }
    return true;
  }

  public isValidTrackingNumber(): boolean | string {
    if (this.body.trackingNumber && !isValidString(this.body.trackingNumber)) {
      return 'Tracking number is invalid';
    }
    return true;
  }

  public isValidItems(): boolean | string {
    if (!Array.isArray(this.body.items)
      || !this.body.items.length
      || !this.body.items.every((v: PreparedOrderItem) => isValidObjectId(v.info) && isValidNumber(v.total))
    ) {
      return 'Order items are invalid';
    }
    return true;
  }
}
