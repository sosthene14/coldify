import { useEffect, useMemo, useState } from 'react'
import { Joyride, type EventData, type Step, STATUS } from 'react-joyride'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

const ONBOARDING_COMPLETED_KEY = 'so-mails-onboarding-completed'
const ONBOARDING_STEP_KEY = 'so-mails-onboarding-step'

const targetByStep = [
  '[data-onboarding="language-selector"]',
  '[data-onboarding="settings-mailboxes"]',
  '[data-onboarding="settings-notifications"]',
  '[data-onboarding="templates-create"]',
  '[data-onboarding="compose-header"]',
]

interface OnboardingTourProps {
  userId?: string
}

export function OnboardingTour({ userId }: OnboardingTourProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [run, setRun] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [stepIndex, setStepIndex] = useState(() => {
    if (!userId) return 0
    const storedStep = Number.parseInt(localStorage.getItem(`${ONBOARDING_STEP_KEY}:${userId}`) || '0', 10)
    return Number.isNaN(storedStep) ? 0 : Math.max(0, Math.min(storedStep, targetByStep.length - 1))
  })
  const [completed, setCompleted] = useState(() => (
    Boolean(userId) && localStorage.getItem(ONBOARDING_COMPLETED_KEY) === userId
  ))

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const updateMobileState = () => setIsMobile(mediaQuery.matches)
    updateMobileState()
    mediaQuery.addEventListener('change', updateMobileState)
    return () => mediaQuery.removeEventListener('change', updateMobileState)
  }, [])

  const getTarget = (index: number) => {
    if (isMobile && index === 1) {
      return '[data-onboarding="settings-mobile-mailboxes"]'
    }
    if (isMobile && index === 2) {
      return '[data-onboarding="settings-mobile-notifications"]'
    }
    return targetByStep[index]
  }

  const steps = useMemo<Step[]>(() => [
    {
      target: getTarget(0),
      content: t('onboarding_language_content'),
      disableBeacon: true,
    },
    {
      target: getTarget(1),
      content: t('onboarding_mailboxes_content'),
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: getTarget(2),
      content: t('onboarding_notifications_content'),
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: getTarget(3),
      content: t('onboarding_templates_content'),
      disableBeacon: true,
    },
    {
      target: getTarget(4),
      content: t('onboarding_compose_content'),
      disableBeacon: true,
      placement: 'bottom',
    },
  ], [isMobile, t])

  const isExpectedRoute = (index: number) => {
    if (index === 0) {
      return location.pathname.startsWith('/dashboard')
    }

    if (index === 1 || index === 2) {
      const section = index === 1 ? 'mailboxes' : 'notifications'
      return location.pathname === '/dashboard/settings'
        && (location.search as { section?: string }).section === section
    }

    if (index === 3) return location.pathname === '/dashboard/templates'
    return location.pathname === '/dashboard/mails/new'
  }

  const navigateToStep = (index: number) => {
    if (index === 0) {
      return
    } else if (index === 1) {
      navigate({ to: '/dashboard/settings', search: { section: 'mailboxes' } })
    } else if (index === 2) {
      navigate({ to: '/dashboard/settings', search: { section: 'notifications' } })
    } else if (index === 3) {
      navigate({ to: '/dashboard/templates' })
    } else {
      navigate({ to: '/dashboard/mails/new' })
    }
  }

  const finishOnboarding = () => {
    setRun(false)
    setCompleted(true)
    if (userId) {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, userId)
      localStorage.removeItem(`${ONBOARDING_STEP_KEY}:${userId}`)
    }

    window.requestAnimationFrame(() => {
      document.getElementById('react-joyride-portal')?.remove()
    })
  }

  useEffect(() => {
    if (!userId || localStorage.getItem(ONBOARDING_COMPLETED_KEY) === userId) {
      setCompleted(true)
      return
    }

    if (!isExpectedRoute(stepIndex)) {
      setRun(false)
      navigateToStep(stepIndex)
      return
    }

    let frameId = 0
    const waitForTarget = () => {
      if (document.querySelector(getTarget(stepIndex))) {
        localStorage.setItem(`${ONBOARDING_STEP_KEY}:${userId}`, String(stepIndex))
        setRun(true)
        return
      }
      frameId = window.requestAnimationFrame(waitForTarget)
    }

    waitForTarget()
    return () => window.cancelAnimationFrame(frameId)
  }, [isMobile, location.pathname, location.search, navigate, stepIndex, userId])

 const handleCallback = ({ action, index, status, type }: EventData) => {
  // 1. Capturer TOUTES les conditions d'arrêt possibles de Joyride
  if (
    status === STATUS.FINISHED || 
    status === STATUS.SKIPPED || 
    type === 'tour:end'
  ) {
    finishOnboarding()
    return
  }

  // 2. Gérer le passage à l'étape suivante/précédente
  if (type === 'step:after') {
    const nextIndex = action === 'prev' ? index - 1 : index + 1
    
    if (nextIndex < 0 || nextIndex >= steps.length) {
      finishOnboarding()
      return
    }

    // Bloquer le run immédiatement avant de changer d'index 
    // pour éviter que le backdrop de l'ancienne étape reste figé
    setRun(false)
    setStepIndex(nextIndex)
    
    if (userId) {
      localStorage.setItem(`${ONBOARDING_STEP_KEY}:${userId}`, String(nextIndex))
    }
  }
}

  if (completed || !userId || localStorage.getItem(ONBOARDING_COMPLETED_KEY) === userId) {
    return null
  }

  return (
    <Joyride
      steps={steps}
 
      run={run}
      stepIndex={stepIndex}
      onEvent={handleCallback}
      continuous
      scrollToFirstStep
      styles={{
        tooltipContent: {
          fontSize: 14,
          fontWeight: 500,
         
          lineHeight: 1.5,
        },
      }}
      locale={{
        back: t('back'),
        close: t('close'),
        last: t('finish'),
        next: t('next'),
        skip: t('skip'),
      }}
    />
  )
}