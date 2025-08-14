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
            
            // Extract attachment information if available
            let attachmentUrl = null;
            let attachmentName = null;
            
            // Check for payment screenshot field (with trailing space)
            const possibleAttachmentFields = [
                'Screenshot of payment ', // Note: this has a trailing space
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
            
            // Get UPI Transaction ID - check for field with trailing space
            const upiTransactionId = fields['UPI Transaction ID '] as string || null;
            
            // Get verification status - check for dropdown field named "Verified"
            // The dropdown will contain "Verified" as a single choice option
            const verificationStatus = fields['Verified'] as string;
            const isVerified = verificationStatus === 'Verified';
            
            return {
                recordId: record.id,
                teamName: fields['Team Name'] as string || 'Unnamed Team',
                lead: fields['Lead'] as string || '',
                upiTransactionId,
                attachmentUrl,
                attachmentName,
                isVerified
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

        // Update the "Verified" dropdown field
        // Set to "Verified" when verifying, or undefined when unverifying
        const updateData: Record<string, string> = {};
        if (isVerified) {
            updateData['Verified'] = 'Verified';
        } else {
            // For Airtable, we don't set the field to remove the selection
            // This effectively clears the dropdown
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
                // If "Verified" field doesn't exist, track locally
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
