export interface UserData {
  id: number;
  fName: string;
}

export interface ReplyData {
  id: number;
  text: string;
  likes: number;
  status: boolean;
  createdAt: string;
  replyLikesData: ReplyLikesData[];
  userData: {
    id: number;
    fName: string;
    lName: string;
    email: string;
    image: string;
    profession: string;
  };
}

export interface ReplyLikesData {
  id: number;
  status: boolean;
  userId: number;
  replyId: number;
}
export interface Topic {
  id: number;
  title: string;
  description: string;
  tags: string[];
  repliesCount: number;
  likes: number;
  views: number;
  createdAt: string;
  userData: {
    id: number;
    fName: string;
    lName: string;
    image?: string;
    profession?: string;
  };
  replyData: ReplyData[];
  topicLikesData: {
    id: number;
    userId: number;
    topicId: number;
    status: boolean;
  }[];
  subscriptionData: SubscriptionData[];
}

export interface PaginatedTopics {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  topics: Topic[];
}

export interface SubscriptionData {
  id: number;
  userId: number;
  topicId: number;
  status: boolean;
}

export interface GetTopicsResponse {
  getTopics: Topic[];
}

export interface CreateTopicInput {
  title: string;
  description: string;
  likes: number;
  views: number;
  repliesCount: number;
  tags?: string[];
}

export interface CreateTopicResponse {
  createTopic: {
    message: string;
    topic: Topic;
  };
}
