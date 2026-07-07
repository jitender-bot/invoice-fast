import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // To prevent user enumeration, we return success even if user doesn't exist,
    // but we can log it or handle OAuth-only accounts specifically.
    if (!user) {
      return NextResponse.json({
        message: "If your email is registered, you will receive a reset link shortly.",
      });
    }

    if (user.passwordHash === null) {
      return NextResponse.json(
        { error: "This email is registered via Google sign-in. Please sign in with Google." },
        { status: 400 }
      );
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour expiration

    // Save token to DB
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Send transactional email
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "InvoiceFast <onboarding@resend.dev>",
        to: user.email,
        subject: "Reset Your Password - InvoiceFast",
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-md">
            <h2 style="font-size: 20px; font-weight: bold; color: #1e293b; margin-bottom: 16px;">Password Reset Request</h2>
            <p style="font-size: 14px; color: #475569; line-height: 1.5; margin-bottom: 24px;">
              You requested a password reset for your InvoiceFast account. Click the button below to set a new password. This link is valid for 1 hour.
            </p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 18px; font-weight: 600; text-decoration: none; border-radius: 6px; font-size: 14px;">
              Reset Password
            </a>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 32px; border-t: 1px solid #f1f5f9; padding-top: 16px;">
              If you did not request this reset, you can safely ignore this email.
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Resend email sending failed:", emailErr);
      return NextResponse.json(
        { error: "Failed to send reset email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "If your email is registered, you will receive a reset link shortly.",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Lookup token
    const dbToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!dbToken) {
      return NextResponse.json({ error: "Invalid password reset token" }, { status: 400 });
    }

    // Check expiration
    if (new Date() > dbToken.expiresAt) {
      return NextResponse.json({ error: "Reset token has expired" }, { status: 400 });
    }

    // Check usage
    if (dbToken.usedAt !== null) {
      return NextResponse.json({ error: "Reset token has already been used" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and mark token used in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: dbToken.userId },
        data: { passwordHash: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { token },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password confirm error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
