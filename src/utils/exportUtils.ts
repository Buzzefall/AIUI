import { Part } from '@google/generative-ai';
import { Conversation } from '../state/chatSlice';

const getPartText = (part: Part): string => {
  if ('text' in part && part.text) {
    return part.text;
  }
  if ('inlineData' in part && part.inlineData) {
    return `[Attachment: ${part.inlineData.mimeType}]`;
  }
  return '';
};

export const formatToMarkdown = (conversation: Conversation): string => {
  let markdownContent = `# Conversation: ${conversation.title}\n\n`;
  markdownContent += `*Exported on: ${new Date().toUTCString()}*\n\n`;
  markdownContent += '---\n\n';

  conversation.messages.forEach(message => {
    const author = message.role === 'model' ? 'Gemini' : 'User';
    const content = message.parts.map(getPartText).join('\n');
    markdownContent += `### ${author}\n\n${content}\n\n---\n\n`;
  });

  return markdownContent;
};

export const formatToJson = (conversation: Conversation): string => {
  const exportObject = {
    id: conversation.id,
    title: conversation.title,
    exportedAt: new Date().toISOString(),
    messages: conversation.messages, // The messages are already in a structured format
  };

  return JSON.stringify(exportObject, null, 2);
};

export const sanitizeFilename = (filename: string): string => {
  // Remove characters that are invalid in filenames on most OSes
  return filename.replace(/[<>:"/\\|?*]/g, '_');
};

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};