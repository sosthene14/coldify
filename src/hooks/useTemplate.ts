import { useQuery } from '@tanstack/react-query'
import { templateService } from '@/services/template.service'
import { useTemplateStore } from '@/stores/template.store'

export const useTemplate = () => {
  const {
    templates,
    selectedTemplate,
    search,
    setTemplates,
    setSelectedTemplate,
    setSearch,
    toggleStar,
  } = useTemplateStore()

  const query = useQuery({
    queryKey: ['templates'],
    queryFn: templateService.getAll,
     meta: {
        onSuccess: setTemplates,
  },
  })

  return {
    templates,
    selectedTemplate,
    search,

    setSearch,
    setSelectedTemplate,
    toggleStar,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  }
}