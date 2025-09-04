"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface User {
  id?: string;
  name: string;
  email: string;
  age: number;
  role: string;
  image_url: string;
}

interface UserFormProps {
  initialData?: User; // <-- add this
  onSubmit: (data: User) => void;
  isEdit: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  age?: string;
  role?: string;
  image_url?: string;
}

export default function UserForm({ initialData, onSubmit, isEdit }: UserFormProps) {
  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    age: 18,
    role: "",
    image_url: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name ?? "",
        email: initialData.email ?? "",
        age: initialData.age ?? 18,
        role: initialData.role?.toLowerCase() ?? "",
        image_url: initialData.image_url ?? "",
      });
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.age || formData.age < 18) newErrors.age = "Age must be 18+";
    if (!formData.role) newErrors.role = "Role is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">{isEdit ? "Edit User" : "Add User"}</h2>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        className="w-full p-2 border rounded"
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full p-2 border rounded"
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
        placeholder="Age"
        min={18}
        className="w-full p-2 border rounded"
      />
      {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}

      <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="">Select role</option>
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
        <option value="developer">Developer</option>
        <option value="designer">Designer</option>
        <option value="user">User</option>
      </select>
      {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}

      <input
        type="url"
        name="image_url"
        value={formData.image_url || ""}
        onChange={handleChange}
        placeholder="Profile Image URL"
        className="w-full p-2 border rounded"
      />

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        {isEdit ? "Update User" : "Add User"}
      </button>
    </form>
  );
}
