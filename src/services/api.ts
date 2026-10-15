const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backendnote-r7ys.onrender.com/api';

const handleResponse = async (response: Response, defaultMessage: string) => {
  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.message || errorJson.error || JSON.stringify(errorJson);
    } catch {
      // Ignore JSON parse errors for non-JSON response bodies
    }
    throw new Error(`${defaultMessage}: ${errorDetail}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
};

export const noteApi = {
  // ==================== GHI CHÚ (NOTES) ====================
  // Lấy tất cả ghi chú: GET /notes
  getAllNote: async () => {
    const response = await fetch(`${API_BASE_URL}/notes`);
    return await handleResponse(response, 'Failed to fetch notes');
  },

  // Lấy ghi chú theo tag: GET /notes/tag/:tagId
  getAllNoteByTagId: async (tagId: string) => {
    const response = await fetch(`${API_BASE_URL}/notes/tag/${tagId}`);
    return await handleResponse(response, 'Failed to fetch notes by tag');
  },

  // Tạo mới ghi chú: POST /notes
  createNote: async (noteData: any) => {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    return await handleResponse(response, 'Failed to create note');
  },

  // Sửa ghi chú: PUT /notes/:id
  updateNote: async (id: string, noteData: any) => {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    return await handleResponse(response, 'Failed to update note');
  },

  // Đưa vào thùng rác: PATCH /notes/:id/trash
  moveToTrash: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/notes/${id}/trash`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_trashed: true }),
    });
    return await handleResponse(response, 'Failed to move note to trash');
  },

  // Xóa ghi chú: DELETE /notes/:id
  deleteNote: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(response, 'Failed to delete note');
  },

  // ==================== TAGS ====================
  // Lấy danh sách tag: GET /tags
  getAllTags: async () => {
    const response = await fetch(`${API_BASE_URL}/tags`);
    return await handleResponse(response, 'Failed to fetch tags');
  },

  // Tạo tag mới: POST /tags
  createTag: async (tagData: any) => {
    const response = await fetch(`${API_BASE_URL}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tagData),
    });
    return await handleResponse(response, 'Failed to create tag');
  },

  // Cập nhật tên tag: PUT /tags/:id
  updateTag: async (id: string, tagData: any) => {
    const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tagData),
    });
    return await handleResponse(response, 'Failed to update tag');
  },

  // Xóa tag: DELETE /tags/:id
  deleteTag: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(response, 'Failed to delete tag');
  },

  // ==================== THÙNG RÁC (TRASH) ====================
  // Lấy danh sách note trong thùng rác: GET /trash
  getTrashNotes: async () => {
    const response = await fetch(`${API_BASE_URL}/trash`);
    return await handleResponse(response, 'Failed to fetch trash notes');
  },

  // Khôi phục mục từ thùng rác về lại bảng ghi chú ban đầu: POST /trash/:id/restore
  restoreNoteFromTrash: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/trash/${id}/restore`, {
      method: 'POST',
    });
    return await handleResponse(response, 'Failed to restore note from trash');
  },

  // Xóa vĩnh viễn 1 mục khỏi thùng rác: DELETE /trash/:id
  permanentlyDeleteTrashNote: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/trash/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(response, 'Failed to permanently delete note from trash');
  },
};

// Aliases cho tiện phân tách theo domain nếu cần
export const tagApi = {
  getAll: noteApi.getAllTags,
  create: noteApi.createTag,
  update: noteApi.updateTag,
  delete: noteApi.deleteTag,
};

export const trashApi = {
  getAll: noteApi.getTrashNotes,
  restore: noteApi.restoreNoteFromTrash,
  permanentlyDelete: noteApi.permanentlyDeleteTrashNote,
};