import { useReducer,createContext, useEffect } from "react";

export const ThemeContext = createContext();

export const themeReducer = (state,action) => {
    switch (action.type) {
        case 'SET_DARK':
            return {theme:'dark'};
        case 'SET_LIGHT':
            return {theme:'light'};
        default:
            return state;
    }
};

export const ThemeContextProvider = ({children}) => {
    const [state,dispatch] = useReducer(themeReducer,{theme:'light'});
    useEffect(()=>{
        const theme_ex = JSON.parse(localStorage.getItem('ref_theme'));
        if (theme_ex == 'light') {
            dispatch({type:"light"})
        }
        else {
            dispatch({type:"dark"})
        }
    },[]);
    return (
        <ThemeContext.Provider value={{...state,dispatch}}>
            {children}
        </ThemeContext.Provider>
    )
}