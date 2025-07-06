// hooks/useLogin.js

import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const login = async (username, password) => {
        if (!handleInputErrors(username, password)) return;
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Include cookies in requests
                body: JSON.stringify({ username, password })
            });

            // Capture and log the raw response
            const rawResponse = await res.text();
            console.log("Raw Response:", rawResponse);

            // Check if the response is in JSON format
            let data;
            try {
                data = JSON.parse(rawResponse);
            } catch (error) {
                throw new Error("Failed to parse response");
            }

            if (!res.ok) {
                throw new Error(data.error || "Login failed"); // Use server's error message if available
            }

            // Store user data and token in localStorage
            localStorage.setItem("chat-user", JSON.stringify(data));
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            setAuthUser(data);

            toast.success("Login successful!");
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return { loading, login };
};

export default useLogin;

function handleInputErrors(username, password) {
    // Ensure the values are strings and trim whitespace
    const trimmedUsername = String(username || "").trim();
    const trimmedPassword = String(password || "").trim();

    if (!trimmedUsername || !trimmedPassword) {
        toast.error("Please fill in all fields");
        return false;
    }

    // Optional: Add more validation if needed
    // For example, check for valid email format if username is an email
    // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedUsername)) {
    //     toast.error("Invalid email format");
    //     return false;
    // }

    // Optional: Check for password length
    // if (trimmedPassword.length < 6) {
    //     toast.error("Password must be at least 6 characters");
    //     return false;
    // }

    return true;
}
