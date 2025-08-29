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
    let sectionWhereClause = '';
    const sectionParams: (string | number)[] = [];
    let sectionParamIndex = 1;

    if (section) {
        sectionWhereClause += ` AND ps.section_id = $${sectionParamIndex}`;
        sectionParams.push(section);
        sectionParamIndex++;
    }

    if (district) {
        sectionWhereClause += ` AND ps.district_id = $${sectionParamIndex}`;
        sectionParams.push(district);
        sectionParamIndex++;
    }

    if (area) {
        sectionWhereClause += ` AND ps.area_id = $${sectionParamIndex}`;
        sectionParams.push(area);
        sectionParamIndex++;
    }

    if (gender) {
        sectionWhereClause += ` AND p.gender = $${sectionParamIndex}`;
        sectionParams.push(gender);
        sectionParamIndex++;
    }

    if (rating) {
        sectionWhereClause += ` AND p.rating = $${sectionParamIndex}`;
        sectionParams.push(rating);
        sectionParamIndex++;
    }

    const getStateCount = `
        SELECT 
            p.state,
            COUNT(DISTINCT p.id) as state_count
        FROM players p
        LEFT JOIN player_sections ps ON ps.player_id = p.id
        WHERE p.country = 'US' ${sectionWhereClause}
        GROUP BY p.state
        HAVING COUNT(DISTINCT p.id) > 5
        ORDER BY state_count DESC`;

    const client = await pool.connect();
    try {
        const result = await client.query(getStateCount, sectionParams);
        return NextResponse.json({ state: result.rows });
    } finally {
        client.release();
    }
}
