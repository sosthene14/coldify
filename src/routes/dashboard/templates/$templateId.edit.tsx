import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { TemplateCreatePage } from '#/components/Templates/index.tsx'
import { templateService } from '#/services/template.service.ts'
import { useEffect, useState } from 'react'
import type { Template } from '#/types/template.ts'

export const Route = createFileRoute('/dashboard/templates/$templateId/edit')({
  component: EditTemplatePage,
})

function EditTemplatePage() {
  const { t } = useTranslation()
  const { templateId } = Route.useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [template, setTemplate] = useState<Template | null>(null)
  
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const data = await templateService.getById(templateId)
        setTemplate(data)
      } catch (error) {
        console.error('Failed to load template:', error)
        alert(t('failed_load_template'))
        navigate({ to: '/dashboard/templates' })
      } finally {
        setIsLoading(false)
      }
    }

    loadTemplate()
  }, [templateId, navigate])

  if (isLoading || !template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">{t('loading_template')}</p>
        </div>
      </div>
    )
  }

  return (
    <TemplateCreatePage 
      initialTemplate={template}
      isEditMode={true}
    />
  )
}