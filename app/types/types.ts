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
  bio: string | null;
};

export type PostType = {
  post: { id: number; text: string | null; user_id: number | null }[];
  user: {
    id: number;
    name: string | null;
    profile_picture: string | null;
    username: string | null;
  }[];
  picture?: { publicUrl: string }[];
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

export type CommentType = {
  id: number;
  post_id: number | null;
  text: string | null;
  user_id: number | null;
};

export type CommentLikes = {
  comment_id: number | null;
  created_at: string;
  id: number;
  user_id: number | null;
};

export type UserDataType = {
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
    bio: string | null;
  }[];
  followers: {
    followed_id?: number | null;
    follower_id?: number | null;
    id?: number;
  }[];
  following: {
    followed_id?: number | null;
    follower_id?: number | null;
    id?: number;
  }[];
  posts: { id: number; text: string | null; user_id: number | null }[];
};

export type UserMessagesType = {
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
  };
  recieve_userMasseges: {
    id: number;
    sender_id: number;
    reciever_id: number;
    text: string;
    seen: boolean;
  }[];
  sended_userMasseges: {
    id: number;
    sender_id: number;
    reciever_id: number;
    text: string;
    seen: boolean;
  }[];
};

export type MessageType = {
  id: number;
  sender_id: number;
  reciever_id: number;
  text: string;
  seen: boolean;
};

export type NotificationType = {
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
    bio: string | null;
  };
  notification: {
    created_at: string;
    id: number;
    notification_sender: number | null;
    post_id: number | null;
    seen: boolean | null;
    text: string | null;
    type: string | null;
    user_id: number | null;
  };
};
