//original
// import { createContext, useContext, useState } from "react";

// export const AuthContext = createContext();

// export const useAuthContext = () => {
//     return useContext(AuthContext);
// }

// export const AuthContextProvider = ({children}) => {
//     const [authUser,setAuthUser]=useState(JSON.parse(localStorage.getItem("chat-user")) || null)
//     return <AuthContext.Provider value={{authUser,setAuthUser}}>
//         {children}
//         </AuthContext.Provider>
// };

import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(() => {
		const storedUser = localStorage.getItem("chat-user");
		return storedUser ? JSON.parse(storedUser) : null;
	});

	// Save user to local storage when it changes
	useEffect(() => {
		if (authUser) {
			localStorage.setItem("chat-user", JSON.stringify(authUser));
			// Store token separately
			if (authUser.token) {
				localStorage.setItem("token", authUser.token);
			}
		} else {
			localStorage.removeItem("chat-user");
			localStorage.removeItem("token");
		}
	}, [authUser]);

	return (
		<AuthContext.Provider value={{ authUser, setAuthUser }}>
			{children}
		</AuthContext.Provider>
	);
};


//change 1 
// import { createContext, useContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const useAuthContext = () => {
//     return useContext(AuthContext);
// };

// export const AuthContextProvider = ({ children }) => {
//     const [authUser, setAuthUser] = useState(() => {
//         const storedUser = localStorage.getItem("chat-user");
//         return storedUser ? JSON.parse(storedUser) : null;
//     });

//     // Save user to local storage when it changes
//     useEffect(() => {
//         if (authUser) {
//             localStorage.setItem("chat-user", JSON.stringify(authUser));
//         } else {
//             localStorage.removeItem("chat-user");
//         }
//     }, [authUser]);

//     return (
//         <AuthContext.Provider value={{ authUser, setAuthUser }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

//change 2
// import { createContext, useContext, useState } from "react";

// export const AuthContext = createContext();

// export const useAuthContext = () => {
//     return useContext(AuthContext);
// }

// export const AuthContextProvider = ({children}) => {
//     const [authUser,setAuthUser]=useState(JSON.parse(localStorage.getItem("chat-user")) || null)
//     return <AuthContext.Provider value={{authUser,setAuthUser}}>
//         {children}
//         </AuthContext.Provider>
// };