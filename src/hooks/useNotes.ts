import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { NoteItem } from '../types/note';
import type { TagItem } from '../types/tag';
import { TAG_COLOR_PALETTE } from '../constants/tags';
import { noteApi } from '../services/api';
import { getReminderFromDayNotice } from '../utils/date';

export function useNotes() {
  const [toastNotifications, setToastNotifications] = useState<
    { id: number; message: string; variant: 'success' | 'error' }[]
  >([]);
  const nextSuccessNotificationId = useRef(0);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [deletedNotes, setDeletedNotes] = useState<NoteItem[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);

  // Loading states cho API Skeleton và hiệu ứng tải
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingTrash, setIsLoadingTrash] = useState<boolean>(false);
  const [isMutating, setIsMutating] = useState<boolean>(false);

  const notifySuccess = useCallback((message: string) => {
    const id = nextSuccessNotificationId.current++;
    setToastNotifications((prev) => [...prev, { id, message, variant: 'success' }]);
  }, []);

  const notifyError = useCallback((message: string) => {
    const id = nextSuccessNotificationId.current++;
    setToastNotifications((prev) => [...prev, { id, message, variant: 'error' }]);
  }, []);

  const dismissSuccessNotification = useCallback(() => {
    setToastNotifications((prev) => prev.slice(1));
  }, []);

  // Load danh sách ghi chú từ API
  const loadNotes = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const res = await noteApi.getAllNote();
      const rawList = (res && res.data) ? res.data : (Array.isArray(res) ? res : []);
      const formattedNotes: NoteItem[] = rawList.map((item: any) => {
        let tagName = 'Chưa gắn tag';
        if (typeof item.tag === 'string' && item.tag.trim()) {
          tagName = item.tag.trim();
        } else if (item.tag && typeof item.tag === 'object') {
          tagName = item.tag.name || item.tag.label || item.tag.title || 'Chưa gắn tag';
        } else if (item.category) {
          tagName = item.category;
        }

        const tagLower = tagName.toLowerCase();
        const tagType: 'personal' | 'projects' | 'custom' =
          item.tagType || (tagLower === 'personal' ? 'personal' : tagLower === 'projects' ? 'projects' : 'custom');
        const reminderFromDayNotice = getReminderFromDayNotice(item.day_notice);

        return {
          ...item,
          id: String(item.id),
          title: item.title || '',
          content: item.content || '',
          tag: tagName,
          tagType,
          reminder: reminderFromDayNotice
            ? { ...item.reminder, ...reminderFromDayNotice }
            : item.reminder,
          date: item.date || (item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN') : '')
        };
      });

      setNotes(formattedNotes);
    } catch (err) {
      console.error('Failed to load notes:', err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  // Load danh sách tag từ API
  const loadTags = useCallback(async () => {
    try {
      const res = await noteApi.getAllTags();
      const rawList = res.data;
      if (res.rejectedCount > 0) {
        notifyError(
          'Máy chủ trả về tag không thuộc tài khoản này. Các tag đó đã bị ẩn; cần sửa bộ lọc user_id ở backend.'
        );
      }
      const formattedTags: TagItem[] = rawList.map((item: any) => {
        return {
          ...item,
          id: String(item.id),
          label: item.name || item.label || item.title || 'Chưa gắn tag',
          dotColor: item.color || item.dotColor || '#3b82f6'
        };
      });
      setTags(formattedTags);
    } catch (err) {
      console.error('Failed to load tags:', err);
      notifyError('Không thể tải danh sách tag an toàn. Vui lòng thử lại hoặc liên hệ quản trị viên.');
    }
  }, [notifyError]);

  // Load danh sách trong thùng rác từ API
  const loadTrash = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoadingTrash(true);
    try {
      const res = await noteApi.getTrashNotes();
      const rawList = (res && res.data) ? res.data : (Array.isArray(res) ? res : []);
      const formattedTrash: NoteItem[] = rawList.map((item: any) => {
        const orig = item.original_data || {};
        let tagName = 'Chưa gắn tag';
        if (typeof orig.tag === 'string' && orig.tag.trim()) {
          tagName = orig.tag.trim();
        } else if (orig.tag && typeof orig.tag === 'object') {
          tagName = orig.tag.name || orig.tag.label || orig.tag.title || 'Chưa gắn tag';
        } else if (orig.category) {
          tagName = orig.category;
        }

        const tagLower = tagName.toLowerCase();
        const tagType: 'personal' | 'projects' | 'custom' =
          orig.tagType || (tagLower === 'personal' ? 'personal' : tagLower === 'projects' ? 'projects' : 'custom');
        const reminderFromDayNotice = getReminderFromDayNotice(orig.day_notice);

        return {
          ...orig,
          id: String(orig.id || item.item_id || item.id),
          trashId: String(item.id),
          title: item.title || orig.title || '',
          content: orig.content || '',
          tag: tagName,
          tagType,
          reminder: reminderFromDayNotice
            ? { ...orig.reminder, ...reminderFromDayNotice }
            : orig.reminder,
          date: orig.created_at ? new Date(orig.created_at).toLocaleDateString('vi-VN') : '',
          deletedAt: item.trashed_at || item.created_at || new Date().toISOString()
        };
      });

      setDeletedNotes(formattedTrash);
    } catch (err) {
      console.error('Failed to load trash:', err);
    } finally {
      if (showLoading) setIsLoadingTrash(false);
    }
  }, []);

  useEffect(() => {
    loadNotes(true);
    loadTags();
    loadTrash(false);
  }, [loadNotes, loadTags, loadTrash]);

  // Helper to ensure a tag exists in the tags collection
  const ensureTagExists = useCallback((tagLabel: string) => {
    const trimmed = tagLabel.trim();
    if (
      !trimmed ||
      trimmed.toLowerCase() === 'all' ||
      trimmed.toLowerCase() === 'add tag'
    ) {
      return;
    }

    setTags((prev) => {
      const exists = prev.some(
        (t) => t.label.toLowerCase() === trimmed.toLowerCase()
      );
      if (exists) return prev;

      const randomColor =
        TAG_COLOR_PALETTE[prev.length % TAG_COLOR_PALETTE.length];
      const newTagId = trimmed.toLowerCase().replace(/\s+/g, '-');

      return [
        ...prev,
        {
          id: newTagId,
          label: trimmed,
          dotColor: randomColor
        }
      ];
    });
  }, []);

  // Compute category tabs dynamically: 'All' + unique tag labels from tags & notes
  const categoryTabs = useMemo(() => {
    const tabLabels = ['All'];
    tags.forEach((t) => {
      if (!tabLabels.some((l) => l.toLowerCase() === t.label.toLowerCase())) {
        tabLabels.push(t.label);
      }
    });

    notes.forEach((n) => {
      let rawTag = typeof n.tag === 'object' && n.tag !== null
        ? ((n.tag as any).name || (n.tag as any).label || '')
        : n.tag;
      let noteTag = typeof rawTag === 'string' ? rawTag.trim() : '';
      if (!noteTag) {
        noteTag = 'Chưa gắn tag';
      }
      if (
        noteTag &&
        noteTag.toLowerCase() !== 'all' &&
        noteTag.toLowerCase() !== 'add tag' &&
        !tabLabels.some((l) => l.toLowerCase() === noteTag.toLowerCase())
      ) {
        tabLabels.push(noteTag);
      }
    });

    return tabLabels;
  }, [tags, notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const getTagString = (tag: any): string => {
        if (typeof tag === 'string') return tag;
        if (tag && typeof tag === 'object') return tag.name || tag.label || tag.title || '';
        return '';
      };
      const noteTagStr = getTagString(note.tag);

      // Filter by active category tab
      if (activeCategory !== 'All') {
        const noteTagLower = noteTagStr.toLowerCase();
        const activeCatLower = activeCategory.toLowerCase();

        const isDirectMatch = noteTagLower === activeCatLower;
        const isPersonalMatch =
          activeCatLower === 'personal' &&
          (noteTagLower === 'personal' || note.tagType === 'personal');
        const isProjectsMatch =
          activeCatLower === 'projects' &&
          (noteTagLower === 'projects' ||
            (note.tagType === 'projects' && noteTagLower !== 'business'));
        const isBusinessMatch =
          activeCatLower === 'business' && noteTagLower === 'business';

        const matchesCategory =
          isDirectMatch || isPersonalMatch || isProjectsMatch || isBusinessMatch;

        if (!matchesCategory) {
          return false;
        }
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = (note.title || '').toLowerCase().includes(query);
        const matchesContent = (note.content || '').toLowerCase().includes(query);
        const matchesTag = noteTagStr.toLowerCase().includes(query);
        return matchesTitle || matchesContent || matchesTag;
      }

      return true;
    });
  }, [notes, activeCategory, searchQuery]);

  // Cập nhật ghi chú (PUT /notes/:id)
  const handleUpdateNote = useCallback(async (updatedNote: NoteItem) => {
    setIsMutating(true);
    try {
      const matchedTag = tags.find(
        (t) => t.label.toLowerCase() === updatedNote.tag?.toLowerCase()
      );

      const payload = {
        title: updatedNote.title,
        content: updatedNote.content,
        category: updatedNote.tag || 'Personal',
        tag_id: matchedTag ? matchedTag.id : null,
        day_notice: updatedNote.day_notice ?? null,
      };

      await noteApi.updateNote(updatedNote.id, payload);
      setNotes((prev) =>
        prev.map((note) => (note.id === updatedNote.id ? updatedNote : note))
      );
      setSelectedNote(updatedNote);
      if (updatedNote.tag) {
        ensureTagExists(updatedNote.tag);
      }
      notifySuccess('Đã cập nhật ghi chú thành công.');
    } catch (err) {
      console.error('Failed to update note via API:', err);
      notifyError('Không thể cập nhật ghi chú. Thay đổi chưa được lưu lên máy chủ.');
    } finally {
      setIsMutating(false);
    }
  }, [ensureTagExists, notifyError, notifySuccess, setSelectedNote, tags]);

  // Tạo mới ghi chú (POST /notes)
  const handleAddNote = useCallback(async (newNote: NoteItem) => {
    setIsMutating(true);
    try {
      const matchedTag = tags.find(
        (t) => t.label.toLowerCase() === newNote.tag?.toLowerCase()
      );

      const payload = {
        title: newNote.title,
        content: newNote.content,
        category: newNote.tag || 'Personal',
        tag_id: matchedTag ? matchedTag.id : null,
        day_notice: newNote.day_notice ?? null,
      };

      const res = await noteApi.createNote(payload);
      notifySuccess('Đã tạo ghi chú thành công.');
      const created = res?.data || res;
      const createdId = created?.id ? String(created.id) : newNote.id;

      const formattedNote: NoteItem = {
        ...newNote,
        id: createdId,
        date: created?.created_at
          ? new Date(created.created_at).toLocaleDateString('vi-VN')
          : newNote.date,
      };

      setNotes((prev) => [formattedNote, ...prev]);
      if (newNote.tag) {
        ensureTagExists(newNote.tag);
      }
    } catch (err) {
      console.error('Failed to create note via API:', err);
      notifyError('Không thể tạo ghi chú trên máy chủ. Ghi chú hiện chỉ được lưu tạm thời.');
      setNotes((prev) => [newNote, ...prev]);
      if (newNote.tag) {
        ensureTagExists(newNote.tag);
      }
    } finally {
      setIsMutating(false);
    }
  }, [ensureTagExists, notifyError, notifySuccess, tags]);

  // Đưa vào thùng rác (PATCH /notes/:id/trash)
  const handleDeleteNote = useCallback(async (id: string) => {
    const targetNote = notes.find((n) => n.id === id);
    // Optimistic UI: xóa khỏi danh sách chính
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setSelectedNote((prevSelected) => (prevSelected?.id === id ? null : prevSelected));

    setIsMutating(true);
    try {
      await noteApi.moveToTrash(id);
      await loadTrash(false);
      notifySuccess('Đã chuyển ghi chú vào thùng rác.');
    } catch (err) {
      console.error('Failed to move note to trash via API:', err);
      notifyError('Không thể chuyển ghi chú vào thùng rác trên máy chủ.');
      if (targetNote) {
        setNotes((prev) => [targetNote, ...prev]);
      }
    } finally {
      setIsMutating(false);
    }
  }, [notes, loadTrash, notifyError, notifySuccess]);

  // Khôi phục từ thùng rác (POST /trash/:id/restore)
  const handleRestoreNote = useCallback(async (id: string) => {
    const target = deletedNotes.find((n) => n.id === id || n.trashId === id);
    const trashIdToRestore = target?.trashId || id;

    // Optimistic update
    setDeletedNotes((prevDel) => prevDel.filter((n) => n.id !== id && n.trashId !== id));

    setIsMutating(true);
    try {
      await noteApi.restoreNoteFromTrash(trashIdToRestore);
      await loadNotes(false);
      notifySuccess('Đã khôi phục ghi chú thành công.');
    } catch (err) {
      console.error('Failed to restore note via API:', err);
      notifyError('Không thể khôi phục ghi chú trên máy chủ.');
      if (target) {
        setDeletedNotes((prev) => [target, ...prev]);
      }
    } finally {
      setIsMutating(false);
    }
  }, [deletedNotes, loadNotes, notifyError, notifySuccess]);

  // Xóa vĩnh viễn 1 mục khỏi thùng rác (DELETE /trash/:id)
  const handlePermanentDeleteNote = useCallback(async (id: string) => {
    const target = deletedNotes.find((n) => n.id === id || n.trashId === id);
    const trashIdToDelete = target?.trashId || id;

    setDeletedNotes((prevDel) => prevDel.filter((n) => n.id !== id && n.trashId !== id));

    setIsMutating(true);
    try {
      await noteApi.permanentlyDeleteTrashNote(trashIdToDelete);
      notifySuccess('Đã xóa ghi chú vĩnh viễn.');
    } catch (err) {
      console.error('Failed to permanently delete note via API:', err);
      notifyError('Không thể xóa ghi chú vĩnh viễn trên máy chủ.');
      if (target) {
        setDeletedNotes((prev) => [target, ...prev]);
      }
    } finally {
      setIsMutating(false);
    }
  }, [deletedNotes, notifyError, notifySuccess]);

  // Dọn sạch thùng rác
  const handleEmptyRecycleBin = useCallback(async () => {
    const itemsToDelete = [...deletedNotes];
    if (itemsToDelete.length === 0) return;

    setIsMutating(true);
    const results = await Promise.allSettled(
      itemsToDelete.map((item) =>
        noteApi.permanentlyDeleteTrashNote(item.trashId || item.id)
      )
    );
    const failedIds = new Set(
      results.flatMap((result, index) =>
        result.status === 'rejected'
          ? [itemsToDelete[index].trashId || itemsToDelete[index].id]
          : []
      )
    );
    const failedItems = itemsToDelete.filter((item) =>
      failedIds.has(item.trashId || item.id)
    );

    if (failedItems.length === 0) {
      notifySuccess('Đã dọn sạch thùng rác.');
    } else {
      console.error(
        `Failed to permanently delete ${failedItems.length} note(s) while emptying the recycle bin.`,
        results.filter((result) => result.status === 'rejected')
      );
      notifyError('Không thể xóa một số ghi chú. Các ghi chú đó vẫn ở trong thùng rác.');
    }
    setDeletedNotes((prev) => {
      const remainingIds = new Set(prev.map((note) => note.trashId || note.id));
      return [
        ...prev,
        ...failedItems.filter(
          (note) => !remainingIds.has(note.trashId || note.id)
        )
      ];
    });
    setIsMutating(false);
  }, [deletedNotes, notifyError, notifySuccess]);

  // Thêm tag mới (POST /tags)
  const handleAddTag = useCallback(async (newTagOrName: TagItem | string) => {
    const tagLabel = typeof newTagOrName === 'string' ? newTagOrName.trim() : newTagOrName.label.trim();
    if (!tagLabel) return;

    const dotColor = typeof newTagOrName === 'object' && newTagOrName.dotColor
      ? newTagOrName.dotColor
      : TAG_COLOR_PALETTE[tags.length % TAG_COLOR_PALETTE.length];

    setIsMutating(true);
    try {
      const res = await noteApi.createTag({ name: tagLabel, color: dotColor });
      const createdTag = res?.data || res;
      const createdId = createdTag?.id
        ? String(createdTag.id)
        : (typeof newTagOrName === 'object' ? newTagOrName.id : tagLabel.toLowerCase().replace(/\s+/g, '-'));

      const newTagItem: TagItem = {
        id: createdId,
        label: createdTag?.name || tagLabel,
        dotColor: createdTag?.color || dotColor
      };

      setTags((prev) => {
        if (prev.some((t) => t.id === createdId || t.label.toLowerCase() === tagLabel.toLowerCase())) {
          return prev;
        }
        return [...prev, newTagItem];
      });
      setActiveCategory(tagLabel);
      notifySuccess(`Đã tạo tag "${tagLabel}" thành công.`);
    } catch (err) {
      console.error('Failed to create tag via API:', err);
      notifyError(`Không thể tạo tag "${tagLabel}" trên máy chủ.`);
      if (typeof newTagOrName === 'string') {
        ensureTagExists(tagLabel);
        setActiveCategory(tagLabel);
      } else {
        setTags((prev) => {
          if (
            prev.some(
              (t) =>
                t.id === newTagOrName.id ||
                t.label.toLowerCase() === newTagOrName.label.toLowerCase()
            )
          ) {
            return prev;
          }
          return [...prev, newTagOrName];
        });
        setActiveCategory(newTagOrName.label);
      }
    } finally {
      setIsMutating(false);
    }
  }, [tags, ensureTagExists, notifyError, notifySuccess]);

  // Xóa tag (DELETE /tags/:id)
  const handleDeleteTag = useCallback(async (tagId: string) => {
    const tagToDelete = tags.find((tag) => tag.id === tagId);
    const deletedTagLabel = tagToDelete?.label.trim().toLowerCase();
    const notesToUntag = deletedTagLabel
      ? notes.filter((note) => note.tag.trim().toLowerCase() === deletedTagLabel)
      : [];

    setIsMutating(true);
    try {
      const updateResults = await Promise.allSettled(
        notesToUntag.map((note) =>
          noteApi.updateNote(note.id, {
            title: note.title,
            content: note.content,
            category: 'Chưa gắn tag',
            tag_id: null
          })
        )
      );
      const failedUpdates = updateResults.filter(
        (result) => result.status === 'rejected'
      );

      if (failedUpdates.length > 0) {
        console.error(
          `Failed to untag ${failedUpdates.length} note(s); the tag was not deleted.`,
          failedUpdates
        );
        await loadNotes(false);
        notifyError('Không thể gỡ tag khỏi tất cả ghi chú. Tag chưa bị xóa.');
        return;
      }

      await noteApi.deleteTag(tagId);

      const untagNote = (note: NoteItem): NoteItem =>
        note.tag.trim().toLowerCase() === deletedTagLabel
          ? { ...note, tag: 'Chưa gắn tag', tagType: 'custom' }
          : note;

      setNotes((prev) => prev.map(untagNote));
      setDeletedNotes((prev) => prev.map(untagNote));
      setSelectedNote((prev) => (prev ? untagNote(prev) : prev));

      if (
        tagToDelete &&
        activeCategory.toLowerCase() === tagToDelete.label.toLowerCase()
      ) {
        setActiveCategory('All');
      }

      setTags((prev) => prev.filter((tag) => tag.id !== tagId));
      notifySuccess(`Đã xóa tag "${tagToDelete?.label ?? ''}" thành công.`);
    } catch (err) {
      console.error('Failed to delete tag via API:', err);
      notifyError(`Không thể xóa tag "${tagToDelete?.label ?? ''}".`);
      await loadNotes(false);
    } finally {
      setIsMutating(false);
    }
  }, [activeCategory, loadNotes, notes, notifyError, notifySuccess, setSelectedNote, tags]);

  // Cập nhật tên tag (PUT /tags/:id)
  const handleRenameTag = useCallback(async (tagId: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    const tagToRename = tags.find((tag) => tag.id === tagId);
    const oldLabel = tagToRename?.label.toLowerCase();
    setIsMutating(true);
    try {
      await noteApi.updateTag(tagId, { name: trimmed });
      setTags((prev) =>
        prev.map((tag) => (tag.id === tagId ? { ...tag, label: trimmed } : tag))
      );
      if (oldLabel) {
        const renameNoteTag = (note: NoteItem): NoteItem =>
          note.tag.toLowerCase() === oldLabel ? { ...note, tag: trimmed } : note;

        setNotes((prev) => prev.map(renameNoteTag));
        setDeletedNotes((prev) => prev.map(renameNoteTag));
        setSelectedNote((prev) => (prev ? renameNoteTag(prev) : prev));
      }
      setActiveCategory((prevActive) =>
        oldLabel && prevActive.toLowerCase() === oldLabel ? trimmed : prevActive
      );
      notifySuccess(`Đã đổi tên tag thành "${trimmed}".`);
    } catch (err) {
      console.error('Failed to rename tag via API:', err);
      notifyError(`Không thể đổi tên tag thành "${trimmed}" trên máy chủ.`);
    } finally {
      setIsMutating(false);
    }
  }, [notifyError, notifySuccess, setSelectedNote, tags]);

  return {
    notes,
    deletedNotes,
    tags,
    categoryTabs,
    filteredNotes,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    selectedNote,
    setSelectedNote,
    isLoading,
    isLoadingTrash,
    isMutating,
    toastNotifications,
    dismissSuccessNotification,
    loadNotes,
    loadTrash,
    handleUpdateNote,
    handleAddNote,
    handleDeleteNote,
    handleRestoreNote,
    handlePermanentDeleteNote,
    handleEmptyRecycleBin,
    handleAddTag,
    handleDeleteTag,
    handleRenameTag,
  };
}
