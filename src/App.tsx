import React, { useContext } from 'react';
import logo from './logo.svg';
import './App.css';
import { AuthContext, AuthProvider, IAuthContext, TAuthConfig, TRefreshTokenExpiredEvent } from 'react-oauth2-code-pkce'
import { sha256 } from 'js-sha256';
import base64Js from 'base64-js';

declare global {
    interface Window {
        replace: any;
    }
}

export const loadScript = (url?: string, content?: string, defer = true) => {
    const script = document.createElement('script');
    script.innerHTML = content ?? '';
    script.src = url ?? '';
    script.async = false;
    script.defer = defer;
    document.body.appendChild(script);
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
    
    const { token, tokenData, login, logOut } = useContext<IAuthContext>(AuthContext)
    
    async function digestMessage(message: string) {
        const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
        const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
        const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, '0'))
            .join(''); // convert bytes to hex string
        return hashHex;
    }
    
    function sha256hash(message: string) {
        let hashBytes = new Uint8Array(sha256.arrayBuffer(message));
        let encodedHash = base64Js.fromByteArray(hashBytes)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/\=/g, '');
        
        console.log('sha256hash', encodedHash);
        
        return encodedHash;
    }
    
    let linkEsia: string = '';
    let linkMobileId: string = '';
    
    if (token) {
        
        // const nonce = crypto.randomUUID();
        // const session_state: string = tokenData?.session_state;
        // const clientId = process.env.REACT_APP_CLIENT_ID;
        // const provider = process.env.REACT_APP_REALM;
        
        //from maxim
        // const nonce = '35c6408e-b18e-43a7-9e62-48bcbcc83381';
        // const session_state: string = '8eaf445a-3c24-4976-bcf6-7ee3b98173b1';
        // const clientId = 'mpstub';
        // const provider = 'mobileid';
        
        const nonce = crypto.randomUUID();
        const session_state: string = tokenData?.session_state;
        const clientId = 'datashop';
        const providerEsia = 'esia';
        const providerMobileId = 'mobileid';
        
        const strResEsia = nonce + session_state + clientId + providerEsia;
        const strResMobileId = nonce + session_state + clientId + providerMobileId;
        
        //console.log('strRes', strRes);
        
        linkEsia = `https://sso2.beta.moex.com/auth/realms/craml-rc/broker/${providerEsia}/link?client_id=datashop&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&nonce=${nonce}&hash=${sha256hash(strResEsia)}`
        linkMobileId = `https://sso2.beta.moex.com/auth/realms/craml-rc/broker/${strResMobileId}/link?client_id=datashop&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&nonce=${nonce}&hash=${sha256hash(strResMobileId)}`
    }
    
    return <>
        <h4>Access Token</h4>
        <pre>{token}</pre>
        
        <h4>User Information from JWT</h4>
        <pre>{JSON.stringify(tokenData, null, 2)}</pre>
        
        
        <button onClick={() => window.location.href = 'http://localhost:3000'}>Home</button>
        <button onClick={() => login()}>Login</button>
        <span>  </span>
        <a target="_blank" rel="noreferrer" href={linkEsia}>
            ESIA
        </a>
        <span>  </span>
        <a target="_blank" rel="noreferrer" href={linkMobileId}>
            MobileId
        </a>
        <span>  </span>
        <button onClick={() => loadScript(process.env.PUBLIC_URL + '/browser-id.js')}>Load script</button>
        <span>  </span>
        <button onClick={() => logOut()}>Logout</button>
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
