// src/api.js
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4444/api';

export function useSearchProfiles(q) {
  return useQuery({
    queryKey: ['searchProfiles', q],
    queryFn: async () => {
      if (!q) return [];
      const res = await axios.get(`${API_URL}/users/search`, { params: { q } });
      return res.data.users || [];
    },
    enabled: !!q,
  });
}

export function useSearchRepos(q) {
  return useQuery({
    queryKey: ['searchRepos', q],
    queryFn: async () => {
      if (!q) return [];
      const res = await axios.get(`${API_URL}/repos/search`, { params: { q } });
      return res.data.repositories || [];
    },
    enabled: !!q,
  });
}

export function useUserRepos(username, { filterByName, sortBy } = {}) {
  return useQuery({
    queryKey: ['userRepos', username, filterByName, sortBy],
    queryFn: async () => {
      if (!username) return [];
      const res = await axios.get(`${API_URL}/repos/${username}`, { params: { filterByName, sortBy } });
      return res.data.repositories || [];
    },
    enabled: !!username,
  });
}

export function useRepoCommitActivity(owner, repo) {
  return useQuery({
    queryKey: ['commitActivity', owner, repo],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/commits/${owner}/${repo}/activity`);
      return res.data.activity || [];
    },
    enabled: !!owner && !!repo,
  });
}

export function useRepoContributors(owner, repo) {
  return useQuery({
    queryKey: ['contributors', owner, repo],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/contributors/${owner}/${repo}`);
      return res.data.contributors || [];
    },
    enabled: !!owner && !!repo,
  });
}

export function useRepoDetails(owner, repo) {
  return useQuery({
    queryKey: ['repoDetails', owner, repo],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/details/${owner}/${repo}`);
      return {
        readmeHtml: res.data.readme,
        commits: res.data.commits,
        openIssues: res.data.open_issues,
      };
    },
    enabled: !!owner && !!repo,
  });
}

export function useRepoTree(owner, repo, branch = 'main') {
  return useQuery({
    queryKey: ['repoTree', owner, repo, branch],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/github/tree`, {
        params: { owner, repo, branch },
      });
      return res.data.tree || [];
    },
    enabled: !!owner && !!repo,
  });
}

export function useFileContent(owner, repo, path, branch = 'main') {
  return useQuery({
    queryKey: ['fileContent', owner, repo, path, branch],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/file/content`, {
        params: { owner, repo, path, branch },
      });
      return res.data.content || '';
    },
    enabled: !!owner && !!repo && !!path,
  });
}

export function useAskAI(owner, repo, path, branch, promptText) {
  return useQuery({
    queryKey: ['askAI', owner, repo, path, branch, promptText],
    queryFn: async () => {
      if (!path || !promptText) return null;
      const res = await axios.get(`${API_URL}/ai/ask`, {
        params: { owner, repo, path, branch, prompt: promptText },
      });
      return res.data.response || {};
    },
    enabled: !!owner && !!repo && !!path && !!promptText,
  });
}


export const useUserDetails = (username) => {
  return useQuery({
    queryKey: ['user-details', username],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/users/${username}`);
      return data.user;
    },
    enabled: !!username, // prevents running if username is falsy
  });
};