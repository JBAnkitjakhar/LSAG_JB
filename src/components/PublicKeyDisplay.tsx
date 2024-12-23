//src/components/PublicKeyDisplay.tsx

import React, { useState } from 'react';
import { getContract } from '@/utils/blockchainUtils';

const PublicKeysDisplay = () => {
  const [publicKeys, setPublicKeys] = useState<{ email: string; key: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showKeys, setShowKeys] = useState(false);

  const fetchPublicKeys = async () => {
    try {
      setLoading(true);
      setError('');
      const contract = await getContract();

      // Get all emails that have generated keys
      const emails = await contract.getGeneratedEmails();

      // Fetch public key for each email
      const keyPromises = emails.map(async (email: string) => {
        const key = await contract.getPublicKeyByEmail(email);
        return { email, key };
      });

      const allKeys = await Promise.all(keyPromises);
      setPublicKeys(allKeys.filter(k => k.key !== '')); // Only show emails with submitted keys
    } catch (err) {
      console.error('Error fetching public keys:', err);
      setError('Failed to fetch public keys');
    } finally {
      setLoading(false);
    }
  };

  const toggleDisplay = async () => {
    if (!showKeys) {
      await fetchPublicKeys();
    }
    setShowKeys(!showKeys);
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <button
        onClick={toggleDisplay}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {showKeys ? 'Hide Public Keys' : 'Show All Public Keys'}
      </button>

      {loading && <div className="text-gray-600">Loading public keys...</div>}

      {error && (
        <div className="text-red-600 mb-4">
          {error}
        </div>
      )}

      {showKeys && !loading && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2">Registered Public Keys</h3>
          {publicKeys.length === 0 ? (
            <p className="text-gray-600">No public keys submitted yet.</p>
          ) : (
            <>
              <div className="space-y-4">
                {publicKeys.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-700 mb-2">Email: {item.email}</p>
                    <p className="text-sm break-all bg-white p-2 rounded border">
                      {item.key}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Total Submitted: {publicKeys.length} public key{publicKeys.length !== 1 ? 's' : ''}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PublicKeysDisplay;