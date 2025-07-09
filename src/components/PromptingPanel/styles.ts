export const textareaStyles =
  'text-base w-full p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:bg-slate-100 hover:border-primary';

export const selectedFilePreviewStyles =
  'p-2 bg-slate-100 rounded-md flex items-center justify-between animate-fade-in border border-slate-200';

export const dropzoneBaseStyles =
  'flex flex-col items-center justify-center group p-4 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary transition-colors';

export const getDropzoneDynamicStyles = (isDragging: boolean) =>
  isDragging ? 'border-primary bg-primary/5' : 'border-slate-300';

export const submitButtonStyles =
  'bg-primary text-white py-2 px-6 rounded-md font-semibold hover:bg-primary-dark disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors';