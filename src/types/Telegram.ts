export interface ITelegramMessage {
  message_id: number;
  from: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username: string;
    language_code: string;
  };
  chat: {
    id: number;
    first_name: string;
    username: string;
    type: string;
  };
  date: Date;
  text?: string;
  document?: {
    file_name: string;
    mime_type: string;
    thumbnail: {
      file_id: string;
      file_unique_id: string;
      file_size: number;
      width: number;
      height: number;
    };
    thumb: {
      file_id: string;
      file_unique_id: string;
      file_size: number;
      width: number;
      height: number;
    };
    file_id: string;
    file_unique_id: string;
    file_size: string;
  };
}
