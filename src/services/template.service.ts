// services/template.service.ts

import { api } from "#/lib/api.ts";
import type { Template } from "@/types/template"

interface CreateTemplatePayload {
  name: string
  subject: string
  body: string
  category?: string
  language?: string
  preview?: string
  isPrivate?: boolean
}

export const templateService = {
  async getAll(): Promise<Template[]> {
    const { data } = await api.get("/templates")
    return data
  },

  async getById(id: string): Promise<Template> {
    const { data } = await api.get(`/templates/${id}`)
    return data
  },

  async createTemplate(template: CreateTemplatePayload): Promise<Template> {
    const { data } = await api.post(`/templates`, template)
    return data
  },

  async updateTemplate(id: string, template: Partial<CreateTemplatePayload>): Promise<Template> {
    const { data } = await api.patch(`/templates/${id}`, template)
    return data
  },

  async deleteTemplate(id: string): Promise<void> {
    await api.delete(`/templates/${id}`)
  },

  async duplicateTemplate(id: string): Promise<Template> {
    const { data } = await api.post(`/templates/${id}/duplicate`)
    return data
  },

  async starTemplate(id: string): Promise<{ starred: boolean }> {
    const { data } = await api.post(`/templates/${id}/star`)
    return data
  },

  async unstarTemplate(id: string): Promise<{ starred: boolean }> {
    const { data } = await api.delete(`/templates/${id}/star`)
    return data
  },

  async recordUsage(id: string): Promise<Template> {
    const { data } = await api.post(`/templates/${id}/use`)
    return data
  },
}