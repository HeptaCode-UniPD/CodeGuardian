export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
import * as Types from '../types/types';

export async function getRepositoriesPayload (id: string) {
    const [repositories] = await Promise.all([
        getRepositoriesByUser(id),
    ]);

    return repositories ?? [];
};

async function getRepositoriesByUser(id: string): Promise<Types.Repository[] | undefined> {
  return new Promise((resolve) => {
    const found = Types.mock_repositories.filter(item => 
      Array.isArray(item.userID) ? item.userID.includes(id) : item.userID === id);
    resolve(found);
  });
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function checkRepoValid(url: string) {
  // const response = await fetch(`${API_URL}/check-privacy`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ repoUrl: url }),
  // });

  // if (!response.ok) throw new Error('Errore server');
  
  // return response.json(); 
  await delay(1000);
  const isValid = url.toLowerCase().includes("github.com");
  return { isValid };
}

export async function checkRepoPrivacy(url: string) {
  // const response = await fetch(`${API_URL}/check-privacy`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ repoUrl: url }),
  // });

  // if (!response.ok) throw new Error('Errore server');
  // return response.json(); 

  await delay(1000);
  const isPrivate = url.toLowerCase().includes("private") || url.toLowerCase().includes("secret");
  return { isPrivate };
}

export async function checkRepoToken(url: string, token: string) {
  // const response = await fetch(`${API_URL}/verify-token`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ repoUrl: url, githubToken: token }),
  // });

  // return response.json();

  await delay(1000);
  const isValid = token === "12345";
  return { isValid };
}