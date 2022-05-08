import { MailAdapter } from '../adapters/mailAdapter';
import { FeedbacksRepository } from '../repositories/feedbacksRepository';

interface SubmitFeedbackRequest {
  type: string;
  comment: string;
  screenshot?: string;
}

export class SubmitFeedback {
  constructor(
    private feedbacksRepository: FeedbacksRepository,
    private mailAdapter: MailAdapter
  ) {}

  async execute(request: SubmitFeedbackRequest) {
    const { type, comment, screenshot } = request;

    if (!type || !comment) {
      throw new Error('Type and comment is required');
    }

    if (screenshot && !screenshot.startsWith('data:image/png;base64,')) {
      throw new Error('Screenshot invalid format.');
    }

    await this.feedbacksRepository.create({
      type,
      comment,
      screenshot,
    });

    await this.mailAdapter.sendMail({
      subject: 'Novo feedback',
      body: [
        `<div style="font-family: sans-serif; font-size: 16px;">`,
        `<p>Tipo do feedback: ${type}</p>`,
        `<p>Comentário: ${comment}</p>`,
        `</div>`,
      ].join('\n'),
    });
  }
}
