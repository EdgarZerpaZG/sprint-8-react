const API_URL = "http://localhost:4000/api/users";

export const getUsers = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const getUserById = async (id: string) => {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
};

export const createUser = async (user: any) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return res.json();
};

export const updateUser = async (id: string, user: any) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return res.json();
};

export const deleteUser = async (id: string) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return res.json();
};