import { createApp } from './app.js';
import { db, initializeDatabase } from './db.js';
import { sendVerificationCode } from './email.js';
import { provisionAdmin } from './provision-admin.js';

const port = Number(process.env.PORT || 3001);
const adminConfig = {
  name: process.env.ADMIN_NAME,
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};
const configuredAdminFields = Object.values(adminConfig).filter(Boolean).length;
const localConsoleOtp = process.env.NODE_ENV !== 'production'
  && (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL);
const authOptions = localConsoleOtp
  ? {
      sendOtp: async ({ email, code, purpose }) => {
        console.info(`[LOCAL ONLY] ${purpose} code for ${email}: ${code}`);
      },
    }
  : { sendOtp: sendVerificationCode };

try {
  if (process.env.NODE_ENV === 'production' && configuredAdminFields !== 3) {
    throw new Error('Production startup requires ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD.');
  }
  if (configuredAdminFields !== 0 && configuredAdminFields !== 3) {
    throw new Error('Set all three admin variables together: ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD.');
  }
  await initializeDatabase(db);
  if (configuredAdminFields === 3) await provisionAdmin(db, adminConfig);
  const app = createApp(db, { authOptions });
  app.listen(port, '0.0.0.0', () => {
    console.log(`TalentX server listening on 0.0.0.0:${port}`);
    if (localConsoleOtp) {
      console.warn('Local OTP mode is enabled: verification codes are printed only in this development terminal.');
    }
  });
} catch (error) {
  console.error('Failed to initialize TalentX database:', error);
  await db.end();
  process.exitCode = 1;
}
