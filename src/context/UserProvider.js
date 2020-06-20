import React, { useState, createContext } from 'react';

export const UserContext = createContext({});

function UserProvider(props) {
  // eslint-disable-next-line react/prop-types
  const { children } = props;
  const [user, setUser] = useState({});

  const value = {
    userState: user,
    setUserState: (userInfo) => {
      setUser(userInfo);
    },
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserProvider;
