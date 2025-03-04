export interface CreateNotificationInfoInput {
  topicId?: number | null;
  replyId?: number | null;
  subscribedId?: number | null;
  actionTypeId: number;
  receiverId: number;
  notificationRecordId: number;
  status?: boolean;
}
