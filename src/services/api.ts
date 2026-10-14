const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backendnote-r7ys.onrender.com/api';

export const noteApi = {
    getAllNote: async () => {
        const response = await fetch(`${API_BASE_URL}/notes`);
        if (!response.ok) {
            throw new Error(`Failed to fetch notes: ${response.statusText}`);
        }
        return await response.json();
    },
    getAllNoteByTagId: async (tagId: string) => {
        const response = await fetch(`${API_BASE_URL}/notes/tag/${tagId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch notes: ${response.statusText}`);
        }
        return await response.json();
    },

    ////////////////////////
    getAllTags: async () => {
        const response = await fetch(`${API_BASE_URL}/tags`);
        if (!response.ok) {
            throw new Error(`Failed to fetch tags: ${response.statusText}`);
        }
        return await response.json();
    }
}