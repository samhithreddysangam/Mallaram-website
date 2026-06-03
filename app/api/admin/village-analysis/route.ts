import { NextResponse } from 'next/server';
import { auth } from '@/auth';

// Define the analysis result type
interface AnalysisResult {
  success: boolean;
  innovations: { title: string; description: string; location: string; impact: string }[];
  recommendations: { area: string; suggestion: string; priority: 'high' | 'medium' | 'low'; expectedImpact: string }[];
  awardPrograms: { programName: string; description: string; eligibility: string; likelihood: string }[];
  schemeSuggestions: { title: string; description: string; targetGroup: string; expectedOutcome: string }[];
  summary: string;
  error?: string;
}

export async function POST() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if admin
    if ((session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'OPENAI_API_KEY not configured. Set it in your .env file to enable AI analysis.',
        innovations: [],
        recommendations: [],
        awardPrograms: [],
        schemeSuggestions: [],
        summary: 'AI analysis requires an OpenAI API key. Please add OPENAI_API_KEY to your environment variables.'
      } as AnalysisResult, { status: 200 });
    }

    const prompt = `You are an expert rural development analyst for India. Analyze the following aspects about Grama Panchayaths in India and provide a comprehensive, structured analysis.

Context: Mallaram Grama Panchayath is in Rajanna Sircilla district, Telangana. It has digital initiatives like online booking, farmer enrollment, weather alerts, government scheme tracking, and school management.

Please provide analysis on:

1. **Innovations across India**: What innovative works have other Grama Panchayaths in India done that Mallaram could learn from? Include specific examples from states like Kerala, Karnataka, Maharashtra, Tamil Nadu, Rajasthan, etc.

2. **Recommendations for Mallaram**: Specific, actionable recommendations for Mallaram's betterment across areas like: digital governance, waste management, water conservation, agriculture, education, healthcare, women empowerment, and infrastructure.

3. **Award-Winning Programs**: What awards are available for Grama Panchayaths (e.g., Gram Urja Awards, Swachh Survekshan, National Panchayat Awards, etc.)? Which ones is Mallaram best positioned to win given its digital infrastructure?

4. **Scheme Implementation**: Suggest innovative schemes Mallaram could implement that would benefit villagers, with details on target groups and expected outcomes.

Format your response as valid JSON with this exact structure (no markdown, no code fences, just raw JSON):
{
  "innovations": [
    { "title": "Innovation name", "description": "What they did", "location": "State/Village", "impact": "Measurable outcome" }
  ],
  "recommendations": [
    { "area": "Focus area", "suggestion": "Specific recommendation", "priority": "high|medium|low", "expectedImpact": "What it would achieve" }
  ],
  "awardPrograms": [
    { "programName": "Award name", "description": "What it's for", "eligibility": "Who can apply", "likelihood": "High/Medium/Low for Mallaram" }
  ],
  "schemeSuggestions": [
    { "title": "Scheme name", "description": "What it does", "targetGroup": "Who benefits", "expectedOutcome": "Expected results" }
  ],
  "summary": "A 2-3 paragraph executive summary of the most important findings for Mallaram"
}

Provide at least 5 innovations, 8 recommendations (mix of priorities), 5 award programs, and 5 scheme suggestions. Be specific, data-driven, and actionable. Include real examples from actual Indian villages.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert rural development analyst for India. You respond only with valid JSON. No markdown, no code fences, just raw JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return NextResponse.json({
        success: false,
        error: `AI service error: ${response.status}. Please check your API key and try again.`,
        innovations: [],
        recommendations: [],
        awardPrograms: [],
        schemeSuggestions: [],
        summary: 'AI analysis failed due to a service error.'
      } as AnalysisResult, { status: 200 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Try to parse the JSON response
    try {
      // Extract JSON if it's wrapped in code fences
      let jsonStr = content;
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }
      
      const parsed = JSON.parse(jsonStr.trim());
      
      return NextResponse.json({
        success: true,
        innovations: parsed.innovations || [],
        recommendations: parsed.recommendations || [],
        awardPrograms: parsed.awardPrograms || [],
        schemeSuggestions: parsed.schemeSuggestions || [],
        summary: parsed.summary || 'Analysis completed.',
      } as AnalysisResult, { status: 200 });
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return the raw content if parsing fails
      return NextResponse.json({
        success: true,
        innovations: [{ title: 'AI Analysis', description: content.substring(0, 500), location: 'India', impact: 'Raw analysis data' }],
        recommendations: [],
        awardPrograms: [],
        schemeSuggestions: [],
        summary: content.substring(0, 1000),
      } as AnalysisResult, { status: 200 });
    }

  } catch (error) {
    console.error('Village analysis error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error during analysis. Please try again.',
      innovations: [],
      recommendations: [],
      awardPrograms: [],
      schemeSuggestions: [],
      summary: 'An unexpected error occurred.'
    } as AnalysisResult, { status: 200 });
  }
}
