import { ObjectId } from "mongodb";

export interface User {
  _id?: string | ObjectId;
  username: string;
  name: string;
  lastname: string;
  email: string;
  location: string;
  createdAt?: Date;
}

export interface CreateUserDTO {
  _id?: string | ObjectId;
  username: string;
  name: string;
  lastname: string;
  email: string;
  location: string;
}