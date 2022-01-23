import { NodeMailgun as Mailgun } from "ts-mailgun";

export type EmailClientSendArgs = {
  subject: string;
  from: string;
  to: string;
  body: string;
};

export interface EmailClientInterface {
  send(args: EmailClientSendArgs): Promise<any>;
}

export class MailgunEmailClient implements EmailClientInterface {
  private readonly client: Mailgun;

  constructor() {
    this.client = new Mailgun();
    if (!process.env.MAILGUN_API_KEY) {
      console.warn(
        "mailgun environment variables not set. mailgun will not work"
      );
    } else {
      this.client.apiKey = process.env.MAILGUN_API_KEY;
      this.client.domain = process.env.MAILGUN_API_DOMAIN!;
      this.client.init();
    }
  }

  async send(args: EmailClientSendArgs): Promise<any> {
    return this.client.send(args.to, args.subject, args.body);
  }
}

// singleton client
export default new MailgunEmailClient();
