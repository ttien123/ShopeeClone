import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth';

import { createContext, useState } from 'react';
import { user } from 'src/types/user.type';
import { ExtendedPurchase } from 'src/types/purchase.type';

interface AppContextInterface {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    profile: user | null;
    setProfile: React.Dispatch<React.SetStateAction<user | null>>;
    extendedPurchases: ExtendedPurchase[];
    setExtendedPurchases: React.Dispatch<React.SetStateAction<ExtendedPurchase[]>>;
    reset: () => void;
}

const initialAppContext: AppContextInterface = {
    isAuthenticated: Boolean(getAccessTokenFromLS()),
    setIsAuthenticated: () => null,
    profile: getProfileFromLS(),
    setProfile: () => null,
    extendedPurchases: [],
    setExtendedPurchases: () => null,
    reset: () => null,
};

export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated);
    const [profile, setProfile] = useState<user | null>(initialAppContext.profile);
    const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchase[]>(initialAppContext.extendedPurchases);

    const reset = () => {
        setIsAuthenticated(false);
        setExtendedPurchases([]);
        setProfile(null);
    };

    return (
        <AppContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                profile,
                setProfile,
                extendedPurchases,
                setExtendedPurchases,
                reset,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
