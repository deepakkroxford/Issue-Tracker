import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import prisma from "@/prisma/client";

// Existing schema for creating issues
const createIssueSchema = z.object({
    title: z.string().min(1, 'title is required').max(255),
    description: z.string().min(1, 'description is required'),
});

// Create Issue
export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = createIssueSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const newIssue = await prisma.issue.create({
        data: {
            title: body.title,
            description: body.description,
        },
    });

    return NextResponse.json(newIssue, { status: 201 });
}


// Get All Issues
export async function GET() {
    try {
        const issues = await prisma.issue.findMany(); // Fetch all issues from the database
        return NextResponse.json(issues, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch issues:', error);
        return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
    }
}


// Update Issue Status
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params; // Extract the ID from the URL
    const body = await request.json();
    const { status } = body;

    try {
        // Validate the status
        if (!['OPEN', 'CLOSED'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // Update the issue in the database
        const updatedIssue = await prisma.issue.update({
            where: { id: parseInt(id) }, // Convert ID to a number
            data: { status: status },
        });

        return NextResponse.json(updatedIssue, { status: 200 });
    } catch (error) {
        console.error('Failed to update issue:', error);
        return NextResponse.json({ error: 'Failed to update issue' }, { status: 500 });
    }
}

