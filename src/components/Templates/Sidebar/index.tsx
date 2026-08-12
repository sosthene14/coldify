import { PreviewCard } from './PreviewCard'
import type { PreviewDevice } from '#/types/template.ts';
 
interface SidebarProps {
  previewDevice: PreviewDevice
  setPreviewDevice: (device: PreviewDevice) => void
  subjectLine: string
  htmlContent: string
  isLoading?: boolean
}

export function Sidebar({ previewDevice, setPreviewDevice, subjectLine, htmlContent,isLoading }: SidebarProps) {
  return (
    <div>
        <PreviewCard
        previewDevice={previewDevice}
        setPreviewDevice={setPreviewDevice}
        subjectLine={subjectLine}
        htmlContent={htmlContent}
        isLoading={isLoading}
      />
    
    </div>
  )
}