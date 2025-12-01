import { useEffect, useState } from "react";
import type { User } from "../types/userTypes";

const emptyUser: User = {
  username: "",
  name: "",
  lastname: "",
  email: "",
  location: "",
};

export function useUserForm(initialData?: User | null, onSubmit?: (user: User) => void) {
  const [formData, setFormData] = useState<User>(emptyUser);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(emptyUser);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    setFormData(emptyUser);
  };

  const isEditMode = Boolean(initialData);

  return {
    formData,
    handleChange,
    handleSubmit,
    isEditMode,
  };
}