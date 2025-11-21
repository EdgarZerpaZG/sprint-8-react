// src/components/UserForm.tsx
import React, { useState, useEffect } from "react";
import type { User, PropsForm } from "../../types/userTypes";

const emptyUser: User = {
  username: "",
  name: "",
  lastname: "",
  email: "",
  location: "",
};

const UserForm: React.FC<PropsForm> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<User>(emptyUser);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(emptyUser);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">{initialData ? "Edit User" : "Create User"}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="username" className="block text-gray-600 font-medium mb-1">Username</label>
          <input
            name="username"
            placeholder="Username"
            value={formData.username ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-gray-600 font-medium mb-1">Name</label>
          <input
            name="name"
            placeholder="Name"
            value={formData.name ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="lastname" className="block text-gray-600 font-medium mb-1">Last Name</label>
          <input
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-600 font-medium mb-1">Email</label>
          <input
            name="email"
            placeholder="Email"
            value={formData.email ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="location" className="block text-gray-600 font-medium mb-1">Location</label>
          <input
            name="location"
            placeholder="Location"
            value={formData.location ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
      >
        {initialData ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default UserForm;