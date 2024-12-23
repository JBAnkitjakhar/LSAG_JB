// src/app/api/blockchain/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSignedContract } from '@/utils/blockchainUtils';

export async function POST(req: NextRequest) {
    try {
        const { action, email, publicKey } = await req.json();

        // Get contract with signer (this will work here because we're on the server)
        const contract = await getSignedContract();

        let result;
        switch (action) {
            case 'generateKeys':
                const tx1 = await contract.generateKeys(email);
                await tx1.wait(1);
                result = { success: true, message: 'Keys generated successfully' };
                break;

            case 'submitPublicKey':
                const tx2 = await contract.submitPublicKey(email, publicKey);
                await tx2.wait(1);
                result = { success: true, message: 'Public key submitted successfully' };
                break;

            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Blockchain API error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}