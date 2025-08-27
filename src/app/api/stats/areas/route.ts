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
        SELECT p.*, a.area_name 
        FROM (
            SELECT 
                ps.area_id, 
                COUNT(ps.area_id) as count
            FROM players p
            LEFT JOIN player_sections ps ON ps.player_id = p.id
            WHERE ps.section_id = $1 AND ps.district_id = $2 ${playerWhereClause}
            GROUP BY ps.area_id
        ) as p
        LEFT JOIN areas a USING(area_id)
        ORDER BY p.count DESC`;

    const client = await pool.connect();
    
    try {
        const result = await client.query(getAreasCount, params);
        return NextResponse.json({ areas: result.rows });
    } finally {
        client.release();
    }
}
