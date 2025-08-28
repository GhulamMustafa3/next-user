"use client";

import { useState, useEffect } from "react";
interface UserFormProps {
  initialData?: {
    name: string;
    email: string;
    role: string;
    imageUrl: string;
  };
  onSubmit: (data: any) => void;
  isEdit: boolean;
}

export default function UserForm({ initialData, onSubmit, isEdit }:UserFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        imageUrl: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                role: initialData.role.toLowerCase(),
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4"
        >
            <h2 className="text-xl font-bold">{isEdit ? "Edit User" : "Add User"}</h2>

            <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-lg"
                    placeholder="Enter full name"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-lg"
                    placeholder="Enter email address"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Role</label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-lg"
                    required
                >
                    <option value="">Select role</option>
                    <option value="manager">Manager</option>
                    <option value="developer">Developer</option>
                    <option value="designer">Designer</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium">Profile Image URL</label>
                <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-lg"
                    placeholder="https://example.com/profile.jpg"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
                {isEdit ? "Update User" : "Save User"}
            </button>
        </form>
    );
}
