import { TemplateCreatePage } from '#/components/Templates/index.tsx';
import type { TemplateFormData } from '#/components/Templates/types.ts';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
 

export const Route = createFileRoute('/dashboard/templates/new')({
  component: NewTemplatePage,
})

function NewTemplatePage() {
  const navigate = useNavigate()

  const handleSubmit = (data: TemplateFormData) => {
    console.log('Template data submitted:', data)
    // TODO: API call to create template
    alert('Template created successfully!')
    navigate({ to: '/dashboard/templates' })
  }

  const handleCancel = () => {
    navigate({ to: '/dashboard/templates' })
  }

  return (
    <TemplateCreatePage 
      
    />
  )
}
