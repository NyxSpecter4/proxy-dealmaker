# GitHub Repository Analyzer Architecture

## Overview
The GitHub Repository Analyzer is a core component of the DealMaker agent that analyzes software projects on GitHub to provide valuation insights and deal negotiation data.

## Core Components

### 1. GitHub API Integration Layer
- **OAuth Authentication**: Uses GitHub OAuth app for user authorization
- **API Client**: Wrapper around GitHub REST API v3 and GraphQL v4
- **Rate Limiting**: Handle API rate limits with exponential backoff
- **Token Management**: Store and refresh access tokens securely

### 2. Data Collection Module
- **Repository Metadata**: Name, description, language, topics, license
- **Activity Metrics**: Commits, issues, PRs, releases, stars, forks
- **Contributor Analysis**: Top contributors, commit frequency, organization
- **Code Analysis**: File structure, dependencies, test coverage (if available)
- **Community Metrics**: Discussions, wiki, sponsors

### 3. Analysis Engine
- **Valuation Metrics**:
  - Project activity score (weighted combination of commits, issues, PRs)
  - Community engagement score (stars, forks, contributors)
  - Maintenance health (recent activity, issue resolution time)
  - Technology stack assessment
- **Market Comparison**: Similar projects and their valuations
- **Risk Assessment**: License risks, dependency vulnerabilities, bus factor

### 4. Data Storage
- **Supabase PostgreSQL**: Store analysis results
- **Cache Layer**: Redis or Supabase cache for frequent queries
- **File Storage**: Supabase Storage for generated reports

### 5. API Layer
- **REST Endpoints**: For triggering analysis, retrieving results
- **WebSocket/SSE**: Real-time analysis progress updates
- **Authentication**: Protected routes using Supabase auth

## Technical Stack
- **Backend**: Next.js API Routes (App Router)
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth + GitHub OAuth
- **API Client**: `octokit/rest` and `octokit/graphql`
- **Analysis**: Custom TypeScript logic, potentially AI/ML models
- **Caching**: Supabase cache or Redis via Upstash

## Data Flow
1. User authenticates via GitHub OAuth
2. User provides repository URL or selects from their repos
3. System fetches repository data via GitHub API
4. Analysis engine processes data and generates insights
5. Results stored in Supabase with user association
6. Results returned to frontend via API

## API Endpoints Design

### `POST /api/analyze/repository`
```typescript
Request: {
  repositoryUrl: string; // GitHub repo URL
  options?: {
    deepAnalysis?: boolean;
    includeCodeScan?: boolean;
    compareWithSimilar?: boolean;
  }
}

Response: {
  analysisId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  estimatedTime?: number;
}
```

### `GET /api/analyze/results/:analysisId`
```typescript
Response: {
  id: string;
  status: 'completed';
  repository: GitHubRepositoryData;
  metrics: AnalysisMetrics;
  valuation: ValuationInsights;
  recommendations: DealRecommendations;
  generatedAt: string;
}
```

### `GET /api/analyze/history`
```typescript
Response: {
  analyses: Array<{
    id: string;
    repositoryName: string;
    status: string;
    createdAt: string;
    summary?: string;
  }>;
}
```

## Database Schema

### `github_analyses`
```sql
id: uuid PRIMARY KEY
user_id: uuid REFERENCES auth.users
repository_url: text
repository_owner: text
repository_name: text
analysis_status: text
metrics: jsonb
valuation_insights: jsonb
recommendations: jsonb
raw_data: jsonb
created_at: timestamptz
completed_at: timestamptz
```

### `github_repository_cache`
```sql
id: uuid PRIMARY KEY
repository_full_name: text UNIQUE
metadata: jsonb
metrics_snapshot: jsonb
last_fetched: timestamptz
```

## Security Considerations
- GitHub token storage with encryption
- Rate limiting per user
- Data privacy (user can only access their analyses)
- Input validation for repository URLs
- API key rotation

## Next Steps
1. Implement GitHub OAuth callback handler
2. Create Octokit client wrapper
3. Design analysis algorithms
4. Create database tables
5. Build API endpoints
6. Create frontend components for displaying analysis