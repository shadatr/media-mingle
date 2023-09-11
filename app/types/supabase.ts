export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tb_comment_comments: {
        Row: {
          comment_id: number | null
          created_at: string
          id: number
          text: string | null
          user_id: number | null
        }
        Insert: {
          comment_id?: number | null
          created_at?: string
          id?: number
          text?: string | null
          user_id?: number | null
        }
        Update: {
          comment_id?: number | null
          created_at?: string
          id?: number
          text?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tb_comment_comments_comment_id_fkey"
            columns: ["comment_id"]
            referencedRelation: "tb_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tb_comment_comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "tb_users"
            referencedColumns: ["id"]
          }
        ]
      }
      tb_comment_likes: {
        Row: {
          comment_id: number | null
          created_at: string
          id: number
          user_id: number | null
        }
        Insert: {
          comment_id?: number | null
          created_at?: string
          id?: number
          user_id?: number | null
        }
        Update: {
          comment_id?: number | null
          created_at?: string
          id?: number
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tb_comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            referencedRelation: "tb_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tb_comment_likes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "tb_users"
            referencedColumns: ["id"]
          }
        ]
      }
      tb_comments: {
        Row: {
          created_at: string
          id: number
          post_id: number | null
          text: string | null
          user_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          post_id?: number | null
          text?: string | null
          user_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          post_id?: number | null
          text?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tb_comments_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "tb_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tb_comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "tb_users"
            referencedColumns: ["id"]
          }
        ]
      }
      tb_followers: {
        Row: {
          created_at: string
          followed_id: number | null
          follower_id: number | null
          id: number
        }
        Insert: {
          created_at?: string
          followed_id?: number | null
          follower_id?: number | null
          id?: number
        }
        Update: {
          created_at?: string
          followed_id?: number | null
          follower_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tb_followers_followed_id_fkey"
            columns: ["followed_id"]
            referencedRelation: "tb_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tb_followers_follower_id_fkey"
            columns: ["follower_id"]
            referencedRelation: "tb_users"
            referencedColumns: ["id"]
          }
        ]
      }
      tb_likes: {
        Row: {
          created_at: string
          id: number
          post_id: number | null
          user_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          post_id?: number | null
          user_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          post_id?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tb_likes_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "tb_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tb_likes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "tb_users"
            referencedColumns: ["id"]
          }
        ]
      }
      tb_messages: {
        Row: {
          created_at: string
          id: number
          reciever_id: number | null
          sender_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          reciever_id?: number | null
          sender_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          reciever_id?: number | null
          sender_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tb_messages_reciever_id_fkey"
            columns: ["reciever_id"]
            referencedRelation: "tb_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tb_messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "tb_users"
            referencedColumns: ["id"]
          }
        ]
      }
      tb_notification: {
        Row: {
          created_at: string
          id: number
          post_id: number | null
          type: string | null
          user_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          post_id?: number | null
          type?: string | null
          user_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          post_id?: number | null
          type?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tb_notification_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "tb_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tb_notification_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "tb_users"
            referencedColumns: ["id"]
          }
        ]
      }
      tb_post_pictures: {
        Row: {
          created_at: string
          id: number
          picture: string | null
          post_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          picture?: string | null
          post_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          picture?: string | null
          post_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tb_post_pictures_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "tb_posts"
            referencedColumns: ["id"]
          }
        ]
      }
      tb_posts: {
        Row: {
          created_at: string
          id: number
          text: string | null
          user_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          text?: string | null
          user_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          text?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tb_posts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "tb_users"
            referencedColumns: ["id"]
          }
        ]
      }
      tb_users: {
        Row: {
          birth_date: string | null
          created_at: string
          email: string | null
          gender: string | null
          id: number
          joined_date: string | null
          name: string | null
          password: string | null
          private: boolean | null
          profile_picture: string | null
          username: string | null
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          email?: string | null
          gender?: string | null
          id?: number
          joined_date?: string | null
          name?: string | null
          password?: string | null
          private?: boolean | null
          profile_picture?: string | null
          username?: string | null
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          email?: string | null
          gender?: string | null
          id?: number
          joined_date?: string | null
          name?: string | null
          password?: string | null
          private?: boolean | null
          profile_picture?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
