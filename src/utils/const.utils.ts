export const HASH_PASSWORD_SALT = 10;

export const OTP_STATUS = {
  _ACTIVE: 'active', //~ Newest OTP for single email
  _VERIFIED: 'verified', //~ After used on OTP Verification
  _COMPLETED: 'completed', //~ After used on Complete Profile or Set Password
  _EXPIRED: 'expired', //~ Old OTP for the same email
};
export const OTP_PURPOSE = {
  _FORGOT_PASSWORD: 'forgot_password',
  _SET_PASSWORD: 'set_password',
  _REGISTER: 'register',
};
export const OTP_EXPIRATION = 5 * 60 * 1000; //~ 5 minutes
export const OTP_LENGTH = 6;
export const OTP_ATTEMPTS = 3;

export const TEMP_TOKEN_LENGTH = 12;
