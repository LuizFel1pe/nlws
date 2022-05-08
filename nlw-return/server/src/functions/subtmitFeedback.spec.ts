import { SubmitFeedback } from './submitFeedback';

const createFeedbackSpy = jest.fn();
const sendMailSpy = jest.fn();

describe('Submit Feedback', () => {
  const submitFeedback = new SubmitFeedback(
    { create: createFeedbackSpy },
    { sendMail: sendMailSpy }
  );

  it('should be able to submit a feedback', async () => {
    await expect(
      submitFeedback.execute({
        type: 'BUG',
        comment: 'example comment',
        screenshot:
          'data:image/png;base64,kjdakfja545a4df5456asd4f567dsa5f4e5a6f4d',
      })
    ).resolves.not.toThrow();

    expect(createFeedbackSpy).toHaveBeenCalled();
    expect(sendMailSpy).toHaveBeenCalled();
  });

  it('should not be able to submit feedback without a type', async () => {
    await expect(
      submitFeedback.execute({
        type: '',
        comment: 'example comment',
        screenshot:
          'data:image/png;base64,kjdakfja545a4df5456asd4f567dsa5f4e5a6f4d',
      })
    ).rejects.toThrow();
  });

  it('should not be able to submit feedback without a comment', async () => {
    await expect(
      submitFeedback.execute({
        type: 'BUG',
        comment: '',
        screenshot:
          'data:image/png;base64,kjdakfja545a4df5456asd4f567dsa5f4e5a6f4d',
      })
    ).rejects.toThrow();
  });

  it('should not be able to submit feedback with a invalid screenshot format', async () => {
    await expect(
      submitFeedback.execute({
        type: 'BUG',
        comment: 'example comment',
        screenshot: 'data:image/png;',
      })
    ).rejects.toThrow();
  });
});
