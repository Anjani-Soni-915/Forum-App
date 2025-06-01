
export interface CreateTopicInput {
  title: string;
  description: string;
  likes: number;
  views: number;
  repliesCount: number;
  tags: object;
  feedType: "post" | "feedback" | "poll";
  isAnonymous: boolean;
  status?: boolean;
  pollData?: {
    isMultipleChoice: boolean;
    expiresAt?: string;
    options: string[];
  };
}

export interface UpdateTopicInput {
  title?: string;
  description?: string;
  likes?: number;
  views?: number;
  repliesCount?: number;
  tags?: object;
  feedType?: "post" | "feedback" | "poll";
  isAnonymous?: boolean;
  status?: boolean;
}
