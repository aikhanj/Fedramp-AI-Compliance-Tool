import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  let runId: string | null = null
  
  try {
    const supabase = await createServerSupabase()
    
    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Parse request body
    const body = await request.json()
    const { system_id } = body

    if (!system_id) {
      return NextResponse.json(
        { error: 'Missing required field: system_id' },
        { status: 400 }
      )
    }

    // 3. Fetch system data
    const { data: system, error: systemError } = await supabase
      .from('systems')
      .select('*')
      .eq('id', system_id)
      .single()

    if (systemError || !system) {
      console.error('System fetch error:', systemError)
      return NextResponse.json(
        { error: 'System not found' },
        { status: 404 }
      )
    }

    // 3b. Fetch intake data
    const { data: intake, error: intakeError } = await supabase
      .from('intake')
      .select('*')
      .eq('system_id', system_id)
      .single()

    // Intake is optional, so don't fail if not found
    const intakeData = intake?.json || {}

    // 4. Insert a new run with "running" status
    const { data: run, error: runError } = await supabase
      .from('runs')
      .insert({
        system_id,
        status: 'running',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (runError || !run) {
      console.error('Run creation error:', runError)
      return NextResponse.json(
        { error: 'Failed to create run' },
        { status: 500 }
      )
    }

    runId = run.id

    // 5. Generate AC-2 control section with OpenAI GPT-4o-mini
    const systemPrompt = 
      "You are an AI compliance assistant that generates FedRAMP SSP control sections clearly and formally. " +
      "Generate a complete narrative for the given control based on the system information provided. " +
      "The narrative should be professional, detailed, and suitable for a System Security Plan (SSP)."

    const userPrompt = `
Generate a FedRAMP SSP narrative for control AC-2 (Account Management).

System Information:
- Name: ${system.name}
- Impact Level: ${system.impact_level}

Intake Data:
${JSON.stringify(intakeData, null, 2)}

Please provide:
1. A comprehensive narrative describing how the system implements AC-2 Account Management
2. Include details about account types, provisioning, access reviews, and deprovisioning
3. Reference the intake data where relevant
4. Keep the tone formal and compliance-focused
5. Respond in JSON format with the following structure:
{
  "narrative": "Your detailed narrative here",
  "evidence": ["List of", "evidence items", "required"],
  "citations": ["Relevant", "standards", "and references"]
}
`

    console.log('Calling OpenAI API for system:', system_id)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2000,
    })

    const generatedContent = completion.choices[0]?.message?.content

    if (!generatedContent) {
      throw new Error('No content generated from OpenAI')
    }

    // Parse the JSON response
    let parsedContent
    try {
      parsedContent = JSON.parse(generatedContent)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', generatedContent)
      throw new Error('Invalid JSON response from AI')
    }

    const { narrative, evidence, citations } = parsedContent

    // 6. Insert the generated section into the database
    const { error: sectionError } = await supabase
      .from('sections')
      .insert({
        run_id: run.id,
        system_id,
        control_id: 'AC-2',
        narrative: narrative || 'Generated narrative unavailable',
        evidence: evidence || [],
        citations: citations || ['NIST SP 800-53 Rev. 5', 'FedRAMP AC-2 Control'],
      })

    if (sectionError) {
      console.error('Section insertion error:', sectionError)
      throw new Error('Failed to insert generated section')
    }

    // 7. Update run status to "completed"
    const { error: updateError } = await supabase
      .from('runs')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', run.id)

    if (updateError) {
      console.error('Run update error:', updateError)
      // Don't fail here - the generation succeeded
    }

    console.log('Successfully generated section for run:', run.id)

    // 8. Return success response
    return NextResponse.json(
      {
        success: true,
        run_id: run.id,
        content: {
          narrative,
          evidence,
          citations,
        },
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Generate API error:', error)

    // If we created a run, mark it as failed
    if (runId) {
      try {
        const supabase = await createServerSupabase()
        await supabase
          .from('runs')
          .update({ 
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          })
          .eq('id', runId)
      } catch (updateError) {
        console.error('Failed to update run status:', updateError)
      }
    }

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false,
      },
      { status: 500 }
    )
  }
}

