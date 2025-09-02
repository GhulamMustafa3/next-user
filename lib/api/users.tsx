const API_BASE = "http://localhost:8008/api/users";


const getToken = () => localStorage.getItem("token") || "";


export const fetchUser = async () => {
  try {
    const res = await fetch(API_BASE, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await res.json();
    return Array.isArray(data) ? data : []; 
  } catch (error) {
    console.error("Error Fetching Users", error);
    return [];
  } finally {
    console.log("GET /api/users completed");
  }
};





export const createUser = async (
  id: string,
  name: string,
  email: string,
  age: number,
  role: string,
  image_url: string
) => {
  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name, email, age, role, image_url }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  } finally {
    console.log("POST /api/users completed");
  }
};


export const updateUser = async (
  id: string,
  name: string,
  email: string,
  age: number,
  role: string,
  image_url: string
) => {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ name, email, age, role, image_url }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  } finally {
    console.log(`PUT /api/users/${id} completed`);
  }
};


export const deleteUser = async (id: string) => {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!res.ok) throw new Error("Failed to delete user");

    const data = await res.json();
    console.log("User deleted:", data);
    return data;
  } catch (error) {
    console.error("Error deleting user:", error);
    return null;
  } finally {
    console.log(`DELETE /api/users/${id} completed`);
  }
};
export const fetchSessions = async () => {
  try {
    const res = await fetch("http://localhost:8008/api/sessions", {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
};
