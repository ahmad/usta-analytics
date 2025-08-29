import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const district = searchParams.get('district');
    const gender = searchParams.get('gender');
    const rating = searchParams.get('rating');

    if (!section || !district) {
        return NextResponse.json({ error: 'Section and district parameters are required' }, { status: 400 });
    }

    // Build WHERE clauses based on filters
    let playerWhereClause = '';
    const params: (string | number)[] = [section, district];
    let paramIndex = 3;

    if (gender) {
        playerWhereClause += ` AND p.gender = $${paramIndex}`;
        params.push(gender);
        paramIndex++;
    }

    if (rating) {
        playerWhereClause += ` AND p.rating = $${paramIndex}`;
        params.push(rating);
        paramIndex++;
    }

    const getAreasCount = `
        SELECT 
            ps.area_id, 
            COUNT(DISTINCT ps.player_id) as count,
            a.area_name 
        FROM player_sections ps
        LEFT JOIN areas a ON ps.area_id = a.area_id
        LEFT JOIN players p ON p.id = ps.player_id
        WHERE ps.section_id = $1 AND ps.district_id = $2 ${playerWhereClause}
        GROUP BY ps.area_id, a.area_name
        ORDER BY count DESC`;

    const client = await pool.connect();
    
    try {
        const result = await client.query(getAreasCount, params);
        return NextResponse.json({ areas: result.rows });
    } finally {
        client.release();
    }
}
