import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    
    // Check logged-in user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { system_id, json } = body

    if (!system_id || !json) {
      return NextResponse.json(
        { error: 'Missing required fields: system_id, json' },
        { status: 400 }
      )
    }

    // Upsert into intake table
    const { error: upsertError } = await supabase
      .from('intake')
      .upsert(
        {
          system_id,
          json,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'system_id',
        }
      )

    if (upsertError) {
      return NextResponse.json(
        { error: upsertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

