export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          image: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          image?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          image?: string | null;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          category_id: string;
          title: string;
          slug: string;
          description: string;
          price: number;
          compare_price: number | null;
          stock: number;
          thumbnail: string | null;
          featured: boolean;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          title: string;
          slug: string;
          description: string;
          price: number;
          compare_price?: number | null;
          stock?: number;
          thumbnail?: string | null;
          featured?: boolean;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          title?: string;
          slug?: string;
          description?: string;
          price?: number;
          compare_price?: number | null;
          stock?: number;
          thumbnail?: string | null;
          featured?: boolean;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      wishlist_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          phone: string;
          email: string;
          address_line_1: string;
          address_line_2: string | null;
          city: string;
          state: string;
          country: string;
          postal_code: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          phone: string;
          email: string;
          address_line_1: string;
          address_line_2?: string | null;
          city: string;
          state: string;
          country: string;
          postal_code: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          phone?: string;
          email?: string;
          address_line_1?: string;
          address_line_2?: string | null;
          city?: string;
          state?: string;
          country?: string;
          postal_code?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          shipping_address_id: string | null;
          shipping_address: Json;
          subtotal: number;
          shipping_cost: number;
          tax: number;
          discount: number;
          total: number;
          shipping_method: string;
          status: Database["public"]["Enums"]["order_status"];
          payment_status: Database["public"]["Enums"]["payment_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id: string;
          shipping_address_id?: string | null;
          shipping_address: Json;
          subtotal?: number;
          shipping_cost?: number;
          tax?: number;
          discount?: number;
          total?: number;
          shipping_method: string;
          status?: Database["public"]["Enums"]["order_status"];
          payment_status?: Database["public"]["Enums"]["payment_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string;
          shipping_address_id?: string | null;
          shipping_address?: Json;
          subtotal?: number;
          shipping_cost?: number;
          tax?: number;
          discount?: number;
          total?: number;
          shipping_method?: string;
          status?: Database["public"]["Enums"]["order_status"];
          payment_status?: Database["public"]["Enums"]["payment_status"];
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
        };
      };
      user_profiles: {
        Row: {
          user_id: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          rating: number;
          title: string | null;
          body: string | null;
          helpful_votes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          rating: number;
          title?: string | null;
          body?: string | null;
          helpful_votes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          rating?: number;
          title?: string | null;
          body?: string | null;
          helpful_votes?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          description: string | null;
          discount_type: 'percentage' | 'fixed';
          discount_value: number;
          minimum_order_value: number;
          max_uses: number | null;
          used_count: number;
          expires_at: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          description?: string | null;
          discount_type: 'percentage' | 'fixed';
          discount_value: number;
          minimum_order_value?: number;
          max_uses?: number | null;
          used_count?: number;
          expires_at?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          description?: string | null;
          discount_type?: 'percentage' | 'fixed';
          discount_value?: number;
          minimum_order_value?: number;
          max_uses?: number | null;
          used_count?: number;
          expires_at?: string | null;
          active?: boolean;
          created_at?: string;
        };
      };
      coupon_usages: {
        Row: {
          id: string;
          coupon_id: string;
          user_id: string;
          order_id: string | null;
          used_at: string;
        };
        Insert: {
          id?: string;
          coupon_id: string;
          user_id: string;
          order_id?: string | null;
          used_at?: string;
        };
        Update: {
          id?: string;
          coupon_id?: string;
          user_id?: string;
          order_id?: string | null;
          used_at?: string;
        };
      };
      stock_notifications: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          notified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          notified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          notified?: boolean;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      place_order: {
        Args: {
          p_address_id: string;
          p_shipping_method: string;
          p_shipping_cost: number;
          p_tax: number;
          p_discount?: number;
        };
        Returns: {
          order_id: string;
          order_number: string;
        }[];
      };
    };
    Enums: {
      order_status: "Pending" | "Confirmed" | "Cancelled" | "Delivered";
      payment_status: "Pending" | "Paid" | "Failed" | "Refunded";
    };
    CompositeTypes: Record<string, never>;
  };
}
