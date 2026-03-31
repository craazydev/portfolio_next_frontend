'use client';
import { useRef, useState, useCallback } from 'react';
import { Upload, X, FileText, Loader2, ImageIcon } from 'lucide-react';

interface Props {
  type: 'image' | 'pdf';
  folder?: string;            // Cloudinary sub-folder: projects | blog | profile
  value?: string;             // Current URL (shown as preview)
  publicId?: string;          // Current Cloudinary public_id (for deletion on replace)
  onChange: (url: string, publicId: string) => void;
  label?: string;
  className?: string;
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
function token() { return typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : ''; }

export default function FileUpload({ type, folder = 'portfolio', value, publicId, onChange, label, className = '' }: Props) {
  const inputRef   = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const upload = useCallback(async (file: File) => {
    setError('');
    setUploading(true);
    setProgress(0);

    try {
      // Delete old file from Cloudinary if replacing
      if (publicId) {
        await fetch(`${API}/upload`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token()}`,
          },
          body: JSON.stringify({ publicId, resourceType: type === 'pdf' ? 'raw' : 'image' }),
        });
      }

      const formData = new FormData();
      formData.append('file', file);

      const endpoint = type === 'pdf'
        ? `${API}/upload/pdf`
        : `${API}/upload/image?folder=${folder}`;

      // Use XMLHttpRequest for progress tracking
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', endpoint);
        xhr.setRequestHeader('Authorization', `Bearer ${token()}`);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            if (data.success) {
              onChange(data.url, data.publicId);
              setProgress(100);
              resolve();
            } else {
              reject(new Error(data.message || 'Upload failed'));
            }
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        };

        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(formData);
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [type, folder, publicId, onChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }, [upload]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = '';
  };

  const handleClear = async () => {
    if (!publicId) { onChange('', ''); return; }
    try {
      await fetch(`${API}/upload`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({ publicId, resourceType: type === 'pdf' ? 'raw' : 'image' }),
      });
    } catch { /* ignore */ }
    onChange('', '');
  };

  const accept = type === 'pdf' ? '.pdf,application/pdf' : 'image/*';

  return (
    <div className={className}>
      {label && <label className="block text-muted text-xs mb-2">{label}</label>}

      {/* Preview when we have a value */}
      {value && !uploading ? (
        <div className="relative group rounded-xl overflow-hidden border border-[#1a1a2e] bg-[#0a0a14]">
          {type === 'image' ? (
            <img src={value} alt="preview" className="w-full h-40 object-cover" />
          ) : (
            <div className="flex items-center gap-3 px-4 py-5">
              <FileText size={28} className="text-cyan-400 shrink-0" />
              <span className="text-light text-sm truncate">{value.split('/').pop()}</span>
              <a href={value} target="_blank" rel="noopener noreferrer"
                className="ml-auto text-cyan-400 text-xs underline shrink-0">View</a>
            </div>
          )}
          {/* Overlay buttons */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-400/20 border border-cyan-400/40 text-cyan-400 text-xs font-medium hover:bg-cyan-400/30 transition-colors">
              <Upload size={12} /> Replace
            </button>
            <button type="button" onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-400/20 border border-red-400/40 text-red-400 text-xs font-medium hover:bg-red-400/30 transition-colors">
              <X size={12} /> Remove
            </button>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`relative flex flex-col items-center justify-center gap-3 h-36 rounded-xl border-2 border-dashed transition-all cursor-pointer
            ${dragging ? 'border-cyan-400 bg-cyan-400/5' : 'border-[#1a1a2e] hover:border-cyan-400/40 bg-[#0a0a14]'}
            ${uploading ? 'pointer-events-none' : ''}`}
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="text-cyan-400 animate-spin" />
              <div className="w-32 h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-muted text-xs">{progress}%</span>
            </>
          ) : (
            <>
              {type === 'image' ? (
                <ImageIcon size={24} className="text-muted" />
              ) : (
                <FileText size={24} className="text-muted" />
              )}
              <div className="text-center">
                <p className="text-muted text-xs">
                  <span className="text-cyan-400">Click to upload</span> or drag & drop
                </p>
                <p className="text-muted/60 text-xs mt-0.5">
                  {type === 'pdf' ? 'PDF up to 10MB' : 'JPG, PNG, WebP up to 5MB'}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onFileChange}
        className="hidden"
      />
    </div>
  );
}
