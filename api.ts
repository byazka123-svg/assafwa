import { AUTH_URL, API_URL } from './constants';

export const signupUser = async (userData: any) => {
  const response = await fetch(`${AUTH_URL}/local/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const loginUser = async (credentials: any) => {
  const response = await fetch(`${AUTH_URL}/local`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

export const getMe = async (jwt: string) => {
  const response = await fetch(`${API_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
  });
  return response.json();
};
