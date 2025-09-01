const API_BASE = "http://localhost:8008/users";
export const fetchUser = async () => {
    try {

        const res = await fetch(API_BASE, {
            method: 'GET'
        })
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.log('Error Fetching Users', error);

        return [];

    }
    finally {
        console.log('Get Request Completed')
    }
}
export const createUser = async (id: string,
    name: string,
    email: string,
    age: number,
    role: string,
    image_url: string) => {
    try {
        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, name, email, age, role, image_url }),
        });
        const newUser = await res.json();
        return newUser;

    }
    catch (error) {
        console.error("Error creating user:", error);
        return null;

    }
    finally {
        console.log("POST request completed ");
    }
}
export const updateUser = async (id: string,
    name: string,
    email: string,
    age: number,
    role: string,
    image_url: string) => {
    try {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, age, role, image_url }),
        });
        const result = await res.json();
        return result;

    }
    catch (error) {
        console.error("Error updating user:", error);
        return null;
    }
    finally {
        console.log("PUT request completed ");
    }
}
// const patchUser = async (id: Number, fields: Partial<{ name: string, email: string }>) => {
//     try {
//         const res = await fetch("api/user", {
//             method: "PATCH",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ userId: id, ...fields }),
//         });
//         const result = await res.json();
//         return result;

//     }
//     catch (error) {
//         console.error("Error updating user:", error);
//         return null;
//     }
//     finally {
//         console.log("PUT request completed ");
//     }

// }
export const deleteUser = async (id: string) => {
    try {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete user");

        const result = await res.json();
        console.log("User deleted:", result);
        return result;
    } catch (error) {
        console.error("Error deleting user:", error);
        return null;
    } finally {
        console.log("DELETE request completed ");
    }
};
