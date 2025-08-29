import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const gender = searchParams.get('gender');
    const rating = searchParams.get('rating');

    if (!section) {
        return NextResponse.json({ error: 'Section parameter is required' }, { status: 400 });
    }

    // Build WHERE clauses based on filters
    let playerWhereClause = '';
    const params: (string | number)[] = [section];
    let paramIndex = 2;

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

    const getDistrictsCount = `
        SELECT 
            ps.district_id, 
            COUNT(DISTINCT ps.player_id) as count,
            d.district_name 
        FROM player_sections ps
        LEFT JOIN districts d ON ps.district_id = d.district_id
        LEFT JOIN players p ON p.id = ps.player_id
        WHERE ps.section_id = $1 ${playerWhereClause}
        GROUP BY ps.district_id, d.district_name
        ORDER BY count DESC`;

    const client = await pool.connect();
    
    try {
        const result = await client.query(getDistrictsCount, params);
        return NextResponse.json({ districts: result.rows });
    } finally {
        client.release();
    }
}
