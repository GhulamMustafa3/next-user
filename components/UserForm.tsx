"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface UserFormProps {
  initialData?: {
    name: string;
    email: string;
    age: number;
    role: string;
    image_url: string;
  };
  onSubmit: (data: any) => void;
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: 18,
    role: "",
    image_url: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        role: initialData.role.toLowerCase(),
      });
    }
  }, [initialData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    const nameRegex = /^[A-Za-z\s]{3,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|io|pk)$/i;
    const urlRegex = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name = "Name must be at least 3 letters and only alphabets";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.age || formData.age < 18) {
      newErrors.age = "Age must be 18 or above";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    if (formData.image_url.trim() && !urlRegex.test(formData.image_url)) {
      newErrors.image_url = "Enter a valid URL (http/https)";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold">
        {isEdit ? "Edit User" : "Add User"}
      </h2>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-lg"
          placeholder="Enter full name"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-lg"
          placeholder="Enter email address"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      {/* Age */}
      <div>
        <label className="block text-sm font-medium">Age</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-lg"
          min={18}
        />
        {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-lg"
        >
          <option value="">Select role</option>
          <option value="manager">Manager</option>
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
      </div>

      {/* Profile Image URL */}
      <div>
        <label className="block text-sm font-medium">Profile Image URL</label>
        <input
          type="url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-lg"
          placeholder="https://example.com/profile.jpg"
        />
        {errors.image_url && (
          <p className="text-red-500 text-sm">{errors.image_url}</p>
        )}
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
