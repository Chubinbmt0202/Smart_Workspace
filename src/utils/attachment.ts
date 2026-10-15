export const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024;

export interface NoteAttachment {
  name: string;
  size?: string;
  type?: string;
  url?: string;
}

export function getAttachmentPreviewKind(
  attachment: Pick<NoteAttachment, 'name' | 'type'>
): 'image' | 'pdf' | 'text' | null {
  const type = (attachment.type || '').toLowerCase();
  const name = attachment.name.toLowerCase();

  if (type.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg|bmp)$/i.test(name)) {
    return 'image';
  }
  if (type === 'application/pdf' || name.endsWith('.pdf')) {
    return 'pdf';
  }
  if (type.startsWith('text/') || /\.(txt|csv|md|log)$/i.test(name)) {
    return 'text';
  }
  return null;
}
