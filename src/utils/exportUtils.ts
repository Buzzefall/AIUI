import { Conversation } from '../state/chatSlice';
import { RootState } from '../state/store';

export function sanitizeFilename(filename: string): string {
  return filename.replace(/[\\/:*?"<>|]/g, '_');
}

export function formatToMarkdown(conversation: Conversation): string {
  let markdown = `# ${conversation.title}\n\n`;
  conversation.messages.forEach(msg => {
    const role = msg.role === 'user' ? 'You' : 'Gemini';
    markdown += `**${role}:**\n${msg.parts[0].text}\n\n`;
  });
  return markdown;
}

export function formatToJson(data: Conversation | RootState): string {
  return JSON.stringify(data, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
