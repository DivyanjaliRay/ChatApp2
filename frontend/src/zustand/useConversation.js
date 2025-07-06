//original
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useConversation = create(
	persist(
		(set) => ({
			selectedConversation: null,
			setSelectedConversation: (selectedConversation) => set({ 
				selectedConversation
			}),
			messages: [],
			setMessages: (messages) => set((state) => ({ 
				messages: Array.isArray(messages) ? messages : state.messages 
			})),
			addMessage: (message) => set((state) => ({
				messages: [...state.messages, message]
			})),
			clearMessages: () => set({ messages: [] })
		}),
		{
			name: 'conversation-storage',
			partialize: (state) => ({ messages: state.messages })
		}
	)
);

export default useConversation;