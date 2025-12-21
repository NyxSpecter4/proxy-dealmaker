import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from 'octokit';
import OpenAI from 'openai';

// Initialize OpenAI with GPT-4
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repoUrl } = body;

    if (!repoUrl) {
      return NextResponse.json(
        { error: 'repoUrl is required' },
        { status: 400 }
      );
    }

    // Parse GitHub URL
    const urlMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!urlMatch) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL format. Use: https://github.com/username/repo' },
        { status: 400 }
      );
    }

    const [, owner, repo] = urlMatch;

    // Initialize Octokit (use token if available, otherwise public access)
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN || undefined,
    });

    // Fetch repository data
    const [repoData, commitsData, languagesData] = await Promise.all([
      octokit.rest.repos.get({ owner, repo }),
      octokit.rest.repos.listCommits({ owner, repo, per_page: 100 }),
      octokit.rest.repos.listLanguages({ owner, repo }),
    ]);

    const commitCount = commitsData.data.length;
    const languages = Object.keys(languagesData.data);
    const stars = repoData.data.stargazers_count;
    const forks = repoData.data.forks_count;
    const issues = repoData.data.open_issues_count;
    const size = repoData.data.size;

    // Calculate complexity score (simplified)
    const complexity = Math.min(
      10,
      Math.max(1, 
        (languages.length * 0.5) + 
        (size > 10000 ? 3 : size > 5000 ? 2 : size > 1000 ? 1 : 0) +
        (stars > 1000 ? 3 : stars > 100 ? 2 : stars > 10 ? 1 : 0)
      )
    );

    // The Math: (Commits / 2) * Complexity * $100/hr
    const hours = commitCount / 2;
    const rate = 100;
    const valuation = Math.round(hours * complexity * rate);

    // Generate Realistic Valuation Breakdown with GPT-4
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a Tier-1 AI Software Brokerage analyst. Generate a realistic valuation breakdown for a GitHub repository. Be aggressive, professional, and data-driven. Include specific numbers and market comparisons.`
        },
        {
          role: "user",
          content: `Repository: ${owner}/${repo}
Stats:
- Commits: ${commitCount}
- Stars: ${stars}
- Forks: ${forks}
- Languages: ${languages.join(', ')}
- Size: ${size} KB
- Open Issues: ${issues}

Calculated valuation: $${valuation.toLocaleString()}
Formula: (${commitCount} commits / 2) * ${complexity} complexity * $${rate}/hr = $${valuation}

Generate a 3-4 paragraph aggressive sales pitch with:
1. Executive summary
2. Technical assessment
3. Market positioning
4. Acquisition recommendation

Make it sound like high-end investment banking analysis.`
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const aiPitch = gptResponse.choices[0]?.message?.content || '';

    // Generate breakdown details
    const breakdown = {
      hours: hours.toFixed(1),
      complexity,
      hourlyRate: rate,
      valuation,
      components: [
        { label: 'Codebase Size', value: `${size} KB`, weight: 'Medium' },
        { label: 'Commit History', value: `${commitCount} commits`, weight: 'High' },
        { label: 'Community Engagement', value: `${stars} stars, ${forks} forks`, weight: 'Medium' },
        { label: 'Tech Stack Diversity', value: `${languages.length} languages`, weight: 'Low' },
      ]
    };

    return NextResponse.json({
      success: true,
      repository: {
        owner,
        name: repo,
        url: repoUrl,
        description: repoData.data.description,
      },
      metrics: {
        commits: commitCount,
        stars,
        forks,
        languages,
        size,
        issues,
        complexity,
      },
      valuation: {
        raw: valuation,
        formatted: `$${valuation.toLocaleString()}`,
        breakdown,
      },
      aiPitch,
      generatedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Analyze repo error:', error);
    
    // Provide fallback if OpenAI fails
    if (error.message?.includes('API key')) {
      return NextResponse.json({
        success: true,
        repository: { owner: 'demo', name: 'demo', url: 'https://github.com/demo/demo' },
        metrics: { commits: 150, stars: 45, forks: 12, languages: ['TypeScript', 'Python'], size: 2500, issues: 3, complexity: 7.5 },
        valuation: {
          raw: 56250,
          formatted: '$56,250',
          breakdown: {
            hours: 75,
            complexity: 7.5,
            hourlyRate: 100,
            valuation: 56250,
            components: [
              { label: 'Codebase Size', value: '2500 KB', weight: 'Medium' },
              { label: 'Commit History', value: '150 commits', weight: 'High' },
              { label: 'Community Engagement', value: '45 stars, 12 forks', weight: 'Medium' },
              { label: 'Tech Stack Diversity', value: '2 languages', weight: 'Low' },
            ]
          }
        },
        aiPitch: `**EXECUTIVE SUMMARY**: This repository represents a high-potential acquisition target with clean architecture and strong market positioning. The technical foundation is solid, featuring modern TypeScript/React patterns that reduce integration risk by approximately 40% compared to legacy codebases.

**TECHNICAL ASSESSMENT**: With 150 commits demonstrating consistent development velocity, the codebase exhibits professional-grade engineering practices. The 7.5 complexity score indicates sophisticated but maintainable architecture—ideal for enterprise integration.

**MARKET POSITIONING**: At $56,250 valuation, this represents a 3-5x ROI opportunity within 18-24 months. The technology stack aligns perfectly with current market demand for full-stack TypeScript solutions.

**ACQUISITION RECOMMENDATION**: IMMEDIATE DUE DILIGENCE. The talent acquisition value alone justifies the asking price, while the strategic asset could accelerate acquirer roadmap by 12-18 months.`,
        generatedAt: new Date().toISOString(),
        note: 'OpenAI API not configured - using demo data'
      });
    }

    return NextResponse.json(
      { error: error.message || 'Failed to analyze repository' },
      { status: 500 }
    );
  }
}