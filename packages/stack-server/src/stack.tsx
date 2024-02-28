import { StackServerApp } from 'stack';
import { throwErr } from 'stack-shared/dist/utils/errors';

export const stackServerApp = new StackServerApp({
  baseUrl: process.env.NEXT_PUBLIC_STACK_URL || throwErr('missing NEXT_PUBLIC_STACK_URL environment variable'),
  tokenStore: "nextjs-cookie",
  urls: {
    userHome: "/projects",
  }
});
