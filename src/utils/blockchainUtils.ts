// src/utils/blockchainUtils.ts
import { VOTING_CONTRACT_ABI, VOTING_CONTRACT_ADDRESS } from '@/constants';
import { ethers } from 'ethers';

class ContractManager {
    private static instance: ContractManager;
    private provider: ethers.JsonRpcProvider | null = null;
    private contract: ethers.Contract | null = null;

    private constructor() {}

    public static getInstance(): ContractManager {
        if (!ContractManager.instance) {
            ContractManager.instance = new ContractManager();
        }
        return ContractManager.instance;
    }

    private async initializeProvider(): Promise<ethers.JsonRpcProvider> {
        if (!this.provider) {
            const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
            if (!rpcUrl) {
                throw new Error('RPC URL not configured');
            }
            this.provider = new ethers.JsonRpcProvider(rpcUrl);
        }
        return this.provider;
    }

    public async getContract(): Promise<ethers.Contract> {
        if (!this.contract) {
            const provider = await this.initializeProvider();
            this.contract = new ethers.Contract(
                VOTING_CONTRACT_ADDRESS,
                VOTING_CONTRACT_ABI,
                provider
            );
        }
        return this.contract;
    }

    // Add signed contract method for server-side operations
    public async getSignedContract(): Promise<ethers.Contract> {
        const provider = await this.initializeProvider();
        if (!process.env.PRIVATE_KEY) {
            throw new Error('Private key not configured');
        }
        const privateKey = process.env.PRIVATE_KEY.startsWith('0x') 
            ? process.env.PRIVATE_KEY 
            : `0x${process.env.PRIVATE_KEY}`;
        const signer = new ethers.Wallet(privateKey, provider);
        return new ethers.Contract(
            VOTING_CONTRACT_ADDRESS,
            VOTING_CONTRACT_ABI,
            signer
        );
    }
}

// Read-only operations that can run on client
export const getContract = async (): Promise<ethers.Contract> => {
    try {
        return await ContractManager.getInstance().getContract();
    } catch (error) {
        console.error('Contract initialization error:', error);
        throw new Error('Failed to initialize contract');
    }
};

// Export getSignedContract for server-side operations
export const getSignedContract = async (): Promise<ethers.Contract> => {
    try {
        return await ContractManager.getInstance().getSignedContract();
    } catch (error) {
        console.error('Signed contract initialization error:', error);
        throw new Error('Failed to initialize signed contract');
    }
};

export const getRegistrationEndTime = async (): Promise<bigint> => {
    const contract = await getContract();
    const endTime = await contract.registrationEndTime();
    return endTime;
};

export const checkKeyGeneration = async (email: string): Promise<boolean> => {
    const contract = await getContract();
    return await contract.hasGeneratedKeys(email);
};

export const checkPublicKeySubmission = async (email: string): Promise<boolean> => {
    const contract = await getContract();
    return await contract.hasSubmittedKey(email);
};

// API-based operations for signed transactions
export const generateKeysOnChain = async (email: string): Promise<boolean> => {
    const response = await fetch('/api/blockchain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'generateKeys',
            email
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate keys on chain');
    }

    return true;
};

export const submitPublicKey = async (email: string, publicKey: string): Promise<boolean> => {
    const response = await fetch('/api/blockchain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'submitPublicKey',
            email,
            publicKey: publicKey // Using original format
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit public key');
    }

    return true;
};