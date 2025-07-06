// main code
// import { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';

// const useGetConversations = () => {
//     const [loading, setLoading] = useState(false);
//     const [conversations, setConversations] = useState([]);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const getConversations = async () => {
//             setLoading(true);
//             setError(null);

//             try {
//                 const res = await fetch('http://localhost:8000/api/users', {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     credentials: 'include' // Include cookies for authentication
//                 });

//                 const data = await res.json();
//                 console.log(data)
//                 // Handle the response regardless of status
//                 if (res.ok) {
//                     setConversations(data);
//                 } else {
//                     throw new Error(data.message || 'Failed to fetch conversations');
//                 }
//             } catch (error) {
//                 setError(error.message);
//                 toast.error(error.message || 'Something went wrong');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         getConversations();
//     }, []);

//     return { loading, conversations, error };
// };
// export default useGetConversations;



import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const res = await fetch("http://localhost:8000/api/users", {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					},
					credentials: 'include'
				});
				const data = await res.json();
				if (data.error) {
					throw new Error(data.error);
				}
				// Filter out the logged-in user from the conversations
				const filteredConversations = data.filter(
					conversation => conversation._id !== authUser._id
				);
				setConversations(filteredConversations);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (authUser?._id) {
			getConversations();
		}
	}, [authUser?._id]);

	return { loading, conversations };
};

export default useGetConversations;




