// Projects page: file-explorer view of GitHub repos, fetched server-side and cached hourly.
import ProjectsExplorer, { Repo } from "./ProjectsExplorer";

export const revalidate = 3600;

const GITHUB_URL =
  "https://api.github.com/users/kjmutsch/repos?per_page=100&sort=updated";

async function fetchRepos(): Promise<Repo[]> {
  try {
    const res = await fetch(GITHUB_URL, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "kjmutsch-personal-site",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as Array<Record<string, unknown>>;
    return data
      .filter((r) => !r.fork)
      .map((r) => ({
        id: r.id as number,
        name: r.name as string,
        description: (r.description as string | null) ?? null,
        html_url: r.html_url as string,
        homepage: (r.homepage as string | null) ?? null,
        language: (r.language as string | null) ?? null,
        stargazers_count: (r.stargazers_count as number) ?? 0,
        updated_at: r.updated_at as string,
      }));
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const repos = await fetchRepos();
  return <ProjectsExplorer repos={repos} />;
}
