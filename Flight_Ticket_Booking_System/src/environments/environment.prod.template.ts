export const environment = {
  production: true,
  encryption: {
    secretKey: "${ENCRYPTION_SECRET_KEY}",
    iv: "${ENCRYPTION_IV}",
    googleClientId:
      "${SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID}",
  },
};
