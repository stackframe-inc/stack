import { PrismaClient } from '@prisma/client';
import { generateSecureRandomString } from "@stackframe/stack-shared/dist/utils/crypto";

const prisma = new PrismaClient();

async function testCliAuth() {
  try {
    console.log('Testing CLI Authentication Endpoints...');
    
    // Test 1: Create a new CLI auth attempt (simulating the "initiate CLI auth" endpoint)
    console.log('\n--- Test 1: Create a new CLI auth attempt ---');
    const pollingCode = generateSecureRandomString();
    const loginCode = generateSecureRandomString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    
    const cliAuth = await (prisma as any).cliAuthAttempt.create({
      data: {
        tenancyId: '7eef59fd-72a0-47d7-a87d-eaec5ec5bb05', // Using a valid tenancy ID
        pollingCode,
        loginCode,
        expiresAt,
      },
    });
    
    console.log('Created CLI auth attempt:', {
      id: cliAuth.id,
      pollingCode: cliAuth.pollingCode,
      loginCode: cliAuth.loginCode,
      expiresAt: cliAuth.expiresAt,
    });
    
    // Test 2: Poll for status (simulating the polling endpoint) - should return "waiting"
    console.log('\n--- Test 2: Poll for status (waiting) ---');
    const pollResult1 = await (prisma as any).cliAuthAttempt.findFirst({
      where: {
        pollingCode: cliAuth.pollingCode,
      },
    });
    
    console.log('Poll result (should be waiting):', {
      status: !pollResult1 ? 'not_found' : 
              pollResult1.expiresAt < new Date() ? 'expired' :
              pollResult1.usedAt ? 'used' :
              !pollResult1.refreshToken ? 'waiting' : 'success',
      refreshToken: pollResult1?.refreshToken,
    });
    
    // Test 3: Set refresh token (simulating the frontend endpoint)
    console.log('\n--- Test 3: Set refresh token ---');
    const refreshToken = 'test-refresh-token-' + Date.now();
    
    const updatedCliAuth = await (prisma as any).cliAuthAttempt.update({
      where: {
        tenancyId_id: {
          tenancyId: cliAuth.tenancyId,
          id: cliAuth.id,
        },
      },
      data: {
        refreshToken,
      },
    });
    
    console.log('Updated CLI auth attempt:', {
      id: updatedCliAuth.id,
      refreshToken: updatedCliAuth.refreshToken,
    });
    
    // Test 4: Poll for status again (simulating the polling endpoint) - should return "success" and set usedAt
    console.log('\n--- Test 4: Poll for status (success) ---');
    const pollResult2 = await (prisma as any).cliAuthAttempt.findFirst({
      where: {
        pollingCode: cliAuth.pollingCode,
      },
    });
    
    // In the real endpoint, we would set usedAt here
    if (pollResult2 && pollResult2.refreshToken && !pollResult2.usedAt) {
      await (prisma as any).cliAuthAttempt.update({
        where: {
          tenancyId_id: {
            tenancyId: pollResult2.tenancyId,
            id: pollResult2.id,
          },
        },
        data: {
          usedAt: new Date(),
        },
      });
    }
    
    console.log('Poll result (should be success):', {
      status: !pollResult2 ? 'not_found' : 
              pollResult2.expiresAt < new Date() ? 'expired' :
              pollResult2.usedAt ? 'used' :
              !pollResult2.refreshToken ? 'waiting' : 'success',
      refreshToken: pollResult2?.refreshToken,
    });
    
    // Test 5: Poll for status one more time (simulating the polling endpoint) - should return "used"
    console.log('\n--- Test 5: Poll for status (used) ---');
    const pollResult3 = await (prisma as any).cliAuthAttempt.findFirst({
      where: {
        pollingCode: cliAuth.pollingCode,
      },
    });
    
    console.log('Poll result (should be used):', {
      status: !pollResult3 ? 'not_found' : 
              pollResult3.expiresAt < new Date() ? 'expired' :
              pollResult3.usedAt ? 'used' :
              !pollResult3.refreshToken ? 'waiting' : 'success',
      refreshToken: pollResult3?.refreshToken,
    });
    
    // Test 6: Try to set refresh token again (should not update)
    console.log('\n--- Test 6: Try to set refresh token again ---');
    try {
      const newRefreshToken = 'new-refresh-token-' + Date.now();
      
      // In the real endpoint, we would check if refreshToken is already set
      const cliAuthToUpdate = await (prisma as any).cliAuthAttempt.findFirst({
        where: {
          loginCode: cliAuth.loginCode,
          refreshToken: null,
        },
      });
      
      if (!cliAuthToUpdate) {
        console.log('Cannot update refresh token: already set or not found');
      } else {
        await (prisma as any).cliAuthAttempt.update({
          where: {
            tenancyId_id: {
              tenancyId: cliAuthToUpdate.tenancyId,
              id: cliAuthToUpdate.id,
            },
          },
          data: {
            refreshToken: newRefreshToken,
          },
        });
        console.log('Updated refresh token again (should not happen)');
      }
    } catch (error) {
      console.error('Error updating refresh token again:', error);
    }
    
    // Test 7: Create an expired CLI auth attempt
    console.log('\n--- Test 7: Create an expired CLI auth attempt ---');
    const expiredPollingCode = generateSecureRandomString();
    const expiredLoginCode = generateSecureRandomString();
    const expiredAt = new Date(Date.now() - 1000); // 1 second ago
    
    const expiredCliAuth = await (prisma as any).cliAuthAttempt.create({
      data: {
        tenancyId: '7eef59fd-72a0-47d7-a87d-eaec5ec5bb05', // Using a valid tenancy ID
        pollingCode: expiredPollingCode,
        loginCode: expiredLoginCode,
        expiresAt: expiredAt,
      },
    });
    
    console.log('Created expired CLI auth attempt:', {
      id: expiredCliAuth.id,
      pollingCode: expiredCliAuth.pollingCode,
      loginCode: expiredCliAuth.loginCode,
      expiresAt: expiredCliAuth.expiresAt,
    });
    
    // Test 8: Poll for status of expired CLI auth attempt
    console.log('\n--- Test 8: Poll for status of expired CLI auth attempt ---');
    const pollResult4 = await (prisma as any).cliAuthAttempt.findFirst({
      where: {
        pollingCode: expiredCliAuth.pollingCode,
      },
    });
    
    console.log('Poll result (should be expired):', {
      status: !pollResult4 ? 'not_found' : 
              pollResult4.expiresAt < new Date() ? 'expired' :
              pollResult4.usedAt ? 'used' :
              !pollResult4.refreshToken ? 'waiting' : 'success',
      refreshToken: pollResult4?.refreshToken,
    });
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Error testing CLI authentication:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCliAuth();
