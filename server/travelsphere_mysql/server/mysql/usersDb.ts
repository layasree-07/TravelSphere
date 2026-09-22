import { pool } from './db';

export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    created_at: string;
}

export async function createUser(
    name: string,
    email: string,
    passwordHash: string
): Promise<User> {

    const [result] = await pool.execute(
        `INSERT INTO users (name, email, password_hash)
         VALUES (?, ?, ?)`,
        [name, email, passwordHash]
    );

    const insertId = (result as any).insertId;

    const [rows] = await pool.execute(
        `SELECT id, name, email, password_hash, created_at
         FROM users
         WHERE id = ?`,
        [insertId]
    );

    return (rows as User[])[0];
}

export async function findUserByEmail(
    email: string
): Promise<User | null> {

    const [rows] = await pool.execute(
        `SELECT id, name, email, password_hash, created_at
         FROM users
         WHERE email = ?`,
        [email]
    );

    const users = rows as User[];

    if (users.length === 0) {
        return null;
    }

    return users[0];
}
