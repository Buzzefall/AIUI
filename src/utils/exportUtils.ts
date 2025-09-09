import { Conversation } from '../state/chatSlice';
import { RootState } from '../state/store';

export function sanitizeFilename(filename: string): string {
  return filename.replace(/[\\/:*?"<>|]/g, '_');
}

export function formatToMarkdown(conversation: Conversation): string {
  let markdown = `# ${conversation.title}\n\n`;
  
  conversation.messages.forEach(msg => {
    const role = msg.content.role === 'user' ? 'You' : 'Gemini';
    const msgHeader = `**${role}:**\n\n`;
    markdown += msgHeader;
    
    let msgBody: string = '';
    msg.content.parts?.forEach(part => {
      function parseMsgPart() {
        if (part.text) {
          return `${part.text}`;
        }
        else if (part.inlineData) {
          const data = part.inlineData;
          return `<inlineData displayName=${data.displayName} mimeType=${data.mimeType} size=${data.data?.length} </inlineData>`;
        }
        else {
          return '<unknown_message_part_type>'
        }
      }
      
      const markdownPart = parseMsgPart();
      
      msgBody += markdownPart;
      msgBody += '\n\n';
    });

    markdown += msgBody;
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
