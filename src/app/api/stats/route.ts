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

    const getSectionsCount = `SELECT 
        DISTINCT
        ps.section_id, 
        COUNT(ps.section_id) as section_count,
        s.section_name
    FROM player_sections ps
    LEFT JOIN sections s ON ps.section_id = s.section_id
    left join players p on p.id = ps.player_id
    WHERE 1=1 ${sectionWhereClause}
    GROUP BY ps.section_id, s.section_name
    ORDER BY section_count DESC`;

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

    const getGenderCount = `SELECT gender, COUNT(gender) as gender_count 
    FROM players p
    left join player_sections ps on ps.player_id  = p.id
    WHERE 1=1 ${sectionWhereClause}
    GROUP BY gender`;

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
        const [sectionsCount, genderStatPerRating, genderCount, stateCount] = await Promise.all([   
            client.query(getSectionsCount, sectionParams),
            client.query(getGenderStatPerRating, sectionParams),
            client.query(getGenderCount, sectionParams),
            client.query(getStateCount, sectionParams)
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