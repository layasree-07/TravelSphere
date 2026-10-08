import { pool } from './db';

export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    email_verified: boolean;
    otp_hash: string | null;
    otp_expires_at: string | null;
    created_at: string;
}

export async function createUser(
    name: string,
    email: string,
    passwordHash: string,
    otpHash: string,
    otpExpiresAt: Date
): Promise<User> {

    const [result] = await pool.execute(
        `INSERT INTO users
        (name, email, password_hash, email_verified, otp_hash, otp_expires_at)
        VALUES (?, ?, ?, FALSE, ?, ?)`,
        [
            name,
            email,
            passwordHash,
            otpHash,
            otpExpiresAt
        ]
    );

    const insertId = (result as any).insertId;

    const [rows] = await pool.execute(
        `SELECT id, name, email, password_hash,
                email_verified, otp_hash, otp_expires_at, created_at
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
        `SELECT id, name, email, password_hash,
                email_verified, otp_hash, otp_expires_at, created_at
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

export async function verifyUserEmail(
    userId: number
): Promise<void> {

    await pool.execute(
        `UPDATE users
         SET email_verified = TRUE,
             otp_hash = NULL,
             otp_expires_at = NULL
         WHERE id = ?`,
        [userId]
    );
}

export async function updateUserOtp(
    userId: number,
    otpHash: string,
    otpExpiresAt: Date
): Promise<void> {

    await pool.execute(
        `UPDATE users
         SET otp_hash = ?,
             otp_expires_at = ?
         WHERE id = ?`,
        [
            otpHash,
            otpExpiresAt,
            userId
        ]
    );
}
