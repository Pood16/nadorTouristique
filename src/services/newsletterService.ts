import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '';

export interface SendNewsletterParams {
  toEmail: string;
  toName: string;
  subject: string;
  body: string;
}

const newsletterService = {
  /**
   * Send a single newsletter email to one subscriber.
   * Call in sequence for each active subscriber.
   */
  sendToOne: async (params: SendNewsletterParams): Promise<void> => {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: params.toEmail,
        to_name: params.toName,
        subject: params.subject,
        message: params.body,
      },
      PUBLIC_KEY
    );
  },

  /**
   * Initialise EmailJS (call once on app start).
   */
  init: () => {
    emailjs.init(PUBLIC_KEY);
  },
};

export default newsletterService;
