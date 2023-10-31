import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth';

import { createContext, useState } from 'react';
import { user } from 'src/types/user.type';

interface AppContextInterface {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    profile: user | null;
    setProfile: React.Dispatch<React.SetStateAction<user | null>>;
}

const initialAppContext: AppContextInterface = {
    isAuthenticated: Boolean(getAccessTokenFromLS()),
    setIsAuthenticated: () => null,
    profile: getProfileFromLS(),
    setProfile: () => null,
};

export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated);
    const [profile, setProfile] = useState<user | null>(initialAppContext.profile);
    return (
        <AppContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                profile,
                setProfile,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
