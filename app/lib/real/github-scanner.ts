// app/lib/real/github-scanner.ts
export async function scanRealRepo(repoUrl: string) {
  const match = repoUrl.match(/github\.com\/([^\/]+\/[^\/]+)/);
  if (!match) return null;
  
  const [owner, repo] = match[1].split('/');
  
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` }
  });
  
  const data = await response.json();
  
  return {
    name: data.full_name,
    stars: data.stargazers_count,
    forks: data.forks_count,
    language: data.language,
    size: data.size, // KB
    lastUpdated: data.updated_at
  };
}