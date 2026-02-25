'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Image as ImageIcon,
  AddPhotoAlternate as AddPhotoIcon,
} from '@mui/icons-material';
import { useFileUpload } from '@/hooks';

type MultiImageUploadProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  bucket: string;
  maxSize?: number;
  allowedTypes?: string[];
  accept?: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
};

const MultiImageUpload = ({
  value = [],
  onChange,
  maxImages = 3,
  bucket,
  maxSize,
  allowedTypes,
  accept = 'image/jpeg,image/png,image/webp',
  label = 'Imágenes',
  helperText,
  disabled = false,
}: MultiImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const { upload, uploading, progress, error, reset } = useFileUpload({
    bucket,
    maxSize,
    allowedTypes,
  });

  const handleFileSelect = useCallback(
    async (file: File) => {
      reset();
      const url = await upload(file);
      if (url) {
        onChange([...value, url]);
      }
    },
    [upload, onChange, reset, value]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !uploading && value.length < maxImages) setDragActive(true);
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
    if (disabled || uploading || value.length >= maxImages) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const canAddMore = value.length < maxImages;

  return (
    <Box>
      {label && (
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
          {label} ({value.length}/{maxImages})
        </Typography>
      )}

      {/* Image previews grid */}
      {value.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1.5,
            mb: 2,
          }}
        >
          {value.map((url, index) => (
            <Paper
              key={url}
              variant="outlined"
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                aspectRatio: '4/3',
              }}
            >
              <Box
                component="img"
                src={url}
                alt={`Imagen ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {index === 0 && (
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    top: 4,
                    left: 4,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                  }}
                >
                  Destacada
                </Typography>
              )}
              <IconButton
                onClick={() => handleRemove(index)}
                disabled={disabled}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  '&:hover': { backgroundColor: 'error.main' },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Paper>
          ))}
        </Box>
      )}

      {/* Upload zone */}
      {canAddMore && (
        <Paper
          variant="outlined"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            p: 2.5,
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
          {value.length === 0 ? (
            <ImageIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 0.5 }} />
          ) : (
            <AddPhotoIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 0.5 }} />
          )}
          <Typography variant="body2" color="text.secondary">
            {value.length === 0
              ? 'Arrastrá una imagen aquí o hacé click para seleccionar'
              : 'Agregar otra imagen'}
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
        disabled={disabled || uploading || !canAddMore}
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
    </Box>
  );
};

export default MultiImageUpload;
