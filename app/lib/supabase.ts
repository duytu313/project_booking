import { createClient } from "@supabase/supabase-js";

// Vì dùng Docker + Prisma, chúng ta không cần kết nối Supabase Client nữa.
// Cung cấp giá trị rỗng để tránh lỗi "supabaseUrl is required" khi khởi động.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);