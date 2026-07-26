export type LeadStatus = 
  | 'new'
  | 'contacted'
  | 'opened'
  | 'clicked'
  | 'replied'
  | 'interested'
  | 'not_interested'
  | 'bounced'
  | 'unsubscribed'
  | 'do_not_contact'

export type LeadSource = 
  | 'manual'
  | 'csv_import'
  | 'apollo'
  | 'linkedin_scraper'
  | 'api'
  | 'form'
  | 'other'

export interface CustomField {
  key: string
  value: string
}

export interface CampaignStatus {
  campaignId: string
  campaignName: string
  status: LeadStatus
  sequenceStep: number
  lastContactedAt?: string
  lastActivityAt?: string
}

export interface Lead {
  // Identité
  id: string
  firstName: string
  lastName: string
  fullName?: string // souvent calculé: `${firstName} ${lastName}`
  email: string
  secondaryEmail?: string
  phone?: string
  avatarUrl?: string

  // Poste / Entreprise
  jobTitle?: string
  companyName?: string
  companyWebsite?: string
  companyDomain?: string // utile pour dédupliquer par domaine
  industry?: string
  companySize?: string // ex: '1-10', '11-50', '51-200', '201-500', '500+'
  linkedinUrl?: string
  companyLinkedinUrl?: string

  // Localisation
  country?: string
  city?: string
  timezone?: string // ex: 'Europe/Paris'

  // Statut & Tracking
  status: LeadStatus // Statut global (le plus avancé de toutes les campagnes)
  campaignIds: string[]
  campaignStatuses?: CampaignStatus[] // Statut par campagne
  currentSequenceStep?: number
  lastContactedAt?: string // ISO date
  lastRepliedAt?: string
  emailsSentCount: number
  emailsOpenedCount: number
  emailsClickedCount: number

  // Enrichissement / Scoring
  leadScore?: number
  tags: string[]
  source: LeadSource
  customFields?: CustomField[]

  // Conformité
  gdprConsent: boolean
  isUnsubscribed: boolean
  unsubscribedAt?: string

  // Métadonnées
  createdAt: string
  updatedAt: string
  ownerId?: string
  notes?: string
}

// Type utilitaire pour la création (sans champs auto-générés)
export type CreateLeadInput = Omit<
  Lead,
  'id' | 'createdAt' | 'updatedAt' | 'emailsSentCount' | 'emailsOpenedCount' | 'emailsClickedCount'
>

// Type utilitaire pour l'update partiel
export type UpdateLeadInput = Partial<CreateLeadInput>
