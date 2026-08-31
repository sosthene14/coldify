import { Node } from '@tiptap/core'
import { Plugin, PluginKey, Transaction, EditorState } from '@tiptap/pm/state'
import { api } from './api'

// Cache des URLs signées pour éviter trop de requêtes
const urlCache = new Map<string, { url: string; expires: number }>()

async function getSignedUrl(objectKey: string): Promise<string> {
  // Vérifier le cache
  const cached = urlCache.get(objectKey)
  if (cached && cached.expires > Date.now()) {
    return cached.url
  }

  try {
    const { data } = await api.post<{ viewUrl: string }>('/uploads/view-image', {
      objectKey,
      expiresIn: 3600, // 1 heure
    })

    // Mettre en cache (expire dans 50 minutes pour avoir de la marge)
    urlCache.set(objectKey, {
      url: data.viewUrl,
      expires: Date.now() + 50 * 60 * 1000,
    })

    return data.viewUrl
  } catch (error) {
    console.error('Failed to get signed URL:', error)
    return '' // Retourner une URL vide en cas d'erreur
  }
}

/**
 * Extension TipTap qui transforme les minio:// en URLs signées pour l'affichage
 * mais garde les minio:// dans le HTML sauvegardé
 */
export const MinIOImage = Node.create({
  name: 'minioImage',

  addOptions() {
    return {
      HTMLAttributes: {} as Record<string, unknown>,
    }
  },

  inline: false,
  group: 'block',
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', HTMLAttributes]
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('minioImageLoader'),

        // Transformer les minio:// en URLs signées au chargement
        appendTransaction: (
          _transactions: readonly Transaction[],
          _oldState: EditorState,
          newState: EditorState
        ): Transaction | null => {
          newState.doc.descendants((node, ) => {
            if (
              node.type.name === 'image' &&
              typeof node.attrs.src === 'string' &&
              node.attrs.src.startsWith('minio://')
            ) {
              const objectKey = node.attrs.src.replace('minio://', '')

              // Charger l'URL signée de manière asynchrone
              getSignedUrl(objectKey).then((signedUrl) => {
                if (signedUrl && this.editor) {
                  // Mettre à jour l'image avec l'URL signée dans l'éditeur
                  // mais on garde minio:// dans le HTML original
                  const attrs = { ...node.attrs, 'data-minio-key': objectKey, src: signedUrl }
                  this.editor.commands.updateAttributes('image', attrs)
                }
              })
            }
          })

          // Cette fonction ne modifie jamais la transaction de façon synchrone
          // (la mise à jour se fait via une commande async plus tard)
          return null
        },
      }),
    ]
  },
})