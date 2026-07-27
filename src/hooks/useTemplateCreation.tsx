import type { CreationMode, PreviewDevice } from '#/types/template.ts';
import { useState, useCallback } from 'react'
 

export function useTemplateCreation() {
  const [creationMode, setCreationMode] = useState<CreationMode>('manual')
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop')
  const [htmlCodeView, setHtmlCodeView] = useState(true)
  const [aiPrompt, setAiPrompt] = useState('')
  const [templateName, setTemplateName] = useState('')
  const [description, setDescription] = useState('')
  const [subjectLine, setSubjectLine] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [htmlContent, setHtmlContent] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [language, setLanguage] = useState<string | null>('French')
  const [tone, setTone] = useState<string | null>('Direct')
  const [length, setLength] = useState<string | null>('Short (~50 words)')
  const [goal, setGoal] = useState<string | null>('Book a call')
  const [extraContext, setExtraContext] = useState('')

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
    category, setCategory,
    language, setLanguage,
    tone, setTone,
    length, setLength,
    goal, setGoal,
    extraContext, setExtraContext,
  }
}