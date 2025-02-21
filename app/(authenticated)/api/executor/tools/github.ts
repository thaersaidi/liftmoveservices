// GITHUB FUNCTIONS
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// const octokit = new Octokit({
//   authStrategy: createAppAuth,
//   auth: {
//     appId: process.env.GITHUB_APP_ID || 0,
//     privateKey: cert,
//     installationId: process.env.GITHUB_INSTALLATION_ID || 0,
//   },
// });


// List items in repo
export const list_repo_items = async (owner, repo, path) => {
  try {
      const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path,
      });

      if (!data) {
          console.warn(`No content returned for ${owner}/${repo}/${path}`);
          return null;
      }

      if (Array.isArray(data)) {
          return data.map(item => ({
              name: item.name,
              path: item.path,
              type: item.type,
          }));
      } else {
          return {
              name: data.name,
              path: data.path,
              type: data.type,
              content: Buffer.from(data.content, 'base64').toString('utf8'),
          };
      }
  } catch (error) {
      console.error(`Error reading file or directory at ${owner}/${repo}/${path}:`, error.message);
      return null;  // Ensure that all error cases return null
  }
};

  
  // Get Issues
  export const get_issues = async (owner: string, repo: string) => {
    try {
      const { data } = await octokit.issues.listForRepo({
        owner,
        repo,
      });
      return data;
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };
  
  // Get Issue
  export const get_issue = async (owner: string, repo: string, issue_number: number) => {
    try {
      const { data } = await octokit.issues.get({
        owner,
        repo,
        issue_number,
      });
      return data;
    } catch (error) {
      console.error("Error fetching issue:", error);
    }
  };
  
  // Comment on Issue
  export const comment_on_issue = async (owner: string, repo: string, issue_number: number, body: string) => {
    try {
      const { data } = await octokit.issues.createComment({
        owner,
        repo,
        issue_number,
        body,
      });
      return data;
    } catch (error) {
      console.error("Error commenting on issue:", error);
    }
  };
  
  // Create Pull Request
  export const create_pull_request = async (owner: string, repo: string, head: string, base: string, title: string, body?: string) => {
    try {
      const { data } = await octokit.pulls.create({
        owner,
        repo,
        head,
        base,
        title,
        body,
      });
      return data;
    } catch (error) {
      console.error("Error creating pull request:", error);
    }
  };
  
  // Create File
  export const create_repo_file = async (owner: string, repo: string, path: string, message: string, content: string) => {
    try {
      const { data } = await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString('utf-8'),
      });
      return data;
    } catch (error) {
      console.error("Error creating file:", error);
    }
  };
  
  // Read File
  export const read_repo_file = async (owner: string, repo: string, path: string) => {
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });
      if ('content' in data) {
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        return data;
      } else {
        throw new Error("File content is not readable.");
      }
    } catch (error) {
      if (error.status === 404) {
        console.error(`Error: File not found at ${path}`);
        return null; // Return null if the file is not found
      } else {
        console.error("Error reading file:", error);
        throw error; // Rethrow other errors for proper handling
      }
    }
  }
  
  // Update File
  export const update_repo_file = async (owner: string, repo: string, path: string, message: string, content: string, sha: string) => {
    try {
      const sha = await getFileSha(owner, repo, path);
      const { data } = await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString('utf-8'),
        sha,
      });
      return data;
    } catch (error) {
      console.error("Error updating file:", error);
    }
  };
  
  async function getFileSha(owner: string, repo: string, path: string) {
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path
      });
      return data.sha;
    } catch (error) {
      console.error("Error getting file SHA:", error);
    }
  }
  
  // Delete File
  export const delete_repo_file = async (owner: string, repo: string, path: string, message: string, sha: string) => {
    try {
      const { data } = await octokit.repos.deleteFile({
        owner,
        repo,
        path,
        message,
        sha,
      });
      return data;
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };
  