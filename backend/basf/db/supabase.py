from supabase import Client, create_client

from basf.config import env

supabase: Client = create_client(env["SUPABASE_URL"], env["SUPABASE_KEY"])
