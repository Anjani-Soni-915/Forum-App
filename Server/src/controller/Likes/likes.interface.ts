export interface CreateTopicLikesInput {
  topicId: number;
  status?: boolean;
}

export interface UpdateTopicLikesInput {
  topicId: number;
  status?: boolean;
}

export interface CreateReplyLikesInput {
  replyId: number;
  status?: boolean;
}

export interface UpdateReplyLikesInput {
  replyId: number;
  status?: boolean;
}
