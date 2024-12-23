 
 
// //src/components/registration.tsx

// 'use client'

// import { useState } from 'react';

// const RegistrationPage = () => {
//   const [keys, setKeys] = useState<{ publicKey: string; privateKey: string } | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const generateKeys = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       const response = await fetch('http://localhost:8080/generate-keys', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to generate keys');
//       }

//       const keyData = await response.json();
//       setKeys(keyData);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to generate keys');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadKeys = () => {
//     if (!keys) return;
    
//     const content = `Public Key:\n${keys.publicKey}\n\nPrivate Key:\n${keys.privateKey}`;
//     const blob = new Blob([content], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
    
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'voting-keys.txt';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
// };

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">E-Voting Dashboard</h1>
        
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">Generate Your Keys</h2>
          
//           <button 
//             onClick={generateKeys}
//             disabled={loading}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 mb-4"
//           >
//             {loading ? 'Generating Keys...' : 'Generate New Keys'}
//           </button>

//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//               {error}
//             </div>
//           )}

//           {keys && (
//             <div className="space-y-4">
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-medium mb-2">Public Key:</h3>
//                 <p className="break-all text-sm bg-white p-2 rounded border">
//                   {keys.publicKey}
//                 </p>
//               </div>
              
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-medium mb-2">Private Key:</h3>
//                 <p className="break-all text-sm bg-white p-2 rounded border">
//                   {keys.privateKey}
//                 </p>
//               </div>

//               <button 
//                 onClick={downloadKeys}
//                 className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//               >
//                 Download Keys
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegistrationPage;
