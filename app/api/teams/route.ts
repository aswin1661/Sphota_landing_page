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

function airtableErrorResponse(err: unknown, action: 'fetch') {
    const isProd = process.env.NODE_ENV === 'production';
    const baseId = process.env.AIRTABLE_BASE_ID ?? '';
    const tableName = process.env.AIRTABLE_TABLE_NAME ?? '';
    const anyErr = err as any;
    const status = Number(anyErr?.statusCode) || Number(anyErr?.status) || 500;
    const code = anyErr?.error || anyErr?.code || anyErr?.type;
    const message = anyErr?.message || String(err);

    if (status === 401 || status === 403 || /NOT_AUTHORIZED/i.test(code ?? '') || /NOT_AUTHORIZED/i.test(message)) {
        return NextResponse.json({
            error: 'Airtable authorization failed while trying to fetch teams',
            hint: 'Verify AIRTABLE_API_KEY scopes and base access.',
            ...(isProd ? {} : { diagnostics: { status, code, baseId, tableName } }),
        }, { status: 403 });
    }

    if (status === 404 || /NOT_FOUND/i.test(code ?? '') || /TABLE_NOT_FOUND/i.test(message)) {
        return NextResponse.json({
            error: 'Airtable table not found while trying to fetch teams',
            hint: 'Check AIRTABLE_TABLE_NAME.',
            ...(isProd ? {} : { diagnostics: { status, code, baseId, tableName } }),
        }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to fetch teams', ...(isProd ? {} : { diagnostics: { status, code, message } }) }, { status: 500 });
}

export async function GET() {
    try {
        if ((process.env.AIRTABLE_USE_MOCK || '').toLowerCase() === 'true' || process.env.AIRTABLE_USE_MOCK === '1') {
            const teams = [
                { teamName: 'Alpha Team', recordFields: { 'Team Name': 'Alpha Team', Lead: 'Alice', 'Member 1': 'Aaron', 'Member 2': 'Ava' } },
                { teamName: 'Beta Squad', recordFields: { 'Team Name': 'Beta Squad', Lead: 'Bob', 'Member 1': 'Bella' } },
            ];
            return NextResponse.json({ teams });
        }
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
        return airtableErrorResponse(error, 'fetch');
    }
}