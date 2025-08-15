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
            error: 'Airtable authorization failed while trying to fetch food preference data',
            hint: 'Verify AIRTABLE_API_KEY scopes and base access.',
            ...(isProd ? {} : { diagnostics: { status, code, baseId, tableName } }),
        }, { status: 403 });
    }

    if (status === 404 || /NOT_FOUND/i.test(code ?? '') || /TABLE_NOT_FOUND/i.test(message)) {
        return NextResponse.json({
            error: 'Airtable table not found while trying to fetch food preference data',
            hint: 'Check AIRTABLE_TABLE_NAME.',
            ...(isProd ? {} : { diagnostics: { status, code, baseId, tableName } }),
        }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to fetch food preference data', ...(isProd ? {} : { diagnostics: { status, code, message } }) }, { status: 500 });
}

export async function GET() {
    try {
        const records = await base(airtableTableName as string).select().all();
        
        const vegParticipants: Array<{
            name: string;
            teamName: string;
            isLead: boolean;
        }> = [];
        
        const nonVegParticipants: Array<{
            name: string;
            teamName: string;
            isLead: boolean;
        }> = [];

        records.forEach((record: Airtable.Record<Airtable.FieldSet>) => {
            const fields = record.fields;
            const teamName = fields['Team Name'] as string || 'Unnamed Team';
            const lead = fields['Lead'] as string;
            
            // Check lead's food preference with multiple possible field names
            if (lead) {
                const possibleLeadFoodFields = [
                    'Lead Food Preference',
                    'Food Preference', // In case it's shared
                    'Lead Food',
                    'Dietary Preference'
                ];
                
                let leadFoodPref = null;
                for (const fieldName of possibleLeadFoodFields) {
                    if (fields[fieldName]) {
                        leadFoodPref = fields[fieldName] as string;
                        break;
                    }
                }
                
                if (leadFoodPref) {
                    const prefLower = leadFoodPref.toLowerCase().trim();
                    if (prefLower === 'veg' || prefLower === 'vegetarian') {
                        vegParticipants.push({
                            name: lead,
                            teamName,
                            isLead: true
                        });
                    } else if (prefLower === 'non-veg' || prefLower === 'non veg' || prefLower === 'nonveg' || prefLower === 'non-vegetarian') {
                        nonVegParticipants.push({
                            name: lead,
                            teamName,
                            isLead: true
                        });
                    }
                }
            }

            // Check team members' food preferences
            for (let i = 1; i <= 4; i++) {
                const memberKey = `Member ${i}`;
                const memberName = fields[memberKey] as string;
                
                if (memberName) {
                    const possibleMemberFoodFields = [
                        `Member ${i} Food Preference`,
                        `Member ${i} Food`,
                        `Member${i} Food Preference`,
                        'Food Preference', // In case it's a shared field
                        `Dietary Preference ${i}`
                    ];
                    
                    let memberFoodPref = null;
                    for (const fieldName of possibleMemberFoodFields) {
                        if (fields[fieldName]) {
                            memberFoodPref = fields[fieldName] as string;
                            break;
                        }
                    }
                    
                    if (memberFoodPref) {
                        const prefLower = memberFoodPref.toLowerCase().trim();
                        if (prefLower === 'veg' || prefLower === 'vegetarian') {
                            vegParticipants.push({
                                name: memberName,
                                teamName,
                                isLead: false
                            });
                        } else if (prefLower === 'non-veg' || prefLower === 'non veg' || prefLower === 'nonveg' || prefLower === 'non-vegetarian') {
                            nonVegParticipants.push({
                                name: memberName,
                                teamName,
                                isLead: false
                            });
                        }
                    }
                }
            }
        });

        const stats = {
            vegCount: vegParticipants.length,
            nonVegCount: nonVegParticipants.length,
            totalCount: vegParticipants.length + nonVegParticipants.length,
            vegParticipants,
            nonVegParticipants
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Airtable fetch error:', error);
        return airtableErrorResponse(error);
    }
}
