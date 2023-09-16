export type UserType = {
  birth_date: string | null;
  created_at: string;
  email: string | null;
  gender: string | null;
  id: number;
  joined_date: string | null;
  name: string | null;
  password: string | null;
  private: boolean | null;
  profile_picture: string | null;
  username: string | null;
};

export type PostType = {
  post: { id: number; text: string | null; user_id: number | null }[];
  user: {
    birth_date: string | null;
    created_at: string;
    email: string | null;
    gender: string | null;
    id: number;
    joined_date: string | null;
    name: string | null;
    password: string | null;
    private: boolean | null;
    profile_picture: string | null;
    username: string | null;
  }[];
  picture?: {publicUrl:string}[];
  likes: { id: number; post_id: number | null; user_id: number | null }[];
  comments: {
    id: number;
    post_id: number | null;
    text: string | null;
    user_id: number | null;
  }[];
};

export type SinglePostType = {
  id: number;
  text: string | null;
  user_id: number | null;
};
