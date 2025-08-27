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
    
    // Parameters for section/district/area queries
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

    const getStateCount = `SELECT 
        state,
        COUNT(state) as state_count
    FROM players p
    left join player_sections ps on ps.player_id  = p.id
    WHERE country = 'US' ${sectionWhereClause}
    GROUP BY state
    HAVING COUNT(state) > 5
    ORDER BY state_count DESC`;

    const client = await pool.connect();
    try {
        const result = await client.query(getStateCount, sectionParams);
        return NextResponse.json({ state: result.rows });
    } finally {
        client.release();
    }
}
