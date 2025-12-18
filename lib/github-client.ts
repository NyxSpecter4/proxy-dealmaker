import { Octokit } from '@octokit/rest'
import { graphql } from '@octokit/graphql'

export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  watchers_count: number
  open_issues_count: number
  size: number
  default_branch: string
  created_at: string
  updated_at: string
  pushed_at: string
  license: {
    key: string
    name: string
    spdx_id: string
    url: string
  } | null
  topics: string[]
  owner: {
    login: string
    type: 'User' | 'Organization'
  }
  private: boolean
  archived: boolean
  disabled: boolean
  has_wiki: boolean
  has_issues: boolean
  has_projects: boolean
  has_discussions: boolean
  has_pages: boolean
  has_downloads: boolean
  homepage: string | null
  forks: number
  open_issues: number
  watchers: number
  network_count: number
  subscribers_count: number
}

export interface Contributor {
  login: string
  id: number
  contributions: number
  avatar_url: string
  html_url: string
}

export interface CommitActivity {
  week: number
  total: number
  days: number[]
}

export interface RepositoryMetrics {
  repository: GitHubRepository
  contributors: Contributor[]
  commitActivity: CommitActivity[]
  recentCommits: any[]
  issues: {
    open: number
    closed: number
    total: number
  }
  pullRequests: {
    open: number
    merged: number
    total: number
  }
  releases: any[]
  communityHealth: {
    hasWiki: boolean
    hasIssues: boolean
    hasProjects: boolean
    hasDiscussions: boolean
    isArchived: boolean
  }
}

export class GitHubClient {
  private octokit: Octokit
  private graphqlClient: any

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken,
      userAgent: 'ProxyDealmaker/1.0.0',
      timeZone: 'UTC',
    })

    this.graphqlClient = graphql.defaults({
      headers: {
        authorization: `token ${accessToken}`,
      },
    })
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    const { data } = await this.octokit.repos.get({
      owner,
      repo,
    })

    return data as GitHubRepository
  }

  async getContributors(owner: string, repo: string): Promise<Contributor[]> {
    const { data } = await this.octokit.repos.listContributors({
      owner,
      repo,
      per_page: 100,
    })

    return data as Contributor[]
  }

  async getCommitActivity(owner: string, repo: string): Promise<CommitActivity[]> {
    const { data } = await this.octokit.repos.getCommitActivityStats({
      owner,
      repo,
    })

    return data as CommitActivity[]
  }

  async getRecentCommits(owner: string, repo: string, limit: number = 30) {
    const { data } = await this.octokit.repos.listCommits({
      owner,
      repo,
      per_page: limit,
    })

    return data
  }

  async getIssues(owner: string, repo: string) {
    const { data: openIssues } = await this.octokit.issues.listForRepo({
      owner,
      repo,
      state: 'open',
      per_page: 1,
    })

    const { data: closedIssues } = await this.octokit.issues.listForRepo({
      owner,
      repo,
      state: 'closed',
      per_page: 1,
    })

    // Get total count via search API
    const { data: issueSearch } = await this.octokit.search.issuesAndPullRequests({
      q: `repo:${owner}/${repo} type:issue`,
      per_page: 1,
    })

    return {
      open: openIssues.length,
      closed: closedIssues.length,
      total: issueSearch.total_count,
    }
  }

  async getPullRequests(owner: string, repo: string) {
    const { data: openPRs } = await this.octokit.pulls.list({
      owner,
      repo,
      state: 'open',
      per_page: 1,
    })

    const { data: closedPRs } = await this.octokit.pulls.list({
      owner,
      repo,
      state: 'closed',
      per_page: 1,
    })

    const { data: mergedPRs } = await this.octokit.search.issuesAndPullRequests({
      q: `repo:${owner}/${repo} is:pr is:merged`,
      per_page: 1,
    })

    return {
      open: openPRs.length,
      merged: mergedPRs.total_count,
      total: closedPRs.length + openPRs.length,
    }
  }

  async getReleases(owner: string, repo: string) {
    const { data } = await this.octokit.repos.listReleases({
      owner,
      repo,
      per_page: 10,
    })

    return data
  }

  async getRepositoryMetrics(owner: string, repo: string): Promise<RepositoryMetrics> {
    const [
      repository,
      contributors,
      commitActivity,
      recentCommits,
      issues,
      pullRequests,
      releases,
    ] = await Promise.all([
      this.getRepository(owner, repo),
      this.getContributors(owner, repo),
      this.getCommitActivity(owner, repo),
      this.getRecentCommits(owner, repo, 30),
      this.getIssues(owner, repo),
      this.getPullRequests(owner, repo),
      this.getReleases(owner, repo),
    ])

    const communityHealth = {
      hasWiki: repository.has_wiki,
      hasIssues: repository.has_issues,
      hasProjects: repository.has_projects,
      hasDiscussions: repository.has_discussions,
      isArchived: repository.archived,
    }

    return {
      repository,
      contributors,
      commitActivity,
      recentCommits,
      issues,
      pullRequests,
      releases,
      communityHealth,
    }
  }

  async searchRepositories(query: string, limit: number = 10) {
    const { data } = await this.octokit.search.repos({
      q: query,
      per_page: limit,
      sort: 'stars',
      order: 'desc',
    })

    return data.items
  }

  async getUserRepositories(username: string) {
    const { data } = await this.octokit.repos.listForUser({
      username,
      per_page: 100,
      sort: 'updated',
      direction: 'desc',
    })

    return data
  }

  async getOrganizationRepositories(org: string) {
    const { data } = await this.octokit.repos.listForOrg({
      org,
      per_page: 100,
      sort: 'updated',
      direction: 'desc',
    })

    return data
  }
}

// Helper function to extract owner and repo from GitHub URL
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?$/,
    /github\.com\/([^\/]+)\/([^\/]+)\/?$/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return { owner: match[1], repo: match[2].replace(/\.git$/, '') }
    }
  }

  return null
}