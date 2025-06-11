import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { uploadImage, validateImageFile, resizeImage } from '../../../shared/storage-utils'
import { STORAGE_BUCKETS, StorageBucket } from '../../../shared/supabase'

interface ImageUploadProps {
  bucket: StorageBucket
  currentImage?: string
  onImageUploaded: (url: string, path: string) => void
  onImageRemoved?: () => void
  className?: string
  placeholder?: string
  maxWidth?: number
  maxHeight?: number
  showPreview?: boolean
}

export function ImageUpload({ 
  bucket, 
  currentImage, 
  onImageUploaded, 
  onImageRemoved,
  className = '',
  placeholder = 'Cliquez pour uploader une image',
  maxWidth = 800,
  maxHeight = 600,
  showPreview = true
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    
    // Validation du fichier
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || 'Fichier invalide')
      return
    }

    setIsUploading(true)

    try {
      // Prévisualisation
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // Redimensionner l'image si nécessaire
      let fileToUpload = file
      if (file.size > 1024 * 1024) { // Si > 1MB, redimensionner
        try {
          fileToUpload = await resizeImage(file, maxWidth, maxHeight, 0.8)
        } catch (resizeError) {
          console.warn('Erreur redimensionnement, upload du fichier original:', resizeError)
        }
      }

      // Upload vers Supabase
      const result = await uploadImage({
        file: fileToUpload,
        bucket,
        path: `${bucket}/${Date.now()}-${file.name}`
      })

      if (result.success && result.url && result.path) {
        onImageUploaded(result.url, result.path)
        setPreview(result.url)
      } else {
        setError(result.error || 'Erreur lors de l\'upload')
        setPreview(null)
      }
    } catch (uploadError) {
      console.error('Erreur upload:', uploadError)
      setError('Erreur lors de l\'upload de l\'image')
      setPreview(null)
    } finally {
      setIsUploading(false)
      // Reset du file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    setError(null)
    if (onImageRemoved) {
      onImageRemoved()
    }
  }

  const displayImage = preview || currentImage
  const bucketLabels: Record<StorageBucket, string> = {
    hotels: 'hôtel',
    merchants: 'marchand',
    products: 'produit',
    avatars: 'avatar'
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Zone de drop/click */}
      <div 
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isUploading ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm text-blue-600">Upload en cours...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-600">{placeholder}</p>
            <p className="text-xs text-gray-500">
              JPEG, PNG, WebP, GIF - Max 5MB
            </p>
          </div>
        )}
      </div>

      {/* Prévisualisation de l'image */}
      {showPreview && displayImage && (
        <div className="relative">
          <img
            src={displayImage}
            alt={`Image ${bucketLabels[bucket]}`}
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Messages d'erreur */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Informations sur le bucket */}
      <div className="text-xs text-gray-500">
        📁 Upload vers : <code>{bucket}</code>
      </div>
    </div>
  )
}

// Composant simplifié pour les formulaires
export function SimpleImageUpload({ 
  bucket, 
  onImageUploaded, 
  className = ''
}: {
  bucket: StorageBucket
  onImageUploaded: (url: string) => void
  className?: string
}) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    setIsUploading(true)

    try {
      const result = await uploadImage({
        file,
        bucket,
        path: `${bucket}/${Date.now()}-${file.name}`
      })

      if (result.success && result.url) {
        onImageUploaded(result.url)
      } else {
        alert(result.error || 'Erreur lors de l\'upload')
      }
    } catch (error) {
      console.error('Erreur upload:', error)
      alert('Erreur lors de l\'upload de l\'image')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={isUploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {isUploading && (
        <p className="text-sm text-blue-600 mt-1">Upload en cours...</p>
      )}
    </div>
  )
} 