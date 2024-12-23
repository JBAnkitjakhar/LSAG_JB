 // src/app/api/sendEmail/route.ts
  
 import { NextResponse } from 'next/server';
 import { sendVerificationCode, sendKeys } from '@/utils/emailUtils';
 import { setVerificationCode, verifyCode } from '@/utils/redisClient';
 
 export async function POST(request: Request) {
   try {
     const { email, type, verificationCode, keys } = await request.json();
     // Basic email validation
     if (!email) {
       return NextResponse.json(
         { error: 'Email is required' },
         { status: 400 }
       );
     }
     // Domain validation
     if (!email.endsWith('@iitbhilai.ac.in')) {
       return NextResponse.json(
         { error: 'Invalid email domain' },
         { status: 400 }
       );
     }
  
     // Handle different request types
     switch (type) {
       case 'verification':
         // Generate and store verification code (expires in 10 minutes)
         const code = Math.floor(100000 + Math.random() * 900000).toString();
         
         try {
           await setVerificationCode(email, code);
         } catch (error) {
           console.error('Redis error:', error);
           return NextResponse.json({ 
             error: 'Failed to store verification code',
             success: false 
           }, { status: 500 });
         }
         
         // Send verification email
         const emailSuccess = await sendVerificationCode(email, code);
         if (!emailSuccess) {
           return NextResponse.json({ 
             error: 'Failed to send verification email',
             success: false 
           }, { status: 500 });
         }
         
         return NextResponse.json({ 
           message: 'Verification code sent successfully',
           success: true 
         });
  
       case 'verify':
         // Verify the code stored in Redis
         if (!verificationCode) {
           return NextResponse.json({ 
             verified: false,
             error: 'Verification code is required'
           }, { status: 400 });
         }
         const isValid = await verifyCode(email, verificationCode);
         return NextResponse.json({ 
           verified: isValid,
           message: isValid ? 'Code verified successfully' : 'Invalid verification code or code expired'
         });
 
       case 'keys':
         if (!keys || !keys.publicKey || !keys.privateKey) {
           return NextResponse.json({ 
             error: 'Invalid key data',
             success: false 
           }, { status: 400 });
         }
 
         // Send keys via email
         const keysEmailSuccess = await sendKeys(email, keys);
         if (!keysEmailSuccess) {
           return NextResponse.json({ 
             error: 'Failed to send keys email',
             success: false 
           }, { status: 500 });
         }
 
         return NextResponse.json({ 
           message: 'Keys sent successfully',
           success: true 
         });
  
       default:
         return NextResponse.json(
           { error: 'Invalid request type' },
           { status: 400 }
         );
     }
   } catch (error) {
     console.error('Email API error:', error);
     return NextResponse.json(
       { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
       { status: 500 }
     );
   }
 }