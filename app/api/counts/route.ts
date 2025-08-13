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
        
        let participantCount = 0;
        const uniqueTeams = new Set();

        records.forEach(record => {
            const teamName = record.get('Team Name');
            if (teamName) uniqueTeams.add(teamName);

            // Count lead
            const lead = record.get('Lead');
            if (lead) participantCount++;

            // Count members
            for (let i = 1; i <= 4; i++) {
                const member = record.get(`Member ${i}`);
                if (member && member !== lead) participantCount++;
            }
        });

        return NextResponse.json({
            participantCount,
            teamCount: uniqueTeams.size
        });
    } catch (error) {
        console.error('Airtable fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch counts' },
            { status: 500 }
        );
    }
}