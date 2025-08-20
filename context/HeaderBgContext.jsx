import { createContext, useContext } from "react";

export const HeaderBgContext = createContext();

export const useHeaderBg = () => {
    const context = useContext(HeaderBgContext);
    if (!context) {
        throw new Error('useHeaderBg must be used within HeaderBgProvider');
    }
    return context;
};
