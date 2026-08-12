import { useTemplateCreation } from '#/hooks/useTemplateCreation.tsx';
import { useTemplateSteps } from '#/hooks/useTemplateSteps.tsx';
import { Stack, Grid, Card } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { TemplateHeader } from './TemplateHeader';
import { TemplateInfo } from './TemplateInfo';
import { CreationModeTabs } from './CreationModeTabs';
import { SequenceSteps } from './SequenceSteps';
import { Sidebar } from './Sidebar';
import type { Template } from '#/types/template.ts';

interface TemplateCreatePageProps {
  initialTemplate?: Template
  isEditMode?: boolean
}

export function TemplateCreatePage({ initialTemplate, isEditMode = false }: TemplateCreatePageProps) {
  const creation = useTemplateCreation({ initialTemplate })

   const activeHtmlContent =
  creation.creationMode === 'manual' ? creation.emailBody :
  creation.creationMode === 'html' ? creation.htmlContent :
  creation.aiGeneratedHtml

  return (
    <div className="p-2 sm:p-4 bg-slate-50/10 min-h-screen">
      <Stack gap={{ base: 'xs', sm: 'sm', md: 'md' }}>
        <TemplateHeader
  templateId={initialTemplate?.id}
  isEditMode={isEditMode}
  templateName={creation.templateName}
  description={creation.description}
  category={creation.category}
  language={creation.language}
  subjectLine={creation.subjectLine}
  creationMode={creation.creationMode}
  emailBody={creation.emailBody}
  htmlContent={creation.htmlContent}
  aiGeneratedHtml={creation.aiGeneratedHtml}
/>

        <Grid gutter={{ base: 'xs', sm: 'sm', md: 'md' }}>
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack gap={{ base: 'xs', sm: 'sm', md: 'md' }}>
              <TemplateInfo
                templateName={creation.templateName}
                setTemplateName={creation.setTemplateName}
                description={creation.description}
                setDescription={creation.setDescription}
                category={creation.category}
                setCategory={creation.setCategory}
                language={creation.language}
                setLanguage={creation.setLanguage}
              />

              <Card withBorder radius="md" p={{ base: 'sm', sm: 'md', md: 'lg' }} bg="white">
                <CreationModeTabs
                  creationMode={creation.creationMode}
                  setCreationMode={creation.setCreationMode}
                  subjectLine={creation.subjectLine}
                  setSubjectLine={creation.setSubjectLine}
                  emailBody={creation.emailBody}
                  setEmailBody={creation.setEmailBody}
                  htmlContent={creation.htmlContent}
                  setHtmlContent={creation.setHtmlContent}
                  htmlCodeView={creation.htmlCodeView}
                  toggleHtmlCodeView={creation.toggleHtmlCodeView}
                  aiPrompt={creation.aiPrompt}
                  setAiPrompt={creation.setAiPrompt}
                  tone={creation.tone}
                  setTone={creation.setTone}
                  length={creation.length}
                  setLength={creation.setLength}
                  goal={creation.goal}
                  setGoal={creation.setGoal}
                  extraContext={creation.extraContext}
                  setExtraContext={creation.setExtraContext}
                />
              </Card>

              {/* <SequenceSteps
                steps={steps}
                onAddStep={addStep}
                onRemoveStep={removeStep}
                onUpdateStep={updateStep}
              /> */}
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 4 }} style={{ position: 'relative' }}>
            <div style={{ position: 'sticky', top: '5rem', maxHeight: 'calc(100vh - 6rem)', overflowY: 'auto' }}>
              <Sidebar
                previewDevice={creation.previewDevice}
                setPreviewDevice={creation.setPreviewDevice}
                htmlContent={activeHtmlContent}
                subjectLine={creation.subjectLine}
                isLoading={creation.creationMode === 'ai' && creation.isGeneratingAi}
              />
            </div>
          </Grid.Col>
        </Grid>
      </Stack>
    </div>
  )
}