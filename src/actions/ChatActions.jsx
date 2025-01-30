export const createChat = (chat, dispatch) => {
	dispatch({
		type: 'CREATE_CHAT',
		chatText: chat,
	});
};

export const removeChat = (chatId, dispatch) => {
	dispatch({
		type: 'REMOVE_CHAT',
		chatId,
	});
};

export const generateSessionId = (sessionId, dispatch) => {
	dispatch({
		type: 'GENERATE_SESSION_ID',
		sessionId,
	});
};
