let storeRef = null;

export const setStore = (store) => {
	storeRef = store;
};

export const getToken = () => {
	if (!storeRef) return null;
	return storeRef.getState().user?.token || null;
};
