import { AppConfig } from './../../common/app.config';
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  const { jwt } = AppConfig.getConstants();
  return jwt;
});
