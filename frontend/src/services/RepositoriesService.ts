export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
import {getUserID} from './SessionService';
import * as Types from '../types/types';
import * as Mock from '../test/mock';

export async function getRepositoriesByUser(id: string): Promise<Types.Repository[] | undefined> {
  const repositories = Mock.mock_repositories.filter(item => 
    Array.isArray(item.userID) ? item.userID.includes(id) : item.userID === id);
  return repositories;
};


export async function checkRepoAccess(url: string): Promise<boolean> {

  const idUtente = getUserID('userID');
  const res = await fetch("http://localhost:3000/repo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({idUtente, url}),
    });

  if (!res.ok) {
    throw new Error("URL non valido");
  }

  return true;
}