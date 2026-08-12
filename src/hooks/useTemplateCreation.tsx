import type { CreationMode, PreviewDevice } from '#/types/template.ts'
import { useState, useCallback, useEffect } from 'react'
import type { Template } from '#/types/template.ts'
import { replaceMinIOWithSignedUrls } from '#/lib/image-upload.ts'

interface UseTemplateCreationOptions {
  initialTemplate?: Template
}

export function useTemplateCreation(options?: UseTemplateCreationOptions) {
  const initial = options?.initialTemplate
  
  const [creationMode, setCreationMode] = useState<CreationMode>('manual')
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop')
  const [htmlCodeView, setHtmlCodeView] = useState(true)
  const [aiPrompt, setAiPrompt] = useState('')
  const [templateName, setTemplateName] = useState(initial?.name || '')
  const [description, setDescription] = useState('')
  const [subjectLine, setSubjectLine] = useState(initial?.subject || '')
  const [emailBody, setEmailBody] = useState('')
  const [htmlContent, setHtmlContent] = useState('')
  const [aiGeneratedHtml, setAiGeneratedHtml] = useState('')
  const [isGeneratingAi, setIsGeneratingAi] = useState(false)
  const [category, setCategory] = useState<string | null>(initial?.category || null)
  const [language, setLanguage] = useState<string | null>(initial?.language || 'French')
  const [tone, setTone] = useState<string | null>('Direct')
  const [length, setLength] = useState<string | null>('Short (~50 words)')
  const [goal, setGoal] = useState<string | null>('Book a call')
  const [extraContext, setExtraContext] = useState('')

  // Transformer les URLs MinIO en URLs signées au chargement d'un template existant
  useEffect(() => {
    const loadInitialContent = async () => {
      if (initial?.body) {
        if (initial.body.includes('minio://')) {
          // Transformer les minio:// en URLs signées pour l'éditeur
          const transformed = await replaceMinIOWithSignedUrls(initial.body)
          setEmailBody(transformed)
          setHtmlContent(transformed)
        } else {
          setEmailBody(initial.body)
          setHtmlContent(initial.body)
        }
      }
    }

    loadInitialContent()
  }, [initial?.body])

  const toggleHtmlCodeView = useCallback(() => {
    setHtmlCodeView(prev => !prev)
  }, [])

  return {
    // States
    creationMode, setCreationMode,
    previewDevice, setPreviewDevice,
    htmlCodeView, toggleHtmlCodeView,
    aiPrompt, setAiPrompt,
    templateName, setTemplateName,
    description, setDescription,
    subjectLine, setSubjectLine,
    emailBody, setEmailBody,
    htmlContent, setHtmlContent,
    aiGeneratedHtml, setAiGeneratedHtml,
    isGeneratingAi, setIsGeneratingAi,
    category, setCategory,
    language, setLanguage,
    tone, setTone,
    length, setLength,
    goal, setGoal,
    extraContext, setExtraContext,
  }
}