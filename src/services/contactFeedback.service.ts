import {
  ContactFeedback, NewContactFeedback, PreparedContactFeedback, ServerContactFeedback,
} from '@/interfaces/contactFeedback';

export default class ContactFeedbackService {
  public static prepareFields(body: any): PreparedContactFeedback {
    return {
      name: body.name,
      email: body.email,
      message: body.message,
    };
  }

  public static toServer(fields: PreparedContactFeedback): NewContactFeedback {
    return {
      name: fields.name,
      email: fields.email,
      message: fields.message,
      date: new Date().toISOString(),
      reviewed: false,
    };
  }

  public static fromServer(feedback: ServerContactFeedback | ServerContactFeedback[])
    : ContactFeedback | ContactFeedback[] {
    const mapObject = (o: ServerContactFeedback) => ({
      _id: o._id.toString(),
      id: o._id.toString(),
      name: o.name,
      message: o.message,
      email: o.email,
      reviewed: o.reviewed,
      date: o.date,
    });

    if (Array.isArray(feedback)) {
      return feedback.map(mapObject);
    }
    return mapObject(feedback);
  }
}
