export interface CreateNotificationRecordsInput {
  senderId: number;
  isRead: boolean;
  content: string;
  status?: boolean;
}
