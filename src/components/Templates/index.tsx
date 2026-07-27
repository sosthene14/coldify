import { useTemplateCreation } from '#/hooks/useTemplateCreation.tsx';
import { useTemplateSteps } from '#/hooks/useTemplateSteps.tsx';
import { Stack, Grid, Card } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { TemplateHeader } from './TemplateHeader';
import { TemplateInfo } from './TemplateInfo';
import { CreationModeTabs } from './CreationModeTabs';
import { SequenceSteps } from './SequenceSteps';
import { Sidebar } from './Sidebar';
 

 

export function TemplateCreatePage() {
  const creation = useTemplateCreation()
  const { steps, addStep, removeStep, updateStep } = useTemplateSteps()

  return (
    <div className="p-4 bg-slate-50/10 min-h-screen">
      <Stack gap="md">
        <TemplateHeader />

        <Grid  >
          <Grid.Col span={8}>
            <Stack gap="md">
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

              <Card withBorder radius="md" p="lg" bg="white">
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

              <SequenceSteps
                steps={steps}
                onAddStep={addStep}
                onRemoveStep={removeStep}
                onUpdateStep={updateStep}
              />
            </Stack>
          </Grid.Col>

          <Grid.Col span={4}>
            <Sidebar
              previewDevice={creation.previewDevice}
              setPreviewDevice={creation.setPreviewDevice}
            />
          </Grid.Col>
        </Grid>
      </Stack>
    </div>
  )
}