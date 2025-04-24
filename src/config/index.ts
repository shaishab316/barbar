import './configure';
import env from '../util/env/env';
import type ms from 'ms';
import { genSecret } from '../util/crypto/genSecret';
import getIpAddress from '../util/server/getIpAddress';

const ip_address = env('ip address', getIpAddress());
const port = env('port', Math.floor(Math.random() * 1_000) + 3_000);
const href = env('href', `http://${ip_address}:${port}`);
const name = env('name', 'Campus Couch');
const email = env('email user', 'admin@gmail.com');

/**
 * Configuration object for the application
 *
 * This object contains various configuration settings for the application,
 * including server details, database connection, allowed origins, and authentication settings.
 */
const config = {
  server: {
    developer: env('developer', 'Shaishab Chandra Shil'),
    node_env: env('node env', 'development'),
    ip_address,
    port,
    href,
    name,
    logo: env('logo', '/images/logo.png'),
    default_avatar: env('default avatar', '/images/placeholder.png'),
  },
  url: {
    database: env(
      'database url',
      `mongodb://127.0.0.1:27017/${name.toLowerCase().replace(' ', '-')}`,
    ),
    payment: {
      success: env('payment success url', `${href}/payment/success`),
      cancel: env('payment cancel url', `${href}/payment/cancel`),
    },
  },
  allowed_origins: env('allowed origins', ['*']),
  bcrypt_salt_rounds: env('bcrypt salt rounds', 10),
  jwt: {
    access_token: {
      secret: env('jwt access secret', genSecret()),
      expire_in: env<ms.StringValue>('jwt access expire in', '1d'),
    },
    refresh_token: {
      secret: env('jwt refresh secret', genSecret()),
      expire_in: env<ms.StringValue>('jwt refresh expire in', '30d'),
    },
  },
  payment: {
    stripe: {
      secret: env('stripe secret', ''),
      webhook: env('stripe webhook', ''),
    },
    methods: env<[string, ...string[]]>('payment methods', ['card']),
    default_method: env('default payment method', 'card'),
  },
  email: {
    user: email,
    from: `${name} <${email}>`,
    port: env('email port', 587),
    host: env('email host', 'smtp.gmail.com'),
    pass: env('email pass', ''),
  },
  admin: {
    name: env('admin name', 'Mr. Admin'),
    email: env('admin email', email),
    password: env('admin password', genSecret(4)),
  },
};

export default config;
