import { useState } from 'react'
import { Stack, Button, Group, Grid } from '@mantine/core'
import { TemplateBasicInfo } from './TemplateBasicInfo'
import { TemplateEditor } from './TemplateEditor'
import { TemplatePreview } from './TemplatePreview'

export interface TemplateFormData {
  name: string
  category: string
  description: string
  subject: string
  body: string
}

const initialFormData: TemplateFormData = {
  name: '',
  category: '',
  description: '',
  subject: '',
  body: '',
}

interface CreateTemplateProps {
  onSubmit?: (data: TemplateFormData) => void
  onCancel?: () => void
}

export function CreateTemplate({ onSubmit, onCancel }: CreateTemplateProps) {
  const [formData, setFormData] = useState<TemplateFormData>(initialFormData)

  const updateFormData = (updates: Partial<TemplateFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const handleSubmit = () => {
    onSubmit?.(formData)
  }

  return (
    <div className="p-6 bg-slate-50/10 min-h-screen">
      <Stack gap="md">
        <Grid>
          <Grid.Col span={6}>
            <Stack gap="md">
              <TemplateBasicInfo 
                data={formData}
                onChange={updateFormData}
              />
              
              <TemplateEditor 
                data={formData}
                onChange={updateFormData}
              />
            </Stack>
          </Grid.Col>

          <Grid.Col span={6}>
            <div style={{ position: 'sticky', top: 20 }}>
              <TemplatePreview 
                data={formData}
              />
            </div>
          </Grid.Col>
        </Grid>

        <Group justify="space-between">
          <Button 
            variant="subtle" 
            onClick={onCancel}
            color="gray"
          >
            Cancel
          </Button>

          <Group>
            <Button 
              variant="default"
              onClick={() => {
                // Save as draft
              }}
            >
              Save as Draft
            </Button>
            <Button 
              onClick={handleSubmit}
              color="blue"
            >
              Save Template
            </Button>
          </Group>
        </Group>
      </Stack>
    </div>
  )
}
