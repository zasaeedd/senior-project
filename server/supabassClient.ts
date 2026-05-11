// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = "https://eeztayuvlkluxpybaoyt.supabase.co";
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// export const supabase = createClient(supabaseUrl, supabaseServiceKey);
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config(); //  load .env

const supabaseUrl = process.env.SUPABASE_URL!;

//  For verifying JWTs
export const supabaseAuth = createClient(
  supabaseUrl,
  process.env.SUPABASE_ANON_KEY!
);

// For privileged DB operations
export const supabaseService = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("Anon key starts with:", process.env.SUPABASE_ANON_KEY?.slice(0, 10));
console.log("Service role key starts with:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10));