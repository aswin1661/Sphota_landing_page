import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Ensure we use the Node.js runtime (Airtable SDK doesn't work on the Edge runtime)
export const runtime = 'nodejs';

const airtableApiKey = process.env.AIRTABLE_API_KEY;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;
const airtableTableName = process.env.AIRTABLE_TABLE_NAME;

if (!airtableApiKey || !airtableBaseId || !airtableTableName) {
    throw new Error("Airtable environment variables are not set.");
}

const base = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId);

// Small helper to translate Airtable/SDK errors into HTTP responses with hints
type AirtableSdkError = {
    statusCode?: number;
    status?: number;
    error?: string;
    code?: string;
    type?: string;
    message?: string;
};

function airtableErrorResponse(err: unknown, action: 'fetch' | 'update') {
    const isProd = process.env.NODE_ENV === 'production';
    const baseId = process.env.AIRTABLE_BASE_ID ?? '';
    const tableName = process.env.AIRTABLE_TABLE_NAME ?? '';

    // Airtable errors often carry statusCode and error codes on the object
    const e = err as AirtableSdkError;
    const status = Number(e?.statusCode) || Number(e?.status) || 500;
    const code = e?.error || e?.code || e?.type;
    const message = e?.message || String(err);

    // Unauthorized or forbidden
    if (status === 401 || status === 403 || /NOT_AUTHORIZED/i.test(code ?? '') || /NOT_AUTHORIZED/i.test(message)) {
        return NextResponse.json(
            {
                error: `Airtable authorization failed while trying to ${action} attendance data`,
                hint: 'Verify AIRTABLE_API_KEY has data.records:read/write scopes and access to the specified base.',
                ...(isProd
                    ? {}
                    : { diagnostics: { status, code, baseId, tableName } }),
            },
            { status: 403 }
        );
    }

    // Table not found
    if (status === 404 || /NOT_FOUND/i.test(code ?? '') || /TABLE_NOT_FOUND/i.test(message)) {
        return NextResponse.json(
            {
                error: `Airtable table not found while trying to ${action} attendance data`,
                hint: 'Double-check AIRTABLE_TABLE_NAME exactly matches the table name (including spaces/case).',
                ...(isProd ? {} : { diagnostics: { status, code, baseId, tableName } }),
            },
            { status: 404 }
        );
    }

    // Fallback
    return NextResponse.json(
        {
            error: `Failed to ${action} attendance data`,
            ...(isProd ? {} : { diagnostics: { status, code, message } }),
        },
        { status: 500 }
    );
}

// GET - Fetch participants with attendance data
export async function GET() {
    try {
        // Optional mock mode to allow local development without Airtable
        if ((process.env.AIRTABLE_USE_MOCK || '').toLowerCase() === 'true' || process.env.AIRTABLE_USE_MOCK === '1') {
        type MockFields = Record<string, string | boolean>;
        type MockTeam = { recordId: string; teamName: string; fields: MockFields };
        const mockTeamRecords: MockTeam[] = [
                {
                    recordId: 'rec_mock_1',
                    teamName: 'Alpha Team',
            fields: {
                        'Team Name': 'Alpha Team',
                        'Lead': 'Alice',
                        'Member 1': 'Aaron',
                        'Member 2': 'Ava',
                        'Attendance': 'Present',
                        'Verified': 'Verified',
                    }
                },
                {
                    recordId: 'rec_mock_2',
                    teamName: 'Beta Squad',
            fields: {
                        'Team Name': 'Beta Squad',
                        'Lead': 'Bob',
                        'Member 1': 'Bella',
                        'Attendance': 'Absent',
                        'Verified': '',
                    }
                }
        ];

        const mockParticipants: Array<{ name: string; teamName: string; isLead: boolean; recordId: string; attendance: string; recordFields: MockFields }>= [
                { name: 'Alice', teamName: 'Alpha Team', isLead: true, recordId: 'rec_mock_1', attendance: 'Present', recordFields: mockTeamRecords[0].fields },
                { name: 'Aaron', teamName: 'Alpha Team', isLead: false, recordId: 'rec_mock_1', attendance: 'Present', recordFields: mockTeamRecords[0].fields },
                { name: 'Ava', teamName: 'Alpha Team', isLead: false, recordId: 'rec_mock_1', attendance: 'Present', recordFields: mockTeamRecords[0].fields },
                { name: 'Bob', teamName: 'Beta Squad', isLead: true, recordId: 'rec_mock_2', attendance: 'Absent', recordFields: mockTeamRecords[1].fields },
                { name: 'Bella', teamName: 'Beta Squad', isLead: false, recordId: 'rec_mock_2', attendance: 'Absent', recordFields: mockTeamRecords[1].fields }
            ];

            return NextResponse.json({ participants: mockParticipants, teamRecords: mockTeamRecords });
        }

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
        return airtableErrorResponse(error, 'fetch');
    }
}

// PUT - Update attendance or verification for a specific record
export async function PUT(request: Request) {
    try {
        const body: { recordId?: string; attendance?: string; verified?: boolean } = await request.json();
        const { recordId, attendance, verified } = body;

        if (!recordId) {
            return NextResponse.json(
                { error: 'Record ID is required' },
                { status: 400 }
            );
        }

        const fieldsToUpdate: Record<string, string | boolean> = {};

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

        // Optional mock mode: simulate successful update
        if ((process.env.AIRTABLE_USE_MOCK || '').toLowerCase() === 'true' || process.env.AIRTABLE_USE_MOCK === '1') {
            return NextResponse.json({ success: true, record: { id: recordId, fields: fieldsToUpdate } });
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
        return airtableErrorResponse(error, 'update');
    }
}
