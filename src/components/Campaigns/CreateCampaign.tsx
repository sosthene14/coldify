import { useState } from 'react'
import { Button, Group, Stack, Stepper } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import { CampaignBasicInfo } from './CampaignBasicInfo'
import { CampaignAudience } from './CampaignAudience'
import { CampaignEmailSequence } from './CampaignEmailSequence'
import { CampaignSettings } from './CampaignSettings'
import { CampaignReview } from './CampaignReview'

export interface CampaignFormData {
  // Basic Info
  name: string
  description: string
  category: string
  
  // Audience
  leadList: string
  totalLeads: number
  filters: {
    location?: string[]
    industry?: string[]
    companySize?: string[]
  }
  
  // Email Sequence
  emails: Array<{
    id: string
    subject: string
    body: string
    delayDays: number
  }>
  
  // Settings
  sendingSchedule: {
    startDate: Date | null
    endDate: Date | null
    timeZone: string
    dailyLimit: number
  }
  mailboxes: string[]
  trackOpens: boolean
  trackClicks: boolean
  stopOnReply: boolean
}

const initialFormData: CampaignFormData = {
  name: '',
  description: '',
  category: '',
  leadList: '',
  totalLeads: 0,
  filters: {},
  emails: [
    { id: '1', subject: '', body: '', delayDays: 0 }
  ],
  sendingSchedule: {
    startDate: null,
    endDate: null,
    timeZone: 'UTC',
    dailyLimit: 100
  },
  mailboxes: [],
  trackOpens: true,
  trackClicks: true,
  stopOnReply: true
}

interface CreateCampaignProps {
  onSubmit?: (data: CampaignFormData) => void
  onCancel?: () => void
}

export function CreateCampaign({ onSubmit, onCancel }: CreateCampaignProps) {
  const [active, setActive] = useState(0)
  const [formData, setFormData] = useState<CampaignFormData>(initialFormData)

  const updateFormData = (updates: Partial<CampaignFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (active < 4) {
      setActive((current) => current + 1)
    }
  }

  const prevStep = () => {
    if (active > 0) {
      setActive((current) => current - 1)
    }
  }

  const handleSubmit = () => {
    onSubmit?.(formData)
  }

  return (
    <div className="p-6 bg-slate-50/10 min-h-screen">
      <Stack gap="xl">
        <Stepper 
          active={active} 
          onStepClick={setActive}
          size="sm"
          radius="md"
          color="indigo"
          completedIcon={<IconCheck size={18} />}
        >
          <Stepper.Step label="Basic Info" description="Campaign details">
            <CampaignBasicInfo 
              data={formData} 
              onChange={updateFormData}
            />
          </Stepper.Step>

          <Stepper.Step label="Audience" description="Select leads">
            <CampaignAudience 
              data={formData} 
              onChange={updateFormData}
            />
          </Stepper.Step>

          <Stepper.Step label="Email Sequence" description="Create emails">
            <CampaignEmailSequence 
              data={formData} 
              onChange={updateFormData}
            />
          </Stepper.Step>

          <Stepper.Step label="Settings" description="Configure schedule">
            <CampaignSettings 
              data={formData} 
              onChange={updateFormData}
            />
          </Stepper.Step>

          <Stepper.Step label="Review" description="Review and launch">
            <CampaignReview 
              data={formData}
            />
          </Stepper.Step>
        </Stepper>

        <Group justify="space-between">
          <Button 
            variant="subtle" 
            onClick={onCancel}
            color="gray"
          >
            Cancel
          </Button>

          <Group>
            {active > 0 && (
              <Button 
                variant="default" 
                onClick={prevStep}
              >
                Back
              </Button>
            )}
            
            {active < 4 ? (
              <Button 
                onClick={nextStep}
                color="indigo"
              >
                Next step
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                color="green"
              >
                Launch Campaign
              </Button>
            )}
          </Group>
        </Group>
      </Stack>
    </div>
  )
}
