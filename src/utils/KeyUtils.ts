// //src/utils/KeyUtils.ts

// export const convertPEMToEthereumFormat = (pemKey: string): string => {
//     try {
//         // Decode base64 to get PEM string
//         const pemString = Buffer.from(pemKey, 'base64').toString('utf-8');
        
//         // Extract the key data between BEGIN and END markers
//         const keyMatch = pemString.match(/-----BEGIN.*KEY-----\n([^-]+)\n-----END.*KEY-----/);
//         if (!keyMatch) throw new Error('Invalid PEM format');
        
//         // Get the raw key data and remove any whitespace
//         const rawKey = keyMatch[1].replace(/\s/g, '');
        
//         // Convert to hex and add 0x prefix
//         const hexKey = '0x' + Buffer.from(rawKey, 'base64').toString('hex');

//         // Validate key length for BSC compatibility
//         if (hexKey.length < 66) {
//             throw new Error('Generated key is too short for BSC');
//         }

//         return hexKey;
//     } catch (error) {
//         console.error('Key conversion error:', error);
//         throw new Error('Failed to convert PEM key to BSC-compatible format');
//     }
// };