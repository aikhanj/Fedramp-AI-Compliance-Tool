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
    const { system_id } = body

    if (!system_id) {
      return NextResponse.json(
        { error: 'Missing required field: system_id' },
        { status: 400 }
      )
    }

    // Insert a new run
    const { data: run, error: runError } = await supabase
      .from('runs')
      .insert({
        system_id,
        status: 'completed',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (runError) {
      return NextResponse.json(
        { error: runError.message },
        { status: 500 }
      )
    }

    // Insert a dummy section
    const { error: sectionError } = await supabase
      .from('sections')
      .insert({
        run_id: run.id,
        control_id: 'AC-2',
        narrative: 'The organization manages information system accounts, including establishing, activating, modifying, reviewing, disabling, and removing accounts. Account management includes the identification of account types (individual, group, system, application, guest/anonymous, and temporary).',
        evidence: [
          'User provisioning workflow documentation',
          'Access control policy document',
          'Quarterly access review reports',
        ],
        citations: [
          'NIST SP 800-53 Rev. 5',
          'FedRAMP AC-2 Control',
        ],
      })

    if (sectionError) {
      return NextResponse.json(
        { error: sectionError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ run_id: run.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

