'use strict';
const { createClient } = require('@supabase/supabase-js');

class SupabaseClientManager {
  constructor() {
    this._client = null;
  }

  isConfigured() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    return Boolean(url && key && !url.includes('your-project-id') && !key.includes('your-supabase'));
  }

  getClient() {
    if (!this.isConfigured()) {
      throw new Error(
        'Supabase is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env'
      );
    }

    if (this._client) return this._client;

    const url = process.env.SUPABASE_URL;
    // Prefer service role key on backend to perform server-validated operations with RLS bypass
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    this._client = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    return this._client;
  }
}

module.exports = new SupabaseClientManager();
