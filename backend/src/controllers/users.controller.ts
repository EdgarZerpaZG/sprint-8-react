import { Request, Response } from "express";
import { getDB } from "../db";
import { ObjectId } from "mongodb";
import { CreateUserDTO, User } from "../types/userTypes";

// Obtener todos los usuarios
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getDB().collection<User>("users").find().toArray();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await getDB()
      .collection<User>("users")
      .findOne({ _id: new ObjectId(id) });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un usuario
export const createUser = async (req: Request, res: Response) => {
  try {
    const data: CreateUserDTO = req.body;

    // Evitar enviar _id desde el frontend
    const { _id, ...userData } = data;

    const newUser: User = {
      ...userData,
      createdAt: new Date(),
    };

    const result = await getDB().collection<User>("users").insertOne(newUser);

    res.status(201).json({ message: "User created", id: result.insertedId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un usuario
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Evitar actualizar _id accidentalmente
    const { _id, ...updateData } = req.body;

    const result = await getDB()
      .collection<User>("users")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un usuario
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const result = await getDB()
      .collection<User>("users")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};