export const jwtConstants: JwtConstantsType = {
  secret: process.env.JWT_SECRET || 'somesecret',
};

type JwtConstantsType = {
  secret: string;
};
