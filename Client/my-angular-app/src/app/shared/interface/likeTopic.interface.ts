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
