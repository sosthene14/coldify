import { api } from './api'

/**
 * Extrait toutes les images Base64 d'un HTML
 */
function extractBase64Images(html: string): Array<{ base64: string; fullMatch: string }> {
  const regex = /<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"[^>]*>/g
  const matches: Array<{ base64: string; fullMatch: string }> = []
  
  let match
  while ((match = regex.exec(html)) !== null) {
    matches.push({
      base64: match[2],
      fullMatch: match[0],
    })
  }
  
  return matches
}

/**
 * Convertit une string Base64 en Blob
 */
function base64ToBlob(base64: string, contentType: string): Blob {
  const byteCharacters = atob(base64)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512)
    const byteNumbers = new Array(slice.length)
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }
    
    byteArrays.push(new Uint8Array(byteNumbers))
  }

  return new Blob(byteArrays, { type: contentType })
}

/**
 * Détecte le type MIME d'une image Base64
 */
function detectImageType(base64Prefix: string): string {
  if (base64Prefix.startsWith('/9j/')) return 'image/jpeg'
  if (base64Prefix.startsWith('iVBORw0KGgo')) return 'image/png'
  if (base64Prefix.startsWith('R0lGOD')) return 'image/gif'
  if (base64Prefix.startsWith('UklGR')) return 'image/webp'
  return 'image/jpeg' // fallback
}

/**
 * Upload une image vers MinIO et retourne l'objectKey
 */
async function uploadImageToMinIO(base64: string, index: number): Promise<string> {
  // Détecter le type d'image
  const contentType = detectImageType(base64.substring(0, 20))
  const extension = contentType.split('/')[1]
  const fileName = `image-${Date.now()}-${index}.${extension}`

  // 1. Demander une URL d'upload au backend
  const { data: uploadData } = await api.post<{
    uploadUrl: string
    objectKey: string
    fileId: string
  }>('/uploads/template-image', {
    fileName,
    contentType,
  })

  // 2. Convertir Base64 en Blob
  const blob = base64ToBlob(base64, contentType)

  // 3. Upload directement vers MinIO via l'URL signée
  const uploadResponse = await fetch(uploadData.uploadUrl, {
    method: 'PUT',
    body: blob,
    headers: {
      'Content-Type': contentType,
    },
  })

  if (!uploadResponse.ok) {
    throw new Error(`Failed to upload image: ${uploadResponse.statusText}`)
  }

  // 4. Retourner l'objectKey
  return uploadData.objectKey
}

/**
 * Remplace toutes les images Base64 d'un HTML par des références MinIO
 * @param html - Le HTML contenant des images Base64
 * @returns Le HTML avec les images remplacées par minio://{objectKey}
 */
export async function replaceBase64WithMinIO(html: string): Promise<string> {
  // Extraire toutes les images Base64
  const images = extractBase64Images(html)
  
  if (images.length === 0) {
    return html // Pas d'images, retourner tel quel
  }

  console.log(`🖼️  Found ${images.length} Base64 image(s), uploading to MinIO...`)

  let transformedHtml = html

  // Upload chaque image et remplacer dans le HTML
  for (let i = 0; i < images.length; i++) {
    const { base64, fullMatch } = images[i]
    
    try {
      // Upload vers MinIO
      const objectKey = await uploadImageToMinIO(base64, i)
      
      // Remplacer l'image Base64 par minio://objectKey
      const newImgTag = fullMatch.replace(
        /src="data:image\/[^;]+;base64,[^"]+"/,
        `src="minio://${objectKey}"`
      )
      
      transformedHtml = transformedHtml.replace(fullMatch, newImgTag)
      
      console.log(`✅ Image ${i + 1}/${images.length} uploaded: ${objectKey}`)
    } catch (error) {
      console.error(`❌ Failed to upload image ${i + 1}:`, error)
      throw new Error(`Failed to upload image ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  console.log(`✅ All ${images.length} image(s) uploaded successfully`)
  
  return transformedHtml
}

/**
 * Remplace les références MinIO par des URLs signées pour l'affichage
 * @param html - Le HTML contenant des minio://{objectKey}
 * @returns Le HTML avec les URLs signées
 */
export async function replaceMinIOWithSignedUrls(html: string): Promise<string> {
  const regex = /src="minio:\/\/([^"]+)"/g
  const matches = [...html.matchAll(regex)]
  
  if (matches.length === 0) {
    return html
  }

  let transformedHtml = html

  for (const match of matches) {
    const objectKey = match[1]
    
    try {
      // Demander une URL signée au backend
      const { data } = await api.post<{ viewUrl: string }>('/uploads/view-image', {
        objectKey,
        expiresIn: 3600, // 1 heure
      })
      
      transformedHtml = transformedHtml.replace(
        `minio://${objectKey}`,
        data.viewUrl
      )
    } catch (error) {
      console.error(`Failed to get signed URL for ${objectKey}:`, error)
    }
  }

  return transformedHtml
}
