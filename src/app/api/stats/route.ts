import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const getSectionsCount =  `select 
        distinct
        section_id, 
        section_count,
        section_name
    from (
        select 
            section_id, count(section_id) as section_count 
        from player_sections p 
        group by section_id 
    ) as tbl
        left join sections s using (section_id);`;

    const getGenderStatPerRating = `select p1.rating,
        (select count(*) from players p2 where p2.rating = p1.rating and gender = 'Male') as male_rating,
        (select count(*) from players p2 where p2.rating = p1.rating and gender = 'Female') as female_rating
    from (
        select
            distinct rating
        from players
    ) as p1
    where p1.rating between 2.5 and 5.5
    order by rating asc;`;

    const getGenderCount = `select gender, count(gender) as gender_count from players group by gender;`;


    const getStateCount = `select 
        state,
        count(state) as state_count
    from players 
    where country = 'US'
    group by state
    having count(state) > 5`;

    const client = await pool.connect();
    
    const [sectionsCount, genderStatPerRating, genderCount, stateCount] = await Promise.all([   
        client.query(getSectionsCount),
        client.query(getGenderStatPerRating),
        client.query(getGenderCount),
        client.query(getStateCount)
    ]);

    client.release();
    return NextResponse.json({ 
        section: sectionsCount.rows, 
        rating: genderStatPerRating.rows, 
        gender: genderCount.rows, 
        state: stateCount.rows 
    });
}