import React, { createContext, useContext } from "react";
import { useProductReducer } from "./reducers";

const StoreContext = createContext();
//Provider is a trype of React component that we wrap our application in so it to make the state data an available prop to all other components
const { Provider } = StoreContext;

//Consumer is how we grab and use data that the Provider holds

const StoreProvider = ({ value = [], ...props }) => {
  const [state, dispatch] = useProductReducer({
    products: [],
    cart: [],
    cartOpen: false,
    categories: [],
    currentCategory: "",
  });
  // use this to confirm it works!
  // console.log(state);
  return <Provider value={[state, dispatch]} {...props} />;
};

const useStoreContext = () => {
  return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };
