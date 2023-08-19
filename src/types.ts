export interface ThreadData {
  created_time: {
    seconds: any;
    nanoseconds: any;
  };
  user: {
    user_name: string;
    image: string;
  };
  body: string;
  id: string;
  image: string;
  owner_id: string;
  liked_by: string[];
  likes_count: number;
  has_liked: boolean;
}

export interface UserData {
  id: string;
  user_name: string;
  image: string;
  first_name: string;
  last_name: string;
}
