import React, { useContext } from 'react';
import logo from './logo.svg';
import './App.css';
import { AuthContext, AuthProvider, IAuthContext, TAuthConfig, TRefreshTokenExpiredEvent } from "react-oauth2-code-pkce"

const authConfig: TAuthConfig = {
  clientId: 'algopack',
  authorizationEndpoint: 'https://sso2.beta.moex.com/auth/realms/SSO/protocol/openid-connect/auth',
  tokenEndpoint: 'https://sso2.beta.moex.com/auth/realms/SSO/protocol/openid-connect/token',
  redirectUri: 'http://localhost:3000/',
  scope: 'openid',
  onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) => window.confirm('Session expired. Refresh page to continue using the site?') && event.login(),
  autoLogin: false,
}

const UserInfo = (): JSX.Element => {

  const {token, tokenData, login, logOut} = useContext<IAuthContext>(AuthContext)

  return <>
    <h4>Access Token</h4>
    <pre>{token}</pre>
    <h4>User Information from JWT</h4>
    <pre>{JSON.stringify(tokenData, null, 2)}</pre>

    <button onClick={()=>login()}>Login</button>
    <button onClick={()=>logOut()}>Logout</button>
  </>
}

function App() {

  return (
    <div className="App">
      <AuthProvider authConfig={authConfig}>
        <UserInfo/>
      </AuthProvider>
    </div>
  );
}

export default App;
