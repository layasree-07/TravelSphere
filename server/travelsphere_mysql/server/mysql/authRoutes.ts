import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import {
    createUser,
    findUserByEmail,
    verifyUserEmail,
    updateUserOtp
} from './usersDb';

import { sendOtpEmail } from './emailService';

const router = Router();

const JWT_SECRET: string =
    process.env.JWT_SECRET || (() => {
        throw new Error('JWT_SECRET is missing in .env');
    })();

function generateOtp(): string {
    return crypto.randomInt(100000, 1000000).toString();
}

function createToken(userId: number, email: string): string {
    return jwt.sign(
        {
            id: userId,
            email: email
        },
        JWT_SECRET,
        {
            expiresIn: '7d'
        }
    );
}

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email and password are required'
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (cleanName.length < 2) {
            return res.status(400).json({
                message: 'Name must contain at least 2 characters'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must contain at least 8 characters'
            });
        }

        const existingUser = await findUserByEmail(cleanEmail);

        if (existingUser) {
            if (existingUser.email_verified) {
                return res.status(409).json({
                    message: 'Email already registered'
                });
            }

            return res.status(409).json({
                message:
                    'Email verification is already pending. Please use resend OTP.'
            });
        }

        const otp = generateOtp();

        const otpHash = await bcrypt.hash(
            otp,
            10
        );

        const otpExpiresAt = new Date(
            Date.now() + 5 * 60 * 1000
        );

        const passwordHash = await bcrypt.hash(
            password,
            10
        );

        const user = await createUser(
            cleanName,
            cleanEmail,
            passwordHash,
            otpHash,
            otpExpiresAt
        );

        await sendOtpEmail(
            cleanEmail,
            otp
        );

        return res.status(201).json({
            message:
                'OTP sent to your email. Please verify your email.',
            email: user.email
        });

    } catch (error) {
        console.error('Registration error:', error);

        return res.status(500).json({
            message: 'Registration failed'
        });
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: 'Email and OTP are required'
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const user = await findUserByEmail(
            cleanEmail
        );

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (user.email_verified) {
            return res.status(400).json({
                message: 'Email is already verified'
            });
        }

        if (!user.otp_hash || !user.otp_expires_at) {
            return res.status(400).json({
                message: 'OTP is invalid or has expired'
            });
        }

        const expiryTime = new Date(
            user.otp_expires_at
        ).getTime();

        if (Date.now() > expiryTime) {
            return res.status(400).json({
                message:
                    'OTP has expired. Please request a new OTP.'
            });
        }

        const otpMatch = await bcrypt.compare(
            otp.toString(),
            user.otp_hash
        );

        if (!otpMatch) {
            return res.status(400).json({
                message: 'Invalid OTP'
            });
        }

        await verifyUserEmail(user.id);

        const token = createToken(
            user.id,
            user.email
        );

        return res.json({
            message:
                'Email verified successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(
            'OTP verification error:',
            error
        );

        return res.status(500).json({
            message:
                'OTP verification failed'
        });
    }
});

router.post('/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required'
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const user = await findUserByEmail(
            cleanEmail
        );

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (user.email_verified) {
            return res.status(400).json({
                message: 'Email is already verified'
            });
        }

        const otp = generateOtp();

        const otpHash = await bcrypt.hash(
            otp,
            10
        );

        const otpExpiresAt = new Date(
            Date.now() + 5 * 60 * 1000
        );

        await updateUserOtp(
            user.id,
            otpHash,
            otpExpiresAt
        );

        await sendOtpEmail(
            cleanEmail,
            otp
        );

        return res.json({
            message:
                'New OTP sent to your email'
        });

    } catch (error) {
        console.error(
            'Resend OTP error:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to resend OTP'
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message:
                    'Email and password are required'
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const user = await findUserByEmail(
            cleanEmail
        );

        if (!user) {
            return res.status(401).json({
                message:
                    'Invalid email or password'
            });
        }

        if (!user.email_verified) {
            return res.status(403).json({
                message:
                    'Please verify your email before logging in'
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password_hash
            );

        if (!passwordMatch) {
            return res.status(401).json({
                message:
                    'Invalid email or password'
            });
        }

        const token = createToken(
            user.id,
            user.email
        );

        return res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(
            'Login error:',
            error
        );

        return res.status(500).json({
            message: 'Login failed'
        });
    }
});

export default router;

