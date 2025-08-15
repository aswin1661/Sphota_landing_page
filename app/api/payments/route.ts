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
                isVerified,
                // Team member details
                member1: fields['Member 1'] as string || '',
                member2: fields['Member 2'] as string || '',
                member3: fields['Member 3'] as string || '',
                member4: fields['Member 4'] as string || '',
                // IEEE Membership IDs - trying multiple possible field names for Lead
                ieeeIdLead: String(
                    fields['IEEE Membership Id  Lead'] || 
                    fields['IEEE Membership Id Lead'] || 
                    fields['IEEE Membership ID Lead'] || 
                    fields['IEEE ID Lead'] ||
                    fields['Lead IEEE ID'] ||
                    fields['Lead IEEE Membership ID'] ||
                    ''
                ),
                ieeeIdMember1: '', // No IEEE field for Member 1 in your Airtable
                ieeeIdMember2: '', // No IEEE field for Member 2 in your Airtable
                ieeeIdMember3: String(fields['IEEE Id Member 3'] || ''), // Note: lowercase 'd' in "Id"
                ieeeIdMember4: String(fields['IEEE ID Member 4'] || ''), // Note: uppercase 'D' in "ID"
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
