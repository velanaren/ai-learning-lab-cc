import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import crypto from "crypto";
import { cookies } from "next/headers";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "GitHub OAuth not configured" }, { status: 500 });
  }

  // Generate a state parameter for CSRF protection
  const state = crypto.randomBytes(32).toString("hex");

  // Store state in a cookie (expires in 10 minutes)
  const cookieStore = await cookies();
  cookieStore.set("github_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
  });

  // GitHub OAuth scopes for evidence import
  // repo:status - Access commit status
  // repo - Full control of private repositories (needed to read commits)
  const scopes = ["repo", "read:user"];

  const redirectUri = `${process.env.NEXTAUTH_URL}/api/github/callback`;

  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", clientId);
  githubAuthUrl.searchParams.set("redirect_uri", redirectUri);
  githubAuthUrl.searchParams.set("scope", scopes.join(" "));
  githubAuthUrl.searchParams.set("state", state);

  return NextResponse.redirect(githubAuthUrl.toString());
}
