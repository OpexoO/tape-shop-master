import { NewContactFeedback } from '@/interfaces/contactFeedback';
import { Schema, model, models } from 'mongoose';

const ContactFeedbackSchema = new Schema<NewContactFeedback>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  reviewed: { type: Boolean, default: false },
  date: { type: String, default: new Date().toISOString() },
});

const ContactFeedback = models.ContactFeedback || model('ContactFeedback', ContactFeedbackSchema);
export default ContactFeedback;
