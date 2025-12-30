import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { decryptToken } from "@/lib/github/encryption";
import { GitHubClient } from "@/lib/github/client";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { githubConn: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.githubConn) {
    return NextResponse.json(
      { error: "GitHub not connected", connected: false },
      { status: 400 }
    );
  }

  if (user.githubConn.selectedRepos.length === 0) {
    return NextResponse.json({
      items: [],
      message: "No repositories selected",
    });
  }

  try {
    const token = decryptToken(user.githubConn.accessToken);
    const client = new GitHubClient(token);
    const commits = await client.getAllCommitsFromRepos(
      user.githubConn.selectedRepos,
      50
    );

    return NextResponse.json({ items: commits });
  } catch (error) {
    console.error("Error fetching commits:", error);
    return NextResponse.json(
      { error: "Failed to fetch commits" },
      { status: 500 }
    );
  }
}
