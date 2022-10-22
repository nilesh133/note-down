import React, { createContext, useState } from 'react';

export const CodeContext = createContext();
const ContextProvider = ({ children }) => {
    const[pageId, setPageId] = useState("None")

    return (
        <CodeContext.Provider value={{
            pageId,
            setPageId,
        }}>
            {children}
        </CodeContext.Provider>
    )
};

export default ContextProvider;
