//src/components/EmailDisplay.tsx

import React, { useState } from 'react';
import { getContract } from '@/utils/blockchainUtils';

const EmailsDisplay = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmails, setShowEmails] = useState(false);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      setError('');
      const contract = await getContract();
      
      // Get all emails that have generated keys
      const generatedEmails = await contract.getGeneratedEmails();
      setEmails(generatedEmails);
    } catch (err) {
      console.error('Error fetching emails:', err);
      setError('Failed to fetch registered emails');
    } finally {
      setLoading(false);
    }
  };

  const toggleDisplay = async () => {
    if (!showEmails) {
      await fetchEmails();
    }
    setShowEmails(!showEmails);
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <button
        onClick={toggleDisplay}
        className="mb-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
      >
        {showEmails ? 'Hide Registered Emails' : 'Show Registered Emails'}
      </button>

      {loading && (
        <div className="text-gray-600 animate-pulse">Loading registered emails...</div>
      )}
      
      {error && (
        <div className="text-red-600 mb-4 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      {showEmails && !loading && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2">Registered Emails</h3>
          {emails.length === 0 ? (
            <p className="text-gray-600">No emails registered yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {emails.map((email, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow"
                >
                  <p className="text-gray-700 break-all font-medium">
                    {email}
                  </p>
                </div>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-500 mt-4">
            Total Registered: {emails.length} email{emails.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailsDisplay;