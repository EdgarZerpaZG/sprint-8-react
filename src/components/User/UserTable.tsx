import React from "react";
import type { PropsTable } from "../../types/userTypes";

const UserTable: React.FC<PropsTable> = ({ users, onEdit, onDelete }) => {
  return (
    <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
      <thead className="bg-indigo-500 text-white">
        <tr>
          <th className="py-3 px-4 text-left">Username</th>
          <th className="py-3 px-4 text-left">Name</th>
          <th className="py-3 px-4 text-left">Last Name</th>
          <th className="py-3 px-4 text-left">Email</th>
          <th className="py-3 px-4 text-left">Location</th>
          <th className="py-3 px-4 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user._id ?? user.email}
            className="text-black border-b hover:bg-gray-100">
            <td className="py-2 px-4">{user.username}</td>
            <td className="py-2 px-4">{user.name}</td>
            <td className="py-2 px-4">{user.lastname}</td>
            <td className="py-2 px-4">{user.email}</td>
            <td className="py-2 px-4">{user.location}</td>
            <td className="py-2 px-4">
              <button
                onClick={() => onEdit(user)}
                className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 w-full mb-3 cursor-pointer">
                Edit
              </button>
              <button
                onClick={() => user._id && onDelete(user._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 w-full cursor-pointer">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;