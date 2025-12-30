import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { decryptToken } from "@/lib/github/encryption";
import { GitHubClient } from "@/lib/github/client";

// GET /api/github/repos - List user's repositories
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

  try {
    const token = decryptToken(user.githubConn.accessToken);
    const client = new GitHubClient(token);
    const repos = await client.listRepos();

    return NextResponse.json({
      connected: true,
      repos,
      selectedRepos: user.githubConn.selectedRepos,
    });
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}

// PUT /api/github/repos - Update selected repositories
export async function PUT(request: NextRequest) {
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
      { error: "GitHub not connected" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { selectedRepos } = body;

    if (!Array.isArray(selectedRepos)) {
      return NextResponse.json(
        { error: "selectedRepos must be an array" },
        { status: 400 }
      );
    }

    await prisma.gitHubConnection.update({
      where: { userId: user.id },
      data: { selectedRepos },
    });

    return NextResponse.json({ success: true, selectedRepos });
  } catch (error) {
    console.error("Error updating selected repos:", error);
    return NextResponse.json(
      { error: "Failed to update selected repositories" },
      { status: 500 }
    );
  }
}

// DELETE /api/github/repos - Disconnect GitHub
export async function DELETE() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    await prisma.gitHubConnection.delete({
      where: { userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error disconnecting GitHub:", error);
    return NextResponse.json(
      { error: "Failed to disconnect GitHub" },
      { status: 500 }
    );
  }
}
