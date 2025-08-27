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

    // For the rating query, we need to handle the gender filter separately since it's already in the subquery
    const ratingGenderFilter = gender ? ` AND gender = '${gender}'` : '';
    
    const getGenderStatPerRating = `SELECT p1.rating,
        (SELECT COUNT(*) FROM players p2 WHERE p2.rating = p1.rating AND gender = 'Male' ${ratingGenderFilter}) as male_rating,
        (SELECT COUNT(*) FROM players p2 WHERE p2.rating = p1.rating AND gender = 'Female' ${ratingGenderFilter}) as female_rating
    FROM (
        SELECT DISTINCT rating
        FROM players p
        left join player_sections ps on ps.player_id  = p.id
        WHERE 1=1 ${sectionWhereClause}
    ) as p1
    WHERE p1.rating BETWEEN 2.5 AND 5.5
    ORDER BY rating ASC`;

    const client = await pool.connect();
    try {
        const result = await client.query(getGenderStatPerRating, sectionParams);
        return NextResponse.json({ rating: result.rows });
    } finally {
        client.release();
    }
}
