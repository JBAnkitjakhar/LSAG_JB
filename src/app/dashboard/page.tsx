 
// src/app/dashboard/page.tsx
 "use client"
import React from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import { VOTING_CONTRACT_ADDRESS } from '@/constants';
import RegistrationPage from '@/components/registration';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

const Dashboard = () => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(VOTING_CONTRACT_ADDRESS);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleViewOnBscScan = () => {
    window.open(`https://testnet.bscscan.com/address/${VOTING_CONTRACT_ADDRESS}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="space-y-6 p-6">
            <h2 className="text-2xl font-bold text-gray-900">Smart Contract Details</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Contract Address</label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 bg-gray-100 p-3 rounded-lg text-sm break-all font-mono">
                  {VOTING_CONTRACT_ADDRESS}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <HoverBorderGradient>
              <button
                onClick={handleViewOnBscScan}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-200"
              >
                View on BSCScan
                <ExternalLink className="w-4 h-4" />
              </button>
            </HoverBorderGradient>
          </div>
        </div>

        <RegistrationPage />
      </div>
    </div>
  );
};

export default Dashboard;