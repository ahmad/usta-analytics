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

    const getSectionsCount = `
        SELECT 
            DISTINCT
            ps.section_id, 
            COUNT(DISTINCT ps.player_id) as section_count,
            s.section_name
        FROM player_sections ps
        LEFT JOIN sections s ON ps.section_id = s.section_id
        LEFT JOIN players p ON p.id = ps.player_id
        WHERE 1=1 ${whereClause}
        GROUP BY ps.section_id, s.section_name
        ORDER BY section_count DESC`;

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

    const getGenderCount = `
        SELECT p.gender, COUNT(DISTINCT p.id) as gender_count 
        FROM players p
        LEFT JOIN player_sections ps ON ps.player_id = p.id
        WHERE 1=1 ${whereClause}
        GROUP BY p.gender
        ORDER BY gender_count DESC`;

    const getStateCount = `
        SELECT 
            p.state,
            COUNT(DISTINCT p.id) as state_count
        FROM players p
        LEFT JOIN player_sections ps ON ps.player_id = p.id
        WHERE p.country = 'US' ${whereClause}
        GROUP BY p.state
        HAVING COUNT(DISTINCT p.id) > 5
        ORDER BY state_count DESC`;

    const client = await pool.connect();
    try {
        const [sectionsCount, genderStatPerRating, genderCount, stateCount] = await Promise.all([   
            client.query(getSectionsCount, params),
            client.query(getGenderStatPerRating, params),
            client.query(getGenderCount, params),
            client.query(getStateCount, params)
        ]);

        return NextResponse.json({ 
            section: sectionsCount.rows, 
            rating: genderStatPerRating.rows, 
            gender: genderCount.rows, 
            state: stateCount.rows 
        });
    } finally {
        client.release();
    }
}