export interface CreateTopicInput {
  title: string;
  description: string;
  likes: number;
  views: number;
  repliesCount: number;
  tags: object;
  status?: boolean;
}

export interface UpdateTopicInput {
  title?: string;
  description?: string;
  likes?: number;
  views?: number;
  repliesCount?: number;
  tags?: object;
  status?: boolean;
}
