import { NextResponse } from "next/server";
import filters from "./sections.json";


export async function GET() {
  return NextResponse.json(filters);
}