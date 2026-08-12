import { Group, Button, Badge } from '@mantine/core'
import { IconArrowLeft, IconSend, IconDeviceFloppy, IconChartArcs } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
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
  description,
  category,
  language,
  subjectLine,
  creationMode,
  emailBody,
  htmlContent,
  aiGeneratedHtml,
}: TemplateHeaderProps) {
  const navigate = useNavigate()
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const activeContent =
    creationMode === 'manual' ? emailBody :
    creationMode === 'html' ? htmlContent :
    aiGeneratedHtml

  const validateTemplate = () => {
    if (!templateName.trim()) {
      alert('Template name is required')
      return false
    }
    if (!subjectLine.trim()) {
      alert('Subject line is required')
      return false
    }
    if (!activeContent.trim()) {
      alert('Email body is required')
      return false
    }
    return true
  }

  const buildPayload = async () => {
    // Remplacer les images Base64 par des références MinIO
    let processedBody = activeContent
    
    if (activeContent.includes('data:image/')) {
      console.log('🔄 Processing Base64 images...')
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
        const result = await templateService.updateTemplate(templateId, payload)
        alert('Template updated successfully')
        console.log('Template updated →', result)
      } else {
        // Create new template
        const result = await templateService.createTemplate(payload)
        alert('Template published successfully')
        console.log('Template published →', result)
      }
      
      // Navigate back to templates list after successful publish
      setTimeout(() => {
        navigate({ to: '/dashboard/templates' })
      }, 1000)
    } catch (error) {
      console.error('Publish error:', error)
      alert('Failed to publish template: ' + (error instanceof Error ? error.message : 'Unknown error'))
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
          <span className="hidden sm:inline">Back to Templates</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </Group>
      <Group gap="sm" wrap="wrap">
        <Badge size="lg" variant="light" color="gray">
          {isEditMode ? 'Edit' : 'Draft'}
        </Badge>
        {templateId && (
          <Button 
            variant="default" 
            leftSection={<IconChartArcs size={16} />} 
            onClick={handleStats}
          >
            <span className="hidden sm:inline">Statistiques</span>
            <span className="sm:hidden">Stats</span>
          </Button>
        )}
 
        <Button 
          color="blue" 
          onClick={handlePublish}
          loading={isPublishing}
          disabled={isSaving}
        >
          <span className="hidden sm:inline">{isEditMode ? 'Update Template' : 'Publish Template'}</span>
          <span className="sm:hidden">{isEditMode ? 'Update' : 'Publish'}</span>
        </Button>
      </Group>
    </Group>
  )
}