import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const ingredients = body.ingredients;

    return NextResponse.json({
        analysis: "API route works",
    });
}