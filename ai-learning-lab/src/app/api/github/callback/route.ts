import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { encryptToken } from "@/lib/github/encryption";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Handle OAuth errors
  if (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/settings/github?error=oauth_error`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/settings/github?error=missing_params`
    );
  }

  // Verify state parameter
  const cookieStore = await cookies();
  const storedState = cookieStore.get("github_oauth_state")?.value;

  if (!storedState || storedState !== state) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/settings/github?error=invalid_state`
    );
  }

  // Clear the state cookie
  cookieStore.delete("github_oauth_state");

  // Get authenticated user
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/login?callbackUrl=/settings/github`
    );
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/login?callbackUrl=/settings/github`
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/github/callback`,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("GitHub token exchange error:", tokenData);
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/settings/github?error=token_exchange`
      );
    }

    const { access_token, scope } = tokenData;

    // Encrypt the access token before storing
    const encryptedToken = encryptToken(access_token);

    // Store or update GitHubConnection
    await prisma.gitHubConnection.upsert({
      where: { userId: user.id },
      update: {
        accessToken: encryptedToken,
        scopes: scope ? scope.split(",") : [],
        connectedAt: new Date(),
      },
      create: {
        userId: user.id,
        accessToken: encryptedToken,
        scopes: scope ? scope.split(",") : [],
        selectedRepos: [],
      },
    });

    // Redirect to repository selection page
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/settings/github?success=connected`
    );
  } catch (error) {
    console.error("GitHub connection error:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/settings/github?error=connection_failed`
    );
  }
}
