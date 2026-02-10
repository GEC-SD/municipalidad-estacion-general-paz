'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useFileUpload } from '@/hooks';

type FileUploadProps = {
  bucket: string;
  maxSize?: number;
  allowedTypes?: string[];
  accept?: string;
  label?: string;
  helperText?: string;
  value?: string;
  onChange: (url: string | undefined) => void;
  disabled?: boolean;
  variant?: 'image' | 'file';
  path?: string;
};

const FileUpload = ({
  bucket,
  maxSize,
  allowedTypes,
  accept,
  label = 'Subir archivo',
  helperText,
  value,
  onChange,
  disabled = false,
  variant = 'image',
  path,
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const { upload, uploading, progress, error, reset } = useFileUpload({
    bucket,
    maxSize,
    allowedTypes,
    path,
  });

  const handleFileSelect = useCallback(
    async (file: File) => {
      reset();
      const url = await upload(file);
      if (url) {
        onChange(url);
      }
    },
    [upload, onChange, reset]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input value to allow re-uploading the same file
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !uploading) setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled || uploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    reset();
  };

  const isImage = variant === 'image';

  return (
    <Box>
      {label && (
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
          {label}
        </Typography>
      )}

      {/* Preview or Upload Zone */}
      {value ? (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: 2,
          }}
        >
          {isImage ? (
            <Box
              component="img"
              src={value}
              alt="Preview"
              sx={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            />
          ) : (
            <FileIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" noWrap>
              {value.split('/').pop() || 'Archivo subido'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Archivo cargado correctamente
            </Typography>
          </Box>
          <IconButton
            onClick={handleRemove}
            disabled={disabled}
            size="small"
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Paper>
      ) : (
        <Paper
          variant="outlined"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            p: 3,
            textAlign: 'center',
            cursor: disabled || uploading ? 'default' : 'pointer',
            borderStyle: 'dashed',
            borderWidth: 2,
            borderColor: dragActive ? 'primary.main' : 'divider',
            backgroundColor: dragActive ? 'action.hover' : 'transparent',
            borderRadius: 2,
            transition: 'all 0.2s ease',
            '&:hover': !disabled && !uploading
              ? { borderColor: 'primary.light', backgroundColor: 'action.hover' }
              : {},
          }}
          onClick={() => {
            if (!disabled && !uploading) inputRef.current?.click();
          }}
        >
          {isImage ? (
            <ImageIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
          ) : (
            <UploadIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
          )}
          <Typography variant="body2" color="text.secondary">
            Arrastrá un archivo aquí o hacé click para seleccionar
          </Typography>
          {helperText && (
            <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
              {helperText}
            </Typography>
          )}
        </Paper>
      )}

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        style={{ display: 'none' }}
        disabled={disabled || uploading}
      />

      {/* Progress bar */}
      {uploading && (
        <Box sx={{ mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progress.percentage}
            sx={{ borderRadius: 1 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            Subiendo... {progress.percentage}%
          </Typography>
        </Box>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mt: 1 }} onClose={reset}>
          {error}
        </Alert>
      )}

      {/* Alternative: manual URL input */}
      {!value && !uploading && (
        <Button
          size="small"
          sx={{ mt: 1, textTransform: 'none' }}
          onClick={(e) => {
            e.stopPropagation();
            const url = prompt('Ingresá la URL del archivo:');
            if (url) onChange(url);
          }}
          disabled={disabled}
        >
          O ingresá una URL manualmente
        </Button>
      )}
    </Box>
  );
};

export default FileUpload;
