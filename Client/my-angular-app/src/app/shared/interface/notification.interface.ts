export interface NotificationInfo {
  id: number;
  replyId?: number | null;
  topicId?: number | null;
  subscribedId?: number | null;
  actionTypeId: number;
  receiverId: number;
  notificationRecordId: number;
  isRead?: boolean | null;
  status?: boolean | null;
  createdAt: string;
  notificationRecords?: NotificationRecord | null;
  topicData?: Topic | null;
  replyData?: Reply | null;
  receiver?: User | null;
}

export interface NotificationRecord {
  id: number;
  senderId: number;
  content: string;
}

export interface Topic {
  id: number;
  title: string;
}

export interface Reply {
  id: number;
  text: string;
}

export interface User {
  id: number;
  fName: string;
  lName: string;
}

export interface UpdateNotificationInfoInput {
  isRead: boolean;
}

export interface UpdateNotificationInfoResponse {
  updateNotificationinfo: {
    message: string;
    notificationInfo: NotificationInfo[];
  };
}
