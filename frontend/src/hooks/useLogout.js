import { useState } from "react"
import { useAuthContext } from "../context/AuthContext"
import toast from "react-hot-toast"


const useLogout = () => {
    
    const [loading,setLoading]=useState(false)
    const {setAuthUser}=useAuthContext()

    const logout = async () => {
        setLoading(true)
        
        try {
            const res = await fetch("http://localhost:8000/api/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // If using cookies
            });
            
        
            const data = await res.json();
            if(data.error){
                throw new Error(data.error);
            }
            
            // Clear both user data and token from localStorage
            localStorage.removeItem("chat-user");
            localStorage.removeItem("token");
            setAuthUser(null);
            
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    return {loading,logout};
};


export default useLogout;