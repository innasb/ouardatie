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
      categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      communes: { // 👈 ADDED HERE
        Row: {
          id: string
          wilaya: string
          commune_name: string
          created_at: string
        }
        Insert: {
          id?: string
          wilaya: string
          commune_name: string
          created_at?: string
        }
        Update: {
          id?: string
          wilaya?: string
          commune_name?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          category_id: string | null
          images: string[]
          available_sizes: string[]
          available_colors: string[]
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          price: number
          category_id?: string | null
          images?: string[]
          available_sizes?: string[]
          available_colors?: string[]
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          category_id?: string | null
          images?: string[]
          available_sizes?: string[]
          available_colors?: string[]
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      shipping_options: {
        Row: {
          id: string
          wilaya: string
          desk_price: number
          home_price: number
          created_at: string
        }
        Insert: {
          id?: string
          wilaya: string
          desk_price: number
          home_price: number
          created_at?: string
        }
        Update: {
          id?: string
          wilaya?: string
          desk_price?: number
          home_price?: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          customer_phone: string
          wilaya: string
          commune: string
          shipping_type: 'desk' | 'home'
          shipping_cost: number
          total_amount: number
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'canceled'
          payment_method: 'card' | 'cash'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          customer_phone: string
          wilaya: string
          commune: string
          shipping_type: 'desk' | 'home'
          shipping_cost: number
          total_amount: number
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'canceled'
          payment_method: 'card' | 'cash'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          customer_phone?: string
          wilaya?: string
          commune?: string
          shipping_type?: 'desk' | 'home'
          shipping_cost?: number
          total_amount?: number
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'canceled'
          payment_method?: 'card' | 'cash'
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_price: number
          quantity: number
          size: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_price: number
          quantity: number
          size: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_price?: number
          quantity?: number
          size?: string
          color?: string
          created_at?: string
        }
      }
    }
  }
}