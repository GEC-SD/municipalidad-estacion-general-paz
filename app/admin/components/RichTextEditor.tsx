'use client';

import { Box, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
};

const RichTextEditor = ({
  value,
  onChange,
  disabled,
  placeholder,
  label,
  error,
  helperText,
}: RichTextEditorProps) => {
  return (
    <Box>
      {label && (
        <Typography
          variant="body2"
          sx={{ mb: 1, fontWeight: 500, color: error ? 'error.main' : 'text.primary' }}
        >
          {label}
        </Typography>
      )}
      <Box
        sx={{
          '& .ql-toolbar': {
            borderRadius: '8px 8px 0 0',
            borderColor: error ? 'error.main' : 'rgba(0,0,0,0.23)',
          },
          '& .ql-container': {
            minHeight: 200,
            fontSize: 16,
            borderRadius: '0 0 8px 8px',
            borderColor: error ? 'error.main' : 'rgba(0,0,0,0.23)',
          },
          '& .ql-editor': {
            minHeight: 200,
          },
        }}
      >
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          placeholder={placeholder}
          readOnly={disabled}
          theme="snow"
        />
      </Box>
      {helperText && (
        <Typography variant="caption" color={error ? 'error' : 'text.secondary'} sx={{ mt: 0.5, display: 'block' }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default RichTextEditor;
