export interface TopicLike {
  id: number;
  userId: number;
  topicId: number;
  status: boolean;
}

export interface CreateTopicLikesPayload {
  message: string;
  topicLikes: TopicLike;
}

export interface CreateTopicLikeResponse {
  createTopicLikes: {
    message: string;
    topicLikes: TopicLike;
  };
}

export interface CreateTopicLikesInput {
  topicId: number;
}

export interface ReplyLike {
  id: number;
  userId: number;
  replyId: number;
  status: boolean;
}

export interface CreateReplyLikesPayload {
  message: string;
  replyLikes: ReplyLike;
}

export interface CreateReplyLikeResponse {
  createreplyLikes: {
    message: string;
    replyLikes: ReplyLike;
  };
}

export interface CreateReplyLikesInput {
  replyId: number;
}
