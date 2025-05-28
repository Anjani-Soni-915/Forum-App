export interface Reply {
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

export interface CreateReplyResponse {
  message: string;
  reply: Reply;
}

export interface CreateReplyInput {
  topicId: number;
  text: string;
  likes?: number;
}

export interface UpdateReplyInput {
  text: string;
}
