import { NextResponse } from 'next/server';
import Airtable from 'airtable';

const airtableApiKey = process.env.AIRTABLE_API_KEY;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;
const airtableTableName = process.env.AIRTABLE_TABLE_NAME;

if (!airtableApiKey || !airtableBaseId || !airtableTableName) {
    throw new Error("Airtable environment variables are not set.");
}

const base = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId);

// GET - Fetch participants with attendance data
export async function GET() {
    try {
        const records = await base(airtableTableName as string).select().all();
        const participants: {
            name: string;
            teamName: string;
            isLead: boolean;
            recordId: string;
            attendance?: string;
            recordFields: Airtable.FieldSet;
        }[] = [];
        
        const teamRecords: { 
            recordId: string;
            fields: Airtable.FieldSet; 
            teamName: string;
        }[] = [];

        records.forEach(record => {
            const fields = record.fields;
            const teamName = fields['Team Name'] as string || 'Unnamed Team';
            const lead = fields['Lead'] as string;
            const attendance = fields['Attendance'] as string;

            // Store team record with record ID
            teamRecords.push({
                recordId: record.id,
                fields,
                teamName
            });

            // Add lead to participants
            if (lead) {
                participants.push({
                    name: lead,
                    teamName,
                    isLead: true,
                    recordId: record.id,
                    attendance,
                    recordFields: fields
                });
            }

            // Add team members to participants
            for (let i = 1; i <= 4; i++) {
                const memberKey = `Member ${i}`;
                const memberName = fields[memberKey] as string;
                if (memberName && memberName !== lead) {
                    participants.push({
                        name: memberName,
                        teamName,
                        isLead: false,
                        recordId: record.id,
                        attendance,
                        recordFields: fields
                    });
                }
            }
        });

        return NextResponse.json({ participants, teamRecords });
    } catch (error) {
        console.error('Airtable fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch attendance data' },
            { status: 500 }
        );
    }
}

// PUT - Update attendance or verification for a specific record
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { recordId, attendance, verified } = body;

        if (!recordId) {
            return NextResponse.json(
                { error: 'Record ID is required' },
                { status: 400 }
            );
        }

        const fieldsToUpdate: Record<string, any> = {};

        // Handle attendance update
        if (attendance !== undefined) {
            if (!['Present', 'Absent'].includes(attendance)) {
                return NextResponse.json(
                    { error: 'Attendance must be either "Present" or "Absent"' },
                    { status: 400 }
                );
            }
            fieldsToUpdate.Attendance = attendance;
        }

        // Handle verification update
        if (verified !== undefined) {
            fieldsToUpdate.Verified = verified ? 'Verified' : '';
        }

        if (Object.keys(fieldsToUpdate).length === 0) {
            return NextResponse.json(
                { error: 'No valid fields to update' },
                { status: 400 }
            );
        }

        // Update the record in Airtable
        const updatedRecord = await base(airtableTableName as string).update([
            {
                id: recordId,
                fields: fieldsToUpdate
            }
        ]);

        return NextResponse.json({ 
            success: true, 
            record: updatedRecord[0]
        });

    } catch (error) {
        console.error('Airtable update error:', error);
        return NextResponse.json(
            { error: 'Failed to update record' },
            { status: 500 }
        );
    }
}
