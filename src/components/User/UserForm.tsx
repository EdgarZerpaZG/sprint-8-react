import React from "react";
import type { PropsForm } from "../../types/userTypes";
import { useUserForm } from "../../hooks/useUserForm";

const UserForm: React.FC<PropsForm> = ({ initialData, onSubmit }) => {
  const { formData, handleChange, handleSubmit, isEditMode } =
    useUserForm(initialData, onSubmit);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">
        {isEditMode ? "Edit User" : "Create User"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <input
            name="username"
            placeholder="Username"
            value={formData.username ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"/>
        </div>
        <div>
          <input
            name="name"
            placeholder="Name"
            value={formData.name ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"/>
        </div>
        <div>
          <input
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"/>
        </div>
        <div>
          <input
            name="email"
            placeholder="Email"
            value={formData.email ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"/>
        </div>
        <div className="sm:col-span-2">
          <input
            name="location"
            placeholder="Location"
            value={formData.location ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"/>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition cursor-pointer">
          {isEditMode ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default UserForm;