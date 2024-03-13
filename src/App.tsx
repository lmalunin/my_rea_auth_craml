import React, { useContext } from 'react';
import logo from './logo.svg';
import './App.css';
import { AuthContext, AuthProvider, IAuthContext, TAuthConfig, TRefreshTokenExpiredEvent } from "react-oauth2-code-pkce"


declare global {
  interface Window {
    replace:any;
  }
}

export const generateState = (): string => {
  
  const stateObj = JSON.stringify({
    'simple': 'true',
    'authState': crypto.randomUUID(),
    'browserId': crypto.randomUUID()
  });
  
  return btoa(stateObj)
}

export const generateRandomString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()=+-';
  const charactersLength = characters.length;
  let result = '';
  
  const randomValues = new Uint32Array(length);
  
  // Generate random values
  crypto.getRandomValues(randomValues);
  randomValues.forEach((value) => {
    result += characters.charAt(value % charactersLength);
  });
  return result;
};

const authConfig: TAuthConfig = {
  clientId: 'algopack',
  authorizationEndpoint: 'https://sso2.beta.moex.com/auth/realms/SSO/protocol/openid-connect/auth',
  tokenEndpoint: 'https://sso2.beta.moex.com/auth/realms/SSO/protocol/openid-connect/token',
  redirectUri: 'http://localhost:3000/',
  scope: 'openid',
  onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) => window.confirm('Session expired. Refresh page to continue using the site?') && event.login(),
  autoLogin: false,
  state: generateRandomString(120),
}

const authConfig1: TAuthConfig = {
  clientId: 'datashop',
  authorizationEndpoint: 'https://sso2.beta.moex.com/auth/realms/craml-rc/protocol/openid-connect/auth',
  tokenEndpoint: 'https://sso2.beta.moex.com/auth/realms/craml-rc/protocol/openid-connect/token',
  redirectUri: 'http://localhost:3000/',
  scope: 'openid',
  onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) => window.confirm('Session expired. Refresh page to continue using the site?') && event.login(),
  autoLogin: false,
  state: generateState(),
  extraAuthParameters: {
    nonce: crypto.randomUUID(),
    response_mode: 'query',
    response_type: 'code',
  }
}

const UserInfo = (): JSX.Element => {

  const {token, tokenData, login, logOut} = useContext<IAuthContext>(AuthContext)

  
  return <>
    <h4>Access Token</h4>
    <pre>{token}</pre>
    <h4>User Information from JWT</h4>
    <pre>{JSON.stringify(tokenData, null, 2)}</pre>
    

    
    <button onClick={()=>window.location.href='http://localhost:3000'}>Home</button>
    <button onClick={()=>login()}>Login</button>
    <button onClick={()=>logOut()}>Logout</button>
  </>
}

function App() {

  return (
    <div className="App">
      <AuthProvider authConfig={authConfig1}>
        <UserInfo/>
      </AuthProvider>
    </div>
  );
}

export default App;
