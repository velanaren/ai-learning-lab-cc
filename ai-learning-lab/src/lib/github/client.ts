import { Octokit } from "@octokit/rest";

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  updatedAt: string;
  private: boolean;
  language: string | null;
}

export interface GitHubCommit {
  id: string; // sha
  title: string; // commit message first line
  message: string; // full commit message
  repo: string; // full name (owner/repo)
  date: string;
  url: string;
  author: string | null;
}

export interface GitHubPullRequest {
  id: number;
  title: string;
  repo: string;
  date: string;
  url: string;
  state: "open" | "closed" | "merged";
  number: number;
}

export class GitHubClient {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({ auth: accessToken });
  }

  async getAuthenticatedUser() {
    const { data } = await this.octokit.users.getAuthenticated();
    return data;
  }

  async listRepos(): Promise<GitHubRepo[]> {
    const { data } = await this.octokit.repos.listForAuthenticatedUser({
      sort: "updated",
      per_page: 100,
      type: "all",
    });

    return data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      htmlUrl: repo.html_url,
      updatedAt: repo.updated_at || new Date().toISOString(),
      private: repo.private,
      language: repo.language,
    }));
  }

  async getCommits(owner: string, repo: string, limit = 50): Promise<GitHubCommit[]> {
    try {
      const { data } = await this.octokit.repos.listCommits({
        owner,
        repo,
        per_page: limit,
      });

      return data.map((commit) => ({
        id: commit.sha,
        title: commit.commit.message.split("\n")[0],
        message: commit.commit.message,
        repo: `${owner}/${repo}`,
        date: commit.commit.author?.date || new Date().toISOString(),
        url: commit.html_url,
        author: commit.commit.author?.name || null,
      }));
    } catch (error) {
      console.error(`Error fetching commits for ${owner}/${repo}:`, error);
      return [];
    }
  }

  async getPullRequests(owner: string, repo: string, limit = 50): Promise<GitHubPullRequest[]> {
    try {
      const { data } = await this.octokit.pulls.list({
        owner,
        repo,
        state: "all",
        sort: "updated",
        direction: "desc",
        per_page: limit,
      });

      return data.map((pr) => ({
        id: pr.id,
        title: pr.title,
        repo: `${owner}/${repo}`,
        date: pr.updated_at,
        url: pr.html_url,
        state: pr.merged_at ? "merged" : (pr.state as "open" | "closed"),
        number: pr.number,
      }));
    } catch (error) {
      console.error(`Error fetching PRs for ${owner}/${repo}:`, error);
      return [];
    }
  }

  async getAllCommitsFromRepos(repoNames: string[], limit = 50): Promise<GitHubCommit[]> {
    const allCommits: GitHubCommit[] = [];

    for (const repoFullName of repoNames) {
      const [owner, repo] = repoFullName.split("/");
      if (owner && repo) {
        const commits = await this.getCommits(owner, repo, Math.ceil(limit / repoNames.length));
        allCommits.push(...commits);
      }
    }

    // Sort by date descending
    allCommits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return allCommits.slice(0, limit);
  }

  async getAllPullRequestsFromRepos(repoNames: string[], limit = 50): Promise<GitHubPullRequest[]> {
    const allPRs: GitHubPullRequest[] = [];

    for (const repoFullName of repoNames) {
      const [owner, repo] = repoFullName.split("/");
      if (owner && repo) {
        const prs = await this.getPullRequests(owner, repo, Math.ceil(limit / repoNames.length));
        allPRs.push(...prs);
      }
    }

    // Sort by date descending
    allPRs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return allPRs.slice(0, limit);
  }
}
