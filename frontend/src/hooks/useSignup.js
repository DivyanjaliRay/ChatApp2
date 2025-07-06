//original
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const signup = async ({ fullName, username, password, confirmPassword, gender }) => {
        const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });
        if (!success) return;

        setLoading(true);
        try {
            // Prepare request body
            const requestBody = JSON.stringify({ fullName, username, password, confirmPassword, gender });
            console.log("Request Body:", requestBody); // Log the request body for debugging

            // Make API call to the signup endpoint
            const res = await fetch("http://localhost:8000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: requestBody,
                credentials: 'include' // Include cookies in the request
            });

            // Check if the response is not ok
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
            }

            // Parse the response JSON
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            // Show success message
            toast.success("Successfully registered!");

            // Update authentication context with the full response data (including token)
            setAuthUser(data);

        } catch (error) {
            // Show error message
            toast.error(error.message || "Registration failed");
        } finally {
            // Reset loading state
            setLoading(false);
        }
    };

    return { loading, signup };
};

export default useSignup;

function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
    // Check if any field is empty
    if (!fullName || !username || !password || !confirmPassword || !gender) {
        toast.error("Please fill in all the fields");
        return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return false;
    }

    // Check if password length is valid
    if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
    }

    // Additional validations can be added here if needed

    return true;
}



// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useAuthContext } from "../context/AuthContext";

// const useSignup = () => {
// 	const [loading, setLoading] = useState(false);
// 	const { setAuthUser } = useAuthContext();

// 	const signup = async ({ fullName, username, password, confirmPassword, gender }) => {
// 		const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });
// 		if (!success) return;

// 		setLoading(true);
// 		try {
// 			const res = await fetch("/api/auth/signup", {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({ fullName, username, password, confirmPassword, gender }),
// 			});

// 			const data = await res.json();
// 			if (data.error) {
// 				throw new Error(data.error);
// 			}
// 			localStorage.setItem("chat-user", JSON.stringify(data));
// 			setAuthUser(data);
// 		} catch (error) {
// 			toast.error(error.message);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return { loading, signup };
// };
// export default useSignup;
// function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
// 	if (!fullName || !username || !password || !confirmPassword || !gender) {
// 		toast.error("Please fill in all fields");
// 		return false;
// 	}

// 	if (password !== confirmPassword) {
// 		toast.error("Passwords do not match");
// 		return false;
// 	}

// 	if (password.length < 6) {
// 		toast.error("Password must be at least 6 characters");
// 		return false;
// 	}

// 	return true;
// }



//change chatgpt1
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useAuthContext } from "../context/AuthContext";

// const useSignup = () => {
//     const [loading, setLoading] = useState(false);
//     const { setAuthUser } = useAuthContext();

//     const signup = async ({ fullName, username, password, confirmPassword, gender }) => {
//         // Validate inputs before sending API request
//         if (!handleInputErrors({ fullName, username, password, confirmPassword, gender })) {
//             return;
//         }

//         setLoading(true);
//         try {
//             // API request body
//             const requestBody = JSON.stringify({ fullName, username, password, gender });

//             // Make API call to the signup endpoint
//             const res = await fetch("http://localhost:8000/api/auth/signup", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: requestBody
//             });

//             // If response is not ok, handle the error
//             if (!res.ok) {
//                 const errorData = await res.json();
//                 throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
//             }

//             // Parse response JSON
//             const data = await res.json();

//             // Check for errors in response
//             if (data.error) {
//                 throw new Error(data.error);
//             }

//             // Show success message
//             toast.success("Successfully registered!");

//             // Save user data and token to localStorage
//             localStorage.setItem("chat-user", JSON.stringify(data.user)); // Store user
//             localStorage.setItem("auth-token", data.token); // Store token

//             // Update authentication context
//             setAuthUser(data.user);

//         } catch (error) {
//             // Display error message
//             toast.error(error.message || "Registration failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return { loading, signup };
// };

// export default useSignup;

// // Function to handle input validation
// function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
//     if (!fullName || !username || !password || !confirmPassword || !gender) {
//         toast.error("Please fill in all the fields");
//         return false;
//     }

//     if (password !== confirmPassword) {
//         toast.error("Passwords do not match");
//         return false;
//     }

//     if (password.length < 6) {
//         toast.error("Password must be at least 6 characters");
//         return false;
//     }

//     return true;
// }
