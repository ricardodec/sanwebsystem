import { registerAs } from '@nestjs/config';
import { AppConfig } from './../../common/app.config';

export default registerAs('jwt', () => {
    const { jwt } = AppConfig.getConstants();
    return jwt;
});
