import React, { createContext, useContext } from 'react';
import { useProductReducer } from './reducers';;

// instantiate the global state obj
const StoreContext = createContext();  // create container to hold global state data
const { Provider } = StoreContext;  // makes datat passed in as a prop available for other components

// manages and updates state
const StoreProvider = ({ value = [], ...props }) => {
    const [state, dispatch] = useProductReducer({
        products: [],
        cart:[],
        cartOpen: false,
        categories: [],
        currentCategory: '',
    });
    // use this to confirm it works!
    console.log(state);
    return <Provider value={[state, dispatch]} {...props} />;
};

const useStoreContext = () => {
    return useContext(StoreContext);
};


export { StoreProvider, useStoreContext };