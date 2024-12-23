// src/components/registration.tsx

'use client'

import { useState, useEffect } from 'react';
import { generateKeysOnChain, submitPublicKey, checkKeyGeneration, checkPublicKeySubmission, getContract } from '@/utils/blockchainUtils';
import RegistrationTimer from './RegistrationTime';
import PublicKeysDisplay from './PublicKeyDisplay';
import EmailsDisplay from './EmailsDisplay';

interface Keys {
  publicKey: string;
  privateKey: string;
  status?: string;
  digest?: string;
  keyCoordinate?: string;
}

const RegistrationPage = () => {
  const [keys, setKeys] = useState<Keys | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [mode, setMode] = useState<'generate' | 'submit'>('generate');
  const [publicKeyInput, setPublicKeyInput] = useState('');
  const [hasGeneratedKey, setHasGeneratedKey] = useState<boolean>(false);
  const [hasSubmittedKey, setHasSubmittedKey] = useState<boolean>(false);

  // Check key generation and submission status when email changes
  useEffect(() => {
    const checkStatus = async () => {
      if (!email || !email.endsWith('@iitbhilai.ac.in')) return;
      
      try {
        const [generatedStatus, submittedStatus] = await Promise.all([
          checkKeyGeneration(email),
          checkPublicKeySubmission(email)
        ]);
        
        setHasGeneratedKey(generatedStatus);
        setHasSubmittedKey(submittedStatus);
      } catch (err) {
        console.error('Error checking key status:', err);
      }
    };

    checkStatus();
  }, [email]);

  // Check if email is eligible for the current operation
  const checkEmailEligibility = async (email: string): Promise<boolean> => {
    if (!email.endsWith('@iitbhilai.ac.in')) {
      setError('Please use an @iitbhilai.ac.in email address');
      return false;
    }

    try {
      if (mode === 'generate') {
        if (hasGeneratedKey) {
          setError('Keys have already been generated for this email');
          return false;
        }
      } else { // submit mode
        if (!hasGeneratedKey) {
          setError('You must generate keys before submitting. Please generate your keys first.');
          return false;
        }
        if (hasSubmittedKey) {
          setError('Public key has already been submitted for this email');
          return false;
        }
      }
      return true;
    } catch (err) {
      console.error('Error checking eligibility:', err);
      setError('Failed to verify email eligibility');
      return false;
    }
  };

  const sendVerificationEmail = async () => {
    try {
      const isEligible = await checkEmailEligibility(email);
      if (!isEligible) return;

      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'verification' }),
      });

      if (!response.ok) throw new Error('Failed to send verification email');
      setShowVerification(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification');
    }
  };

  const verifyCodeAndProceed = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'verify', verificationCode }),
      });

      const data = await response.json();
      if (!data.verified) throw new Error('Invalid verification code');

      if (mode === 'generate') {
        await generateKeys();
      } else {
        await submitKeys();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const generateKeys = async () => {
    try {
      setLoading(true);
      setError('');

      // Generate keys from Go server
      const response = await fetch('http://localhost:8080/generate-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to generate keys: ${errorData}`);
      }

      const keyData = await response.json();
      if (!keyData.publicKey || !keyData.privateKey || keyData.status !== 'success') {
        throw new Error('Invalid key data received from server');
      }

      // Record generation on blockchain
      await generateKeysOnChain(email);
      setHasGeneratedKey(true);

      // Save and send keys
      const keys = {
        publicKey: keyData.publicKey,
        privateKey: keyData.privateKey,
        status: keyData.status,
        digest: keyData.digest,
        keyCoordinate: keyData.keyCoordinate
      };
      setKeys(keys);

      // Send keys via email
      const emailResponse = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          type: 'keys',
          keys: keys,
        }),
      });

      if (!emailResponse.ok) {
        setError('Keys generated successfully but failed to send email. Please download your keys.');
      } else {
        setError('Keys generated and sent to your email successfully!');
      }
    } catch (err) {
      console.error('Key generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate keys');
      setKeys(null);
    } finally {
      setLoading(false);
    }
  };

  const submitKeys = async () => {
    try {
      setLoading(true);
      setError('');

      if (!publicKeyInput) {
        throw new Error('Please enter a public key');
      }

      await submitPublicKey(email, publicKeyInput);
      setHasSubmittedKey(true);
      setError('Public key submitted successfully!');
    } catch (err) {
      console.error('Key submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit public key');
    } finally {
      setLoading(false);
    }
  };

const downloadKeys = () => {
  if (!keys) return;
  const content = `Public Key:\n${keys.publicKey}\n\nPrivate Key:\n${keys.privateKey}\n\nDigest:\n${keys.digest}\n\nKey Coordinates:\n${keys.keyCoordinate}`;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'voting-keys.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

return (
  <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-4xl mx-auto">
      <RegistrationTimer />
      
      {/* Mode Selection Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setMode('generate');
            setError('');
            setEmail('');
            setShowVerification(false);
            setPublicKeyInput('');
            setVerificationCode('');
            setKeys(null);
            setLoading(false);
          }}
          className={`px-4 py-2 rounded transition-colors ${
            mode === 'generate' 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Generate Keys
        </button>
        <button
          onClick={() => {
            setMode('submit');
            setError('');
            setEmail('');
            setShowVerification(false);
            setPublicKeyInput('');
            setVerificationCode('');
            setKeys(null);
            setLoading(false);
          }}
          className={`px-4 py-2 rounded transition-colors ${
            mode === 'submit' 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Submit Public Key
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {mode === 'generate' ? 'Generate Your Keys' : 'Submit Your Public Key'}
        </h2>

        {/* Email and Verification Section */}
        {!showVerification ? (
          <div className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                onBlur={() => email && checkEmailEligibility(email)}
                placeholder="Enter your @iitbhilai.ac.in email"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
                disabled={loading}
              />
              
              {/* Email Status Messages */}
              {email && !error && (
                <div className="text-sm">
                  {mode === 'generate' && hasGeneratedKey && (
                    <p className="text-red-600">Keys have already been generated for this email</p>
                  )}
                  {mode === 'submit' && (
                    <>
                      {!hasGeneratedKey && (
                        <p className="text-red-600">Please generate keys first</p>
                      )}
                      {hasGeneratedKey && !hasSubmittedKey && (
                        <p className="text-green-600">Email verified - you can proceed with key submission</p>
                      )}
                      {hasSubmittedKey && (
                        <p className="text-red-600">Public key already submitted for this email</p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Public Key Input for Submit Mode */}
            {mode === 'submit' && hasGeneratedKey && !hasSubmittedKey && (
              <textarea
                value={publicKeyInput}
                onChange={(e) => setPublicKeyInput(e.target.value)}
                placeholder="Enter your public key"
                className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
                disabled={loading}
              />
            )}

            {/* Send Verification Button */}
            {((mode === 'generate' && !hasGeneratedKey) || 
               (mode === 'submit' && hasGeneratedKey && !hasSubmittedKey)) && (
              <button
                onClick={sendVerificationEmail}
                disabled={loading || !email.endsWith('@iitbhilai.ac.in')}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Processing...' : 'Send Verification Code'}
              </button>
            )}
          </div>
        ) : (
          /* Verification Code Section */
          <div className="space-y-4">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter verification code"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
              disabled={loading}
            />
            <button
              onClick={verifyCodeAndProceed}
              disabled={loading || !verificationCode}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Verify and Proceed'}
            </button>
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className={`px-4 py-3 rounded mt-4 ${
            error.includes('successfully') 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {error}
          </div>
        )}

        {/* Generated Keys Display */}
        {keys && mode === 'generate' && (
          <div className="mt-6 space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Public Key:</h3>
              <p className="break-all text-sm bg-white p-2 rounded border">
                {keys.publicKey}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Private Key:</h3>
              <p className="break-all text-sm bg-white p-2 rounded border">
                {keys.privateKey}
              </p>
            </div>

            {keys.digest && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Key Digest:</h3>
                <p className="break-all text-sm bg-white p-2 rounded border">
                  {keys.digest}
                </p>
              </div>
            )}

            {keys.keyCoordinate && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Key Coordinates:</h3>
                <p className="break-all text-sm bg-white p-2 rounded border">
                  {keys.keyCoordinate}
                </p>
              </div>
            )}

            <button 
              onClick={downloadKeys}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Download Keys
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Display Components */}
    <div className="space-y-6 mt-6">
      <PublicKeysDisplay />
      <EmailsDisplay />
    </div>
  </div>
);
}
export default RegistrationPage;