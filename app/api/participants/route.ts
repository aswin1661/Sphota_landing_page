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
        const participants: {
            name: string;
            teamName: string;
            isLead: boolean;
            recordFields: Airtable.FieldSet;
        }[] = [];
        const teamRecords: { fields: Airtable.FieldSet; teamName: string }[] = [];

        records.forEach(record => {
            const fields = record.fields;
            const teamName = fields['Team Name'] as string || 'Unnamed Team';
            const lead = fields['Lead'] as string;

            teamRecords.push({
                fields,
                teamName
            });

            if (lead) {
                participants.push({
                    name: lead,
                    teamName,
                    isLead: true,
                    recordFields: fields
                });
            }

            for (let i = 1; i <= 4; i++) {
                const memberKey = `Member ${i}`;
                const memberName = fields[memberKey] as string;
                if (memberName && memberName !== lead) {
                    participants.push({
                        name: memberName,
                        teamName,
                        isLead: false,
                        recordFields: fields
                    });
                }
            }
        });

        return NextResponse.json({ participants, teamRecords });
    } catch (error) {
        console.error('Airtable fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch participants' },
            { status: 500 }
        );
    }
}