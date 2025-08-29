import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const district = searchParams.get('district');
    const area = searchParams.get('area');
    const gender = searchParams.get('gender');
    const rating = searchParams.get('rating');

    // Build WHERE clauses based on filters
    let whereClause = '';
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (section) {
        whereClause += ` AND ps.section_id = $${paramIndex}`;
        params.push(section);
        paramIndex++;
    }

    if (district) {
        whereClause += ` AND ps.district_id = $${paramIndex}`;
        params.push(district);
        paramIndex++;
    }

    if (area) {
        whereClause += ` AND ps.area_id = $${paramIndex}`;
        params.push(area);
        paramIndex++;
    }

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

    const getGenderStatPerRating = `
        SELECT 
            p.rating,
            COUNT(CASE WHEN p.gender = 'Male' THEN 1 END) as male_rating,
            COUNT(CASE WHEN p.gender = 'Female' THEN 1 END) as female_rating
        FROM players p
        LEFT JOIN player_sections ps ON ps.player_id = p.id
        WHERE p.rating BETWEEN 2.5 AND 5.5 ${whereClause}
        GROUP BY p.rating
        ORDER BY p.rating ASC`;

    const client = await pool.connect();
    try {
        const result = await client.query(getGenderStatPerRating, params);
        return NextResponse.json({ rating: result.rows });
    } finally {
        client.release();
    }
}
