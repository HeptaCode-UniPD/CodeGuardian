export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
import * as Types from '../types/types';
import * as Mock from '../test/mock';

export async function getInfoUserByID(id: string): Promise<Types.User | undefined> {
  return new Promise((resolve) => {
    const found = Mock.mock_user.find(item => item.userId === id);
    resolve(found);
  });
};

export async function checkCredentials(email: string, password: string): Promise<Types.User> {
  const res = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    });

  if (!res.ok) {
    throw new Error("Credenziali non valide");
  }

  const data = await res.json();
  return data;
}
