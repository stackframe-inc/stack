'use client';
import { AuthPage } from './auth-page';

export function SignUp(props: { fullPage?: boolean, automaticRedirect?: boolean, noPasswordRepeat?: boolean, reverseOrder?: boolean, extraInfo?: React.ReactNode }) {
  return <AuthPage fullPage={!!props.fullPage} type='sign-up' automaticRedirect={!!props.automaticRedirect} noPasswordRepeat={props.noPasswordRepeat} reverseOrder={props.reverseOrder} extraInfo={props.extraInfo} />;
}
