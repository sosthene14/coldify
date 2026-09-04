import { Group, Button, Badge } from '@mantine/core'
import { IconArrowLeft,IconChartArcs } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { templateService } from '#/services/template.service.ts'
import { replaceBase64WithMinIO } from '#/lib/image-upload.ts'
import { useState } from 'react'

import type { CreationMode } from '#/types/template.ts'

interface TemplateHeaderProps {
  templateId?: string
  isEditMode?: boolean
  templateName: string
  description: string
  category: string | null
  language: string | null
  subjectLine: string
  creationMode: CreationMode
  emailBody: string
  htmlContent: string
  aiGeneratedHtml: string
}

export function TemplateHeader({
  templateId,
  isEditMode = false,
  templateName,
  category,
  language,
  subjectLine,
  creationMode,
  emailBody,
  htmlContent,
  aiGeneratedHtml,
}: TemplateHeaderProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSaving, ] = useState(false)

  const activeContent =
    creationMode === 'manual' ? emailBody :
    creationMode === 'html' ? htmlContent :
    aiGeneratedHtml

  const validateTemplate = () => {
    if (!templateName.trim()) {
      toast.error(t('template_name_required'))
      return false
    }
    if (!subjectLine.trim()) {
      toast.error(t('subject_line_required'))
      return false
    }
    if (!activeContent.trim()) {
      toast.error(t('email_body_required'))
      return false
    }
    return true
  }

  const buildPayload = async () => {
    // Remplacer les images Base64 par des références MinIO
    let processedBody = activeContent
    
    if (activeContent.includes('data:image/')) {
       processedBody = await replaceBase64WithMinIO(activeContent)
    }

    // Generate preview from content (first 100 chars)
    const preview = processedBody.replace(/<[^>]*>/g, '').substring(0, 100)
    
    return {
      name: templateName,
      subject: subjectLine,
      body: processedBody,
      category: category || undefined,
      language: language || 'French',
      preview,
      isPrivate: false, // Public by default when published
    }
  }

  const handleStats = () => {
    navigate({ to: `/dashboard/templates/${templateId}/stats` })
  }

 

  const handlePublish = async () => {
    if (!validateTemplate()) return
    
    setIsPublishing(true)
    try {
      const payload = await buildPayload()
      
      if (isEditMode && templateId) {
        // Update existing template
         await templateService.updateTemplate(templateId, payload)
        toast.success(t('template_updated_success'))
       } else {
        // Create new template
         await templateService.createTemplate(payload)
        toast.success(t('template_published_success'))
       }
      
      // Navigate back to templates list after successful publish
      setTimeout(() => {
        navigate({ to: '/dashboard/templates' })
      }, 1000)
    } catch (error) {
      console.error('Publish error:', error)
      toast.error(t('failed_publish_template') + ': ' + (error instanceof Error ? error.message : t('unexpected_error')))
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <Group justify="space-between" wrap="wrap" gap="sm">
      <Group gap="sm">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate({ to: '/dashboard/templates' })}
        >
          <span className="hidden sm:inline">{t('back_to_templates')}</span>
          <span className="sm:hidden">{t('back')}</span>
        </Button>
      </Group>
      <Group gap="sm" wrap="wrap">
        <Badge size="lg" variant="light" color="gray">
          {isEditMode ? t('edit') : t('draft')}
        </Badge>
        {templateId && (
          <Button 
            variant="default" 
            leftSection={<IconChartArcs size={16} />} 
            onClick={handleStats}
          >
            <span className="hidden sm:inline">{t('statistics_full')}</span>
            <span className="sm:hidden">{t('stats')}</span>
          </Button>
        )}
 
        <Button 
          color="blue" 
          onClick={handlePublish}
          loading={isPublishing}
          disabled={isSaving}
        >
          <span className="hidden sm:inline">{isEditMode ? t('update_template') : t('publish_template')}</span>
          <span className="sm:hidden">{isEditMode ? t('update') : t('publish')}</span>
        </Button>
      </Group>
    </Group>
  )
}