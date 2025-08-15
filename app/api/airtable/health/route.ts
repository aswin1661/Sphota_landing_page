import { NextResponse } from 'next/server';
import Airtable from 'airtable';

export const runtime = 'nodejs';

export async function GET() {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME;

    if (!apiKey || !baseId || !tableName) {
        return NextResponse.json({
            ok: false,
            error: 'Missing Airtable env vars',
            required: ['AIRTABLE_API_KEY', 'AIRTABLE_BASE_ID', 'AIRTABLE_TABLE_NAME'],
            present: {
                AIRTABLE_API_KEY: Boolean(apiKey),
                AIRTABLE_BASE_ID: Boolean(baseId),
                AIRTABLE_TABLE_NAME: Boolean(tableName),
            },
            hint: 'Set these in .env.local and restart the dev server',
        }, { status: 500 });
    }

    try {
        const base = new Airtable({ apiKey }).base(baseId);
        const res = await base(tableName).select({ pageSize: 1 }).firstPage();
        return NextResponse.json({
            ok: true,
            sampleCount: res.length,
            message: 'Airtable connection OK',
        });
    } catch (err) {
        type AirtableSdkError = {
            statusCode?: number;
            status?: number;
            error?: string;
            code?: string;
            type?: string;
            message?: string;
        };
        const e = err as AirtableSdkError;
        const status = Number(e?.statusCode) || Number(e?.status) || 500;
        const code = e?.error || e?.code || e?.type;
        const message = e?.message || String(err);
        return NextResponse.json({
            ok: false,
            error: 'Failed to connect to Airtable',
            diagnostics: { status, code, message, baseId, tableName },
            hints: [
                'Ensure AIRTABLE_API_KEY is a Personal Access Token with data.records:read and data.records:write scopes',
                'Grant this token access to the base in Airtable (workspace > developer hub > access)',
                'Confirm AIRTABLE_BASE_ID and AIRTABLE_TABLE_NAME are correct (exact name, including spaces and case)',
            ],
        }, { status: status === 401 || status === 403 ? 403 : 500 });
    }
}
