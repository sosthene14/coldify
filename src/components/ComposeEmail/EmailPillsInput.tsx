import { useState, useRef, KeyboardEvent } from 'react'
import { PillsInput, Pill, Combobox, useCombobox, Text } from '@mantine/core'

interface EmailPillsInputProps {
  label: string
  placeholder?: string
  value: string[]
  onChange: (emails: string[]) => void
  required?: boolean
  error?: string
}

export function EmailPillsInput({
  label,
  placeholder = 'Enter email address',
  value,
  onChange,
  required = false,
  error,
}: EmailPillsInputProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  })

  const [inputValue, setInputValue] = useState('')
  const [invalidEmails, setInvalidEmails] = useState<Set<string>>(new Set())

  const validateEmail = (email: string): boolean => {
    const trimmed = email.trim()
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
  }

  const addEmail = (email: string) => {
    const trimmed = email.trim()
    
    if (!trimmed) return

    // Check if email already exists
    if (value.includes(trimmed)) {
      setInputValue('')
      return
    }

    // Validate email format
    if (!validateEmail(trimmed)) {
      setInvalidEmails(new Set([...invalidEmails, trimmed]))
      // Still add it but mark as invalid
      onChange([...value, trimmed])
      setInputValue('')
      return
    }

    // Remove from invalid if it was there
    if (invalidEmails.has(trimmed)) {
      const newInvalid = new Set(invalidEmails)
      newInvalid.delete(trimmed)
      setInvalidEmails(newInvalid)
    }

    onChange([...value, trimmed])
    setInputValue('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',' || event.key === ';') {
      event.preventDefault()
      addEmail(inputValue)
    } else if (event.key === 'Backspace' && inputValue === '' && value.length > 0) {
      // Remove last email when backspace is pressed on empty input
      const newValue = [...value]
      const removed = newValue.pop()
      onChange(newValue)
      
      // Remove from invalid set if it was there
      if (removed && invalidEmails.has(removed)) {
        const newInvalid = new Set(invalidEmails)
        newInvalid.delete(removed)
        setInvalidEmails(newInvalid)
      }
    }
  }

  const handleBlur = () => {
    // Add email when input loses focus
    if (inputValue.trim()) {
      addEmail(inputValue)
    }
  }

  const handleRemove = (emailToRemove: string) => {
    onChange(value.filter((email) => email !== emailToRemove))
    
    // Remove from invalid set if it was there
    if (invalidEmails.has(emailToRemove)) {
      const newInvalid = new Set(invalidEmails)
      newInvalid.delete(emailToRemove)
      setInvalidEmails(newInvalid)
    }
  }

  const handlePaste = (event: React.ClipboardEvent) => {
    const pastedText = event.clipboardData.getData('text')
    
    // Check if pasted text contains multiple emails (separated by comma, semicolon, space, or newline)
    const emails = pastedText
      .split(/[,;\s\n]+/)
      .map(email => email.trim())
      .filter(email => email.length > 0)

    if (emails.length > 1) {
      event.preventDefault()
      
      // Add all emails
      const newEmails: string[] = []
      const newInvalid = new Set(invalidEmails)
      
      for (const email of emails) {
        if (!value.includes(email) && !newEmails.includes(email)) {
          newEmails.push(email)
          
          if (!validateEmail(email)) {
            newInvalid.add(email)
          }
        }
      }
      
      onChange([...value, ...newEmails])
      setInvalidEmails(newInvalid)
      setInputValue('')
    }
  }

  return (
    <Combobox store={combobox} onOptionSubmit={() => {}}>
      <Combobox.Target>
        <PillsInput
          label={label}
          placeholder={value.length === 0 ? placeholder : undefined}
          required={required}
          error={error}
          onClick={() => combobox.openDropdown()}
        >
          <Pill.Group>
            {value.map((email, index) => {
              const isInvalid = invalidEmails.has(email)
              
              return (
                <Pill
                  key={`${email}-${index}`}
                  withRemoveButton
                  onRemove={() => handleRemove(email)}
                  styles={{
                    root: {
                      backgroundColor: isInvalid ? '#ffe0e0' : undefined,
                      borderColor: isInvalid ? '#ff6b6b' : undefined,
                    },
                    label: {
                      color: isInvalid ? '#c92a2a' : undefined,
                    },
                  }}
                >
                  {email}
                </Pill>
              )
            })}

            <Combobox.EventsTarget>
              <PillsInput.Field
                value={inputValue}
                onChange={(event) => setInputValue(event.currentTarget.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                onPaste={handlePaste}
                placeholder={value.length === 0 ? placeholder : undefined}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.Target>
      
      {invalidEmails.size > 0 && (
        <Text size="xs" c="red" mt={4}>
          Invalid email format: {Array.from(invalidEmails).join(', ')}
        </Text>
      )}
    </Combobox>
  )
}
