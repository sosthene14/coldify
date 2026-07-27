import type { SequenceStep } from '#/types/template.ts';
import { useState, useCallback } from 'react'
 
export function useTemplateSteps(initialSteps?: SequenceStep[]) {
  const [steps, setSteps] = useState<SequenceStep[]>(
    initialSteps || [
      { id: crypto.randomUUID(), type: 'email', subject: 'Introduction rapide', delayDays: 0, stopOnReply: true },
    ]
  )

  const addStep = useCallback(() => {
    setSteps(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: 'email',
        subject: '',
        delayDays: 3,
        stopOnReply: true,
      },
    ])
  }, [])

  const removeStep = useCallback((id: string) => {
    setSteps(prev => prev.filter(s => s.id !== id))
  }, [])

  const updateStep = useCallback((id: string, updates: Partial<SequenceStep>) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }, [])

  const moveStep = useCallback((fromIndex: number, toIndex: number) => {
    setSteps(prev => {
      const newSteps = [...prev]
      const [moved] = newSteps.splice(fromIndex, 1)
      newSteps.splice(toIndex, 0, moved)
      return newSteps
    })
  }, [])

  return { steps, setSteps, addStep, removeStep, updateStep, moveStep }
}