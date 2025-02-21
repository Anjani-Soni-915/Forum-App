export interface UserData {
  id: number;
  fName: string;
}

export interface Topic {
  id: number;
  title: string;
  description: string;
  userId: number;
  likes: number;
  views: number;
  repliesCount: number;
  tags: string[];
  status?: boolean;
  createdAt: string;
  updatedAt: string;
  userData: {
    id: number;
    fName: string;
    lName: string;
  };
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
  tags: string[];
}

export interface CreateTopicResponse {
  createTopic: {
    message: string;
    topic: Topic;
  };
}
