const createChat = (state, chatText) => {
	const newChat = {
		id: (state.chatText.length > 0 && state.chatText[state.chatText.length - 1].id + 1) || 0,
		text: chatText,
		tag: 'active',
	};

	return {...state, chatText: [...state.chatText, newChat]};
};

const removeChat = (state, chatId) => {
	const newChatText = state.chatText.filter((chat) => chat.id !== chatId);

	return {...state, chatText: newChatText};
};

const generateSessionId = (state, sessionId) => {
	return {
		...state,
		sessionId,
	};
};

export const reducer = (state, action) => {
	switch (action.type) {
		case 'CREATE_CHAT':
			return createChat(state, action.chatText);
		case 'REMOVE_CHAT':
			return removeChat(state, action.chatId);
		case 'GENERATE_SESSION_ID':
			return generateSessionId(state, action.sessionId);
		default:
			return state;
	}
};
