// src/constants/index.ts

// This will be automatically updated by the deployment script
export const VOTING_CONTRACT_ADDRESS = "0x337fC43522b9e61DEBedE003044F33bAaA041531";

// This will be automatically updated by the deployment script with the full ABI
export const VOTING_CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_registrationDuration",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "email",
        "type": "string"
      }
    ],
    "name": "KeysGenerated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "email",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "publicKey",
        "type": "string"
      }
    ],
    "name": "PublicKeySubmitted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "emailToPublicKey",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "email",
        "type": "string"
      }
    ],
    "name": "generateKeys",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "generatedEmails",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllPublicKeys",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGeneratedEmails",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "email",
        "type": "string"
      }
    ],
    "name": "getPublicKeyByEmail",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "hasGeneratedKeys",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "hasSubmittedKey",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "registrationEndTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "email",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "publicKey",
        "type": "string"
      }
    ],
    "name": "submitPublicKey",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "submittedPublicKeys",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Email domain constant
export const ALLOWED_EMAIL_DOMAIN = "@iitbhilai.ac.in";

// Redis key prefixes
export const REDIS_PREFIX = {
    VERIFICATION: "verification:",
    EMAIL_COOLDOWN: "email_cooldown:"
};

// Verification code expiry time in seconds (10 minutes)
export const VERIFICATION_CODE_EXPIRY = 600;

// Contract event names
export const CONTRACT_EVENTS = {
    KEYS_GENERATED: "KeysGenerated",
    PUBLIC_KEY_SUBMITTED: "PublicKeySubmitted"
};

// Response messages
export const MESSAGES = {
    KEYS_ALREADY_GENERATED: "Keys have already been generated for this email",
    KEY_ALREADY_SUBMITTED: "Public key has already been submitted for this email",
    INVALID_EMAIL_DOMAIN: "Invalid email domain. Must be @iitbhilai.ac.in",
    REGISTRATION_CLOSED: "Registration period has ended",
    VERIFICATION_CODE_SENT: "Verification code sent successfully",
    INVALID_CODE: "Invalid verification code or code expired",
    EMAIL_VERIFIED: "Email verified successfully"
};