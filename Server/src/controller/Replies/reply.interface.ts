export interface CreateReplyInput {
  topicId: number;
  text: string;
  likes: number;
  status?: boolean;
}

export interface UpdateReplyInput {
  topicId?: number;
  text?: string;
  likes?: number;
  status?: boolean;
}
