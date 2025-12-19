# Project Profile Analyzer

A comprehensive GitHub repository analysis system that evaluates software projects for investment potential, generating AI-powered narratives and business insights.

## Overview

This module implements the functionality described in the task script `generateProjectProfile.js`, providing a complete TypeScript-based solution for analyzing GitHub repositories. It integrates with the existing Proxy Dealmaker codebase to offer:

- **Repository Analysis**: Technical metrics, community engagement, code health, and business potential
- **AI-Powered Narratives**: Investment theses generated using OpenAI
- **Batch Processing**: Concurrent analysis of multiple repositories
- **Valuation Insights**: Estimated project value and deal recommendations
- **API Integration**: REST endpoints for programmatic access

## Architecture

### Core Components

1. **`ProjectProfileAnalyzer`** (`lib/project-profile-analyzer.ts`)
   - Main class for analyzing individual repositories
   - Integrates with existing `GitHubClient` and `RepositoryAnalyzer`
   - Generates comprehensive project profiles with AI narratives

2. **`BatchAnalyzer`** (`lib/batch-analyzer.ts`)
   - Manages concurrent analysis of multiple repositories
   - Progress tracking and error handling
   - Rate limiting to respect GitHub API limits

3. **`OpenAIService`** (`lib/openai-service.ts`)
   - Manages OpenAI API integration
   - Configurable narrative generation with different tones and focuses
   - Fallback narratives when OpenAI is unavailable

4. **Utility Functions** (`lib/github-analyzer-utils.ts`)
   - Helper functions for specific use cases
   - Task-specific analysis for the three repositories mentioned in the task
   - Report generation and export utilities

5. **API Routes** (`app/api/analyze/batch/route.ts`)
   - REST endpoints for batch analysis
   - Support for analyzing the three specific repositories from the task
   - Progress tracking and result retrieval

## Usage Examples

### Analyzing the Three Task Repositories

```typescript
import { executeTaskScriptAnalysis } from '@/lib/github-analyzer-utils'

const results = await executeTaskScriptAnalysis('your-github-token')
console.log(results.projects) // Array of analyzed repositories
console.log(results.summary)   // Comparative analysis summary
```

### Using Batch Analyzer

```typescript
import { BatchAnalyzer } from '@/lib/batch-analyzer'

const batchAnalyzer = new BatchAnalyzer('your-github-token', 'your-openai-key')
const results = await batchAnalyzer.analyzeTaskRepositories({
  includeAINarratives: true,
  maxConcurrent: 1,
  delayBetweenRequests: 2000
})
```

### API Endpoints

**POST `/api/analyze/batch`**
```json
{
  "repositoryUrls": [
    "https://github.com/NyxSpecter4/bountywarz",
    "https://github.com/NyxSpecter4/RWS-CC",
    "https://github.com/NyxSpecter4/camel-racing"
  ],
  "options": {
    "includeAINarratives": true,
    "maxConcurrent": 1
  }
}
```

**Response:**
```json
{
  "jobId": "batch_1703000000000_abc123",
  "status": "processing",
  "repositoryCount": 3,
  "estimatedTime": 30,
  "message": "Batch analysis started. Use GET endpoint with jobId to check progress."
}
```

**GET `/api/analyze/batch?jobId=batch_1703000000000_abc123`**
```json
{
  "id": "batch_1703000000000_abc123",
  "status": "completed",
  "progress": { "completed": 3, "total": 3, "status": "completed" },
  "results": {
    "profiles": [...],
    "summary": {...}
  }
}
```

**PUT `/api/analyze/batch`** (Task-specific analysis)
```json
{
  "options": {
    "includeAINarratives": true
  }
}
```

## Project Profile Structure

Each analyzed repository returns a `ProjectProfile` object:

```typescript
interface ProjectProfile {
  name: string                    // Repository name
  tagline: string | null          // Repository description
  analysis: string                // AI-generated investment narrative
  technicalSummary: {
    primaryLanguage: string       // Main programming language
    totalLinesOfCode: number      // Total LOC across all languages
    lastUpdated: string           // Last update timestamp
    stars: number                 // GitHub stars
    forks: number                 // GitHub forks
    contributors: number          // Number of contributors
  }
  metrics: AnalysisMetrics        // Activity, community, code health, business scores
  valuation: ValuationInsights    // Estimated value and methodology
  recommendations: DealRecommendations // Acquisition, investment, partnership advice
  githubUrl: string               // Repository URL
  createdAt: string               // Repository creation date
  updatedAt: string               // Last update date
}
```

## Integration with Existing Codebase

The Project Profile Analyzer builds upon existing components:

1. **`GitHubClient`** (`lib/github-client.ts`): Fetches repository data from GitHub API
2. **`RepositoryAnalyzer`** (`lib/analyzer.ts`): Calculates metrics and generates insights
3. **`supabase-client`** (`lib/supabase-client.ts`): Database integration for storing results
4. **Authentication**: Uses existing GitHub OAuth flow for API access

## Configuration

### Environment Variables

```bash
# Required for GitHub API access (via OAuth)
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

# Optional for AI narratives
OPENAI_API_KEY=your_openai_key

# Supabase for data persistence
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### Rate Limiting

The batch analyzer includes built-in rate limiting:
- Default: 1 concurrent request with 2-second delays
- Configurable via `maxConcurrent` and `delayBetweenRequests` options
- Respects GitHub API rate limits (5000 requests/hour for authenticated users)

## Error Handling

- **GitHub API Errors**: Retry logic with exponential backoff
- **OpenAI Errors**: Fallback to basic narrative generation
- **Network Errors**: Continue with remaining repositories in batch
- **Validation**: Input validation for repository URLs and parameters

## Testing

Run the test script to verify implementation:

```bash
node test-project-profile.js
```

This will:
1. Check TypeScript compilation
2. Verify all modules exist
3. Validate dependencies
4. Provide example usage

## Deployment Considerations

1. **Background Jobs**: For production, consider moving batch analysis to a queue system (Redis, BullMQ)
2. **Caching**: Implement Redis caching for frequent repository analyses
3. **Monitoring**: Add logging and metrics for analysis performance
4. **Security**: Validate user permissions for repository access
5. **Scalability**: Consider sharding for large-scale batch processing

## Future Enhancements

1. **Advanced AI Models**: Integration with Claude, Gemini, or local LLMs
2. **Comparative Analysis**: Cross-repository benchmarking and trend analysis
3. **Market Data Integration**: Real-time market data for valuation
4. **Export Formats**: PDF reports, Excel exports, presentation decks
5. **Webhook Support**: Real-time notifications for analysis completion
6. **Plugin System**: Extensible analysis modules for specific domains

## License

Part of the Proxy Dealmaker project. See main project license for details.