export const prefefinedTags = [
  'реклама',
  'рассылка',
  'продажи',
  'новость',
  'марафон',
  'флешмоб',
  'вопрос',
  'текст',
  'видео',
  'документ',
  'история'
];
export const supportedSocials = ['telegram'];
export const videoAccept = 'video/mp4,video/x-m4v,video/*';
export const imageAccept = 'image/png, image/gif, image/jpeg';
export const documentAccept =
  '.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export const postLimitations = {
  name: { min: 3, max: 200 },
  body: { min: 1, max: 1024 }
};
export const timeOffset = 180;
