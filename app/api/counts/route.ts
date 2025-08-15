import { NextResponse } from 'next/server';
import Airtable from 'airtable';

export const runtime = 'nodejs';

const airtableApiKey = process.env.AIRTABLE_API_KEY;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;
const airtableTableName = process.env.AIRTABLE_TABLE_NAME;

if (!airtableApiKey || !airtableBaseId || !airtableTableName) {
    throw new Error("Airtable environment variables are not set.");
}

const base = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId);

type AirtableSdkError = {
    statusCode?: number;
    status?: number;
    error?: string;
    code?: string;
    type?: string;
    message?: string;
};

function airtableErrorResponse(err: unknown) {
    const isProd = process.env.NODE_ENV === 'production';
    const baseId = process.env.AIRTABLE_BASE_ID ?? '';
    const tableName = process.env.AIRTABLE_TABLE_NAME ?? '';
    const e = err as AirtableSdkError;
    const status = Number(e?.statusCode) || Number(e?.status) || 500;
    const code = e?.error || e?.code || e?.type;
    const message = e?.message || String(err);

    if (status === 401 || status === 403 || /NOT_AUTHORIZED/i.test(code ?? '') || /NOT_AUTHORIZED/i.test(message)) {
        return NextResponse.json({
            error: 'Airtable authorization failed while trying to fetch counts',
            hint: 'Verify AIRTABLE_API_KEY scopes and base access.',
            ...(isProd ? {} : { diagnostics: { status, code, baseId, tableName } }),
        }, { status: 403 });
    }

    if (status === 404 || /NOT_FOUND/i.test(code ?? '') || /TABLE_NOT_FOUND/i.test(message)) {
        return NextResponse.json({
            error: 'Airtable table not found while trying to fetch counts',
            hint: 'Check AIRTABLE_TABLE_NAME.',
            ...(isProd ? {} : { diagnostics: { status, code, baseId, tableName } }),
        }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to fetch counts', ...(isProd ? {} : { diagnostics: { status, code, message } }) }, { status: 500 });
}

export async function GET() {
    try {
        if ((process.env.AIRTABLE_USE_MOCK || '').toLowerCase() === 'true' || process.env.AIRTABLE_USE_MOCK === '1') {
            return NextResponse.json({ participantCount: 5, teamCount: 2 });
        }
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
    return airtableErrorResponse(error);
    }
}