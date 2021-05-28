import React, { useReducer } from "react";

const initialState = {
  user: null,
};
const StateContext = React.createContext(null);

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "setUser":
      return { ...state, user: action.payload };
    case "unsetUser":
      return { ...state, user: null };
    default:
      console.warn("Unknown reducer action received", action);
      return state;
  }
};

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <StateContext.Provider value={{ state, dispatch }}>{children}</StateContext.Provider>;
};

export { StateContext, StateProvider };
