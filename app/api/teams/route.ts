import { NextResponse } from 'next/server';
import Airtable from 'airtable';

const airtableApiKey = process.env.AIRTABLE_API_KEY;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;
const airtableTableName = process.env.AIRTABLE_TABLE_NAME;

if (!airtableApiKey || !airtableBaseId || !airtableTableName) {
    throw new Error("Airtable environment variables are not set.");
}

const base = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId);

export async function GET() {
    try {
        const records = await base(airtableTableName as string).select().all();
        const teams = records.map(record => ({
            teamName: record.get('Team Name') as string || 'Unnamed Team',
            recordFields: record.fields
        }));

        // Remove duplicates based on team name
        const uniqueTeams = Array.from(
            new Map(teams.map(team => [team.teamName, team])).values()
        );

        return NextResponse.json({ teams: uniqueTeams });
    } catch (error) {
        console.error('Airtable fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch teams' },
            { status: 500 }
        );
    }
}