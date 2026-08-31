import { TemplateCreatePage } from '#/components/Templates/index.tsx';
import { createFileRoute } from '@tanstack/react-router'
 

export const Route = createFileRoute('/dashboard/templates/new')({
  component: NewTemplatePage,
})

function NewTemplatePage() {
  

  return (
    <TemplateCreatePage 
      
    />
  )
}
