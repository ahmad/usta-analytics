import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get('gender');
    const rating = searchParams.get('rating');


    // Build WHERE clauses based on filters
    let whereClause = '';

    // Parameters for section/district/area queries
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (gender) {
        whereClause += ` AND p.gender = $${paramIndex}`;
        params.push(gender);
        paramIndex++;
    }

    if (rating) {
        whereClause += ` AND p.rating = $${paramIndex}`;
        params.push(rating);
        paramIndex++;
    }

    const sql = `SELECT 
        DISTINCT
        ps.section_id, 
        COUNT(ps.section_id) as section_count,
        s.section_name
    FROM player_sections ps
    LEFT JOIN sections s ON ps.section_id = s.section_id
    left join players p on p.id = ps.player_id
    WHERE 1=1 ${whereClause}
    GROUP BY ps.section_id, s.section_name
    ORDER BY section_count DESC`;

    const client = await pool.connect();
    try {
        const result = await client.query(sql, params);
        return NextResponse.json({ sections: result.rows });
    } finally {
        client.release();
    }
}
