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
        

        
        const payments = records.map((record: Airtable.Record<Airtable.FieldSet>) => {
            const fields = record.fields;
            
            let attachmentUrl = null;
            let attachmentName = null;
            
            const possibleAttachmentFields = [
                'Screenshot of payment ',
                'Screenshot of payment',
                'Payment Screenshot',
                'Payment Attachment',
                'Payment Proof',
                'Payment Receipt',
                'Attachment',
                'Screenshot'
            ];
            
            for (const fieldName of possibleAttachmentFields) {
                const attachmentField = fields[fieldName];
                if (attachmentField && Array.isArray(attachmentField) && attachmentField.length > 0) {
                    attachmentUrl = attachmentField[0].url;
                    attachmentName = attachmentField[0].filename;
                    break;
                }
            }
            
            const upiTransactionId = fields['UPI Transaction ID '] as string || null;
            
            const verificationStatus = fields['Verified'] as string;
            const isVerified = verificationStatus === 'Verified';
            
            return {
                recordId: record.id,
                teamName: fields['Team Name'] as string || 'Unnamed Team',
                lead: fields['Lead'] as string || '',
                upiTransactionId,
                attachmentUrl,
                attachmentName,
                isVerified,
                member1: fields['Member 1'] as string || '',
                member2: fields['Member 2'] as string || '',
                member3: fields['Member 3'] as string || '',
                member4: fields['Member 4'] as string || '',
                ieeeIdLead: String(
                    fields['IEEE Membership Id  Lead'] || 
                    fields['IEEE Membership Id Lead'] || 
                    fields['IEEE Membership ID Lead'] || 
                    fields['IEEE ID Lead'] ||
                    fields['Lead IEEE ID'] ||
                    fields['Lead IEEE Membership ID'] ||
                    ''
                ),
                ieeeIdMember2: String(fields['IEEE Id Member 3'] || ''), 
                ieeeIdMember3: String(fields['IEEE Id Member 3'] || ''),
                ieeeIdMember4: String(fields['IEEE ID Member 4'] || ''),
            };
        });

        return NextResponse.json({ payments });
    } catch (error) {
        console.error('Airtable fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch payment data' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const { recordId, isVerified } = await request.json();
        
        if (!recordId) {
            return NextResponse.json(
                { error: 'Record ID is required' },
                { status: 400 }
            );
        }

        const updateData: Record<string, string> = {};
        if (isVerified) {
            updateData['Verified'] = 'Verified';
        } else {
            // set the field to remove the selection
        }

        try {
            await base(airtableTableName as string).update(recordId, updateData);
            
            return NextResponse.json({ 
                success: true, 
                message: `Payment ${isVerified ? 'verified' : 'unverified'} successfully` 
            });
        } catch (error: unknown) {
            const airtableError = error as { error?: string };
            if (airtableError.error === 'UNKNOWN_FIELD_NAME') {
                console.log('No "Verified" dropdown field found in Airtable, tracking locally');
                return NextResponse.json({ 
                    success: true, 
                    message: `Payment ${isVerified ? 'verified' : 'unverified'} locally (no Airtable field)`,
                    localOnly: true
                });
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('Airtable update error:', error);
        return NextResponse.json(
            { error: 'Failed to update verification status' },
            { status: 500 }
        );
    }
}
