import { mergeTagGroups } from '#/types/template.ts'
import { Stack, TextInput, Text } from '@mantine/core'
import { RichTextEditor, Link } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Color from '@tiptap/extension-color'
import {TextStyle} from '@tiptap/extension-text-style'
import Superscript from '@tiptap/extension-superscript'
import SubScript from '@tiptap/extension-subscript'
import ResizableImage  from 'tiptap-extension-resize-image'
import {  IconPhoto } from '@tabler/icons-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageInsertModal } from './InsertModal'

interface ManualEditorProps {
  subjectLine: string
  setSubjectLine: (value: string) => void
  emailBody: string
  setEmailBody: (value: string) => void
}

export function ManualEditor({ subjectLine, setSubjectLine, emailBody, setEmailBody }: ManualEditorProps) {
  const { t } = useTranslation()
  const [tagMenuOpen, setTagMenuOpen] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)


 const editor = useEditor({
  extensions: [
    StarterKit,
    Underline,
    Link,
    Superscript,
    SubScript,
    Highlight,
    TextStyle,
    Color,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ResizableImage, // remplace Image
    Placeholder.configure({ placeholder: 'Hi {{firstName}}, I noticed {{companyName}} is...' }),
  ],
  content: emailBody,
  onUpdate: ({ editor }) => setEmailBody(editor.getHTML()),
})

  // Mettre à jour le contenu de l'éditeur quand emailBody change (ex: chargement d'un template)
  useEffect(() => {
    if (editor && emailBody && emailBody !== editor.getHTML()) {
      editor.commands.setContent(emailBody)
    }
  }, [editor, emailBody])

  const insertImage = (src: string) => {
  editor?.chain().focus().setImage({ src }).run()
}

  const insertTag = (tag: string) => {
    editor?.chain().focus().insertContent(`{{${tag}}} `).run()
    setTagMenuOpen(false)
  }

  const wordCount = editor?.getText().trim().split(/\s+/).filter(Boolean).length ?? 0

  return (
    <Stack gap="sm">
      <TextInput
        label={t('subject_line')}
        placeholder="Il me faut un taff"
        value={subjectLine}
        onChange={(e) => setSubjectLine(e.currentTarget.value)}
      />

      <RichTextEditor
        editor={editor}
        styles={{
          root: { border: '1px solid #E9ECEF', borderRadius: 6, fontWeight:15 },
          toolbar: { borderBottom: '1px solid #E9ECEF', backgroundColor: '#fff' },
          content: { minHeight: 220 },
        }}
      >
        <RichTextEditor.Toolbar sticky>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.ColorPicker
              colors={['#000000', '#495057', '#1971C2', '#2F9E44', '#F08C00', '#E03131']}
            />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
           <RichTextEditor.Control
  onClick={() => setImageModalOpen(true)}
  aria-label={t('insert_image')}
  title={t('insert_image')}
>
  <IconPhoto size={16} />
</RichTextEditor.Control>
      
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        {tagMenuOpen && (
          <div
            style={{
              padding: '8px',
              borderBottom: '1px solid #E9ECEF',
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            {mergeTagGroups.map((group) => (
              <div key={group.label}>
                <Text size="xs" c="dimmed" fw={600}>{group.label}</Text>
                <Stack gap={2}>
                  {group.tags.map((tag) => (
                    <Text
                      key={tag}
                      size="sm"
                      c="blue"
                      style={{ cursor: 'pointer' }}
                      onClick={() => insertTag(tag)}
                    >
                      {`{{${tag}}}`}
                    </Text>
                  ))}
                </Stack>
              </div>
            ))}
          </div>
        )}

        <RichTextEditor.Content />
      </RichTextEditor>

      <Text size="xs" c="dimmed">{t('words_spam_score', { count: wordCount })}</Text>

      <ImageInsertModal
  opened={imageModalOpen}
  onClose={() => setImageModalOpen(false)}
  onInsert={insertImage}
/>
    </Stack>
  )
}