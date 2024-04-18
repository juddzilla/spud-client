
import { createContext } from 'react';

export const AuthContext = createContext({    
    session: null,
    isLoading: true,
  });