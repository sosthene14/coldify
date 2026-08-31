import { create } from 'zustand'
import type { Template } from '@/types/template'
import { templateService } from '#/services/template.service.ts';

interface TemplateStore {
  templates: Template[]
  selectedTemplate: Template | null
  search: string
  isLoading: boolean
  error: string | null

  setTemplates: (templates: Template[]) => void
  setSelectedTemplate: (template: Template | null) => void
  setSearch: (value: string) => void
  toggleStar: (id: string) => void
  
  // Actions async
  fetchTemplates: () => Promise<void>
  starTemplate: (id: string) => Promise<void>
  unstarTemplate: (id: string) => Promise<void>
  deleteTemplate: (id: string) => Promise<void>
  duplicateTemplate: (id: string) => Promise<Template>
}

export const useTemplateStore = create<TemplateStore>((set, ) => ({
  templates: [],
  selectedTemplate: null,
  search: '',
  isLoading: false,
  error: null,

  setTemplates: (templates) => set({ templates }),

  setSelectedTemplate: (template) =>
    set({
      selectedTemplate: template,
    }),

  setSearch: (search) =>
    set({
      search,
    }),

  toggleStar: (id) =>
    set((state) => ({
      templates: state.templates.map((template) =>
        template.id === id
          ? {
              ...template,
              starred: !template.starred,
            }
          : template
      ),
    })),

  fetchTemplates: async () => {
    set({ isLoading: true, error: null })
    try {
      const templates = await templateService.getAll()
      set({ templates, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch templates:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch templates',
        isLoading: false 
      })
    }
  },

  starTemplate: async (id: string) => {
    try {
      await templateService.starTemplate(id)
      set((state) => ({
        templates: state.templates.map((template) =>
          template.id === id ? { ...template, starred: true } : template
        ),
      }))
    } catch (error) {
      console.error('Failed to star template:', error)
    }
  },

  unstarTemplate: async (id: string) => {
    try {
      await templateService.unstarTemplate(id)
      set((state) => ({
        templates: state.templates.map((template) =>
          template.id === id ? { ...template, starred: false } : template
        ),
      }))
    } catch (error) {
      console.error('Failed to unstar template:', error)
    }
  },

  deleteTemplate: async (id: string) => {
    try {
      await templateService.deleteTemplate(id)
      set((state) => ({
        templates: state.templates.filter((template) => template.id !== id),
      }))
    } catch (error) {
      console.error('Failed to delete template:', error)
      throw error
    }
  },

  duplicateTemplate: async (id: string) => {
    try {
      const newTemplate = await templateService.duplicateTemplate(id)
      set((state) => ({
        templates: [newTemplate, ...state.templates],
      }))
      return newTemplate
    } catch (error) {
      console.error('Failed to duplicate template:', error)
      throw error
    }
  },
}))