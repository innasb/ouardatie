export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        Relationships: []
      }
      communes: {
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
        Relationships: []
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          detailed_description: string | null
          price: number
          category_id: string | null
          images: string[] | null
          available_sizes: string[] | null
          available_colors: string[] | null
          fabric_composition: string | null
          care_instructions: string | null
          stock_quantity: number | null
          stock_status: string | null
          is_featured: boolean | null
          is_on_promotion: boolean | null
          promotion_price: number | null
          stock_variants: string[] | null  // Array of JSON strings
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          detailed_description?: string | null
          price: number
          category_id?: string | null
          images?: string[] | null
          available_sizes?: string[] | null
          available_colors?: string[] | null
          fabric_composition?: string | null
          care_instructions?: string | null
          stock_quantity?: number | null
          stock_status?: string | null
          is_featured?: boolean | null
          stock_variants?: string[] | null  // OPTIONAL for insert
          is_on_promotion?: boolean | null
          promotion_price?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          detailed_description?: string | null
          price?: number
          category_id?: string | null
          images?: string[] | null
          available_sizes?: string[] | null
          available_colors?: string[] | null
          fabric_composition?: string | null
          care_instructions?: string | null
          stock_quantity?: number | null
          stock_status?: string | null
          is_featured?: boolean | null
          is_on_promotion?: boolean | null
          promotion_price?: number | null
          stock_variants?: string[] | null  // OPTIONAL for update
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
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