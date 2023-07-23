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
  likes_count: number;
}

export interface UserData {
  user_name: string;
  image: string;
}
