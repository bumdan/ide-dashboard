// AuthKeycloak.js
import React, { useState, useEffect } from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import Keycloak from 'keycloak-js';

const kc = new Keycloak('/keycloak.json');

const AuthKeycloakProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
  kc.init({
      onLoad: 'login-required',
    }).then((authenticated) => {
      setIsInitialized(authenticated);
    });
  },[]);

  return isInitialized ? <ReactKeycloakProvider authClient={kc}>{children}</ReactKeycloakProvider> : null;
};

export { AuthKeycloakProvider };
