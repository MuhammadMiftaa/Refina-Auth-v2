export const HASH_PASSWORD_SALT = 10;

export const OTP_STATUS = {
  _ACTIVE: 'active', //~ Newest OTP for single email
  _USED: 'used', //~ After used on OTP Verification
  _COMPLETED: 'completed', //~ After used on Complete Profile
  _EXPIRED: 'expired', //~ Old OTP for the same email
};
export const OTP_EXPIRATION = 5 * 60 * 1000; //~ 5 minutes
export const OTP_LENGTH = 6;
export const OTP_ATTEMPTS = 3;

export const TEMP_TOKEN_LENGTH = 12;
