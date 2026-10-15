const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backendnote-r7ys.onrender.com/api';
const API_BASE_URL_WITHOUT_TRAILING_SLASH = API_BASE_URL.replace(/\/+$/, '');

type NoteMutation = {
  title?: string;
  content?: string;
  category?: string;
  tag_id?: string | null;
  day_notice?: string | null;
  is_trashed?: boolean;
};

type TagMutation = {
  name?: string;
  color?: string;
};

const getCurrentUserId = (): string => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('Missing user ID. Sign in again before using the API.');
  }
  return userId;
};

const withUserScope = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}user_id=${encodeURIComponent(getCurrentUserId())}`;
};

const withUserId = <T extends object>(payload: T) => ({
  ...payload,
  user_id: getCurrentUserId()
});

const filterUserScopedRecords = (
  response: unknown
): { records: unknown[]; rejectedCount: number } => {
  const userId = getCurrentUserId();
  const root = typeof response === 'object' && response !== null
    ? response as Record<string, unknown>
    : null;
  const records = Array.isArray(response)
    ? response
    : root && Array.isArray(root.data)
      ? root.data
      : [];
  const ownedRecords = records.filter((record) => {
    if (typeof record !== 'object' || record === null) return false;
    const ownerId = (record as Record<string, unknown>).user_id;
    return ownerId !== undefined && ownerId !== null && String(ownerId) === userId;
  });

  return {
    records: ownedRecords,
    rejectedCount: records.length - ownedRecords.length,
  };
};

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

function getLoginUserId(response: unknown): string {
  const root = typeof response === 'object' && response !== null
    ? response as Record<string, unknown>
    : {};
  const data = typeof root.data === 'object' && root.data !== null
    ? root.data as Record<string, unknown>
    : {};
  const user = typeof root.user === 'object' && root.user !== null
    ? root.user as Record<string, unknown>
    : {};
  const dataUser = typeof data.user === 'object' && data.user !== null
    ? data.user as Record<string, unknown>
    : {};

  const candidates = [dataUser, user, data, root];
  for (const candidate of candidates) {
    const id = candidate.user_id ?? candidate.userId ?? candidate.id;
    if (typeof id === 'number' && Number.isFinite(id)) return String(id);
    if (typeof id === 'string' && id.trim()) return id.trim();
  }

  throw new Error('Failed to save user profile: login response did not include a user ID.');
}

export const noteApi = {
  loginUser: async (userData: {
    email: string;
    displayName: string;
    photoURL: string;
  }) => {
    const response = await fetch(`${API_BASE_URL_WITHOUT_TRAILING_SLASH}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const result = await handleResponse(response, 'Failed to save user profile');
    return { userId: getLoginUserId(result) };
  },

  // ==================== GHI CHÚ (NOTES) ====================
  // Lấy tất cả ghi chú: GET /notes
  getAllNote: async () => {
    const response = await fetch(withUserScope(`${API_BASE_URL_WITHOUT_TRAILING_SLASH}/notes`));
    return await handleResponse(response, 'Failed to fetch notes');
  },

  // Lấy ghi chú theo tag: GET /notes/tag/:tagId
  getAllNoteByTagId: async (tagId: string) => {
    const response = await fetch(withUserScope(`${API_BASE_URL_WITHOUT_TRAILING_SLASH}/notes/tag/${tagId}`));
    return await handleResponse(response, 'Failed to fetch notes by tag');
  },

  // Tạo mới ghi chú: POST /notes
  createNote: async (noteData: NoteMutation) => {
    const response = await fetch(`${API_BASE_URL_WITHOUT_TRAILING_SLASH}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(withUserId(noteData)),
    });
    return await handleResponse(response, 'Failed to create note');
  },

  // Sửa ghi chú: PUT /notes/:id
  updateNote: async (id: string, noteData: NoteMutation) => {
    const response = await fetch(`${API_BASE_URL_WITHOUT_TRAILING_SLASH}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(withUserId(noteData)),
    });
    return await handleResponse(response, 'Failed to update note');
  },

  // Đưa vào thùng rác: PATCH /notes/:id/trash
  moveToTrash: async (id: string) => {
    const response = await fetch(withUserScope(`${API_BASE_URL_WITHOUT_TRAILING_SLASH}/notes/${id}/trash`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(withUserId({ is_trashed: true })),
    });
    return await handleResponse(response, 'Failed to move note to trash');
  },

  // Xóa ghi chú: DELETE /notes/:id
  deleteNote: async (id: string) => {
    const response = await fetch(withUserScope(`${API_BASE_URL_WITHOUT_TRAILING_SLASH}/notes/${id}`), {
      method: 'DELETE',
    });
    return await handleResponse(response, 'Failed to delete note');
  },

  // ==================== TAGS ====================
  // Lấy danh sách tag: GET /tags
  getAllTags: async () => {
    const response = await fetch(withUserScope(`${API_BASE_URL_WITHOUT_TRAILING_SLASH}/tags`));
    const result: unknown = await handleResponse(response, 'Failed to fetch tags');
    const { records, rejectedCount } = filterUserScopedRecords(result);
    if (rejectedCount > 0) {
      console.error(
        `The tags API returned ${rejectedCount} record(s) without the current user's ownership. They were excluded.`
      );
    }
    return { data: records, rejectedCount };
  },

  // Tạo tag mới: POST /tags
  createTag: async (tagData: TagMutation) => {
    const response = await fetch(`${API_BASE_URL_WITHOUT_TRAILING_SLASH}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(withUserId(tagData)),
    });
    return await handleResponse(response, 'Failed to create tag');
  },

  // Cập nhật tên tag: PUT /tags/:id
  updateTag: async (id: string, tagData: TagMutation) => {
    const response = await fetch(`${API_BASE_URL_WITHOUT_TRAILING_SLASH}/tags/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(withUserId(tagData)),
    });
    return await handleResponse(response, 'Failed to update tag');
  },

  // Xóa tag: DELETE /tags/:id
  deleteTag: async (id: string) => {
    const response = await fetch(withUserScope(`${API_BASE_URL_WITHOUT_TRAILING_SLASH}/tags/${id}`), {
      method: 'DELETE',
    });
    return await handleResponse(response, 'Failed to delete tag');
  },

  // ==================== THÙNG RÁC (TRASH) ====================
  // Lấy danh sách note trong thùng rác: GET /trash
  getTrashNotes: async () => {
    const response = await fetch(withUserScope(`${API_BASE_URL_WITHOUT_TRAILING_SLASH}/trash`));
    return await handleResponse(response, 'Failed to fetch trash notes');
  },

  // Khôi phục mục từ thùng rác về lại bảng ghi chú ban đầu: POST /trash/:id/restore
  restoreNoteFromTrash: async (id: string) => {
    const response = await fetch(withUserScope(`${API_BASE_URL_WITHOUT_TRAILING_SLASH}/trash/${id}/restore`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(withUserId({})),
    });
    return await handleResponse(response, 'Failed to restore note from trash');
  },

  // Xóa vĩnh viễn 1 mục khỏi thùng rác: DELETE /trash/:id
  permanentlyDeleteTrashNote: async (id: string) => {
    const response = await fetch(withUserScope(`${API_BASE_URL_WITHOUT_TRAILING_SLASH}/trash/${id}`), {
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