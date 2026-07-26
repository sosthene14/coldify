import { useState } from 'react'
import { Stack, Text, Card, Group, Button, FileButton, Paper, ThemeIcon, Select, Table, Checkbox, Badge, Stepper } from '@mantine/core'
import { IconUpload, IconFileSpreadsheet, IconUsers, IconCheck, IconX, IconDownload } from '@tabler/icons-react'

type ImportMethod = 'file' | 'manual' | 'api' | null

interface ColumnMapping {
  csvColumn: string
  mappedTo: string
}

export function ImportLeads() {
  const [importMethod, setImportMethod] = useState<ImportMethod>(null)
  const [file, setFile] = useState<File | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([])

  const handleFileUpload = (uploadedFile: File | null) => {
    setFile(uploadedFile)
    if (uploadedFile) {
      // Simulate column detection
      setColumnMappings([
        { csvColumn: 'First Name', mappedTo: 'firstName' },
        { csvColumn: 'Last Name', mappedTo: 'lastName' },
        { csvColumn: 'Email', mappedTo: 'email' },
        { csvColumn: 'Company', mappedTo: 'company' },
        { csvColumn: 'Title', mappedTo: 'jobTitle' },
        { csvColumn: 'Phone', mappedTo: 'phone' },
        { csvColumn: 'Location', mappedTo: 'location' },
      ])
      setActiveStep(1)
    }
  }

  const fieldOptions = [
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName', label: 'Last Name' },
    { value: 'email', label: 'Email' },
    { value: 'company', label: 'Company' },
    { value: 'jobTitle', label: 'Job Title' },
    { value: 'phone', label: 'Phone' },
    { value: 'location', label: 'Location' },
    { value: 'website', label: 'Website' },
    { value: 'industry', label: 'Industry' },
    { value: 'skip', label: '— Skip this column —' },
  ]

  if (!importMethod) {
    return (
      <Stack gap="xl" p="xl">
        <div>
          <Text size="xl" fw={700} mb="xs">
            Import Leads
          </Text>
          <Text size="sm" c="dimmed">
            Choose how you'd like to add leads to your database
          </Text>
        </div>

        <Group grow>
          <Card
            withBorder
            radius="md"
            p="xl"
            style={{ cursor: 'pointer', transition: 'all 150ms' }}
            className="hover:shadow-md"
            onClick={() => setImportMethod('file')}
          >
            <Stack align="center" gap="md">
              <ThemeIcon size={64} radius="md" variant="light" color="blue">
                <IconFileSpreadsheet size={32} />
              </ThemeIcon>
              <div style={{ textAlign: 'center' }}>
                <Text size="lg" fw={600} mb="xs">
                  Upload CSV/Excel
                </Text>
                <Text size="sm" c="dimmed">
                  Import leads from a CSV or Excel file
                </Text>
              </div>
              <Button variant="light" color="blue" fullWidth>
                Choose File
              </Button>
            </Stack>
          </Card>

          <Card
            withBorder
            radius="md"
            p="xl"
            style={{ cursor: 'pointer', transition: 'all 150ms' }}
            className="hover:shadow-md"
            onClick={() => setImportMethod('manual')}
          >
            <Stack align="center" gap="md">
              <ThemeIcon size={64} radius="md" variant="light" color="green">
                <IconUsers size={32} />
              </ThemeIcon>
              <div style={{ textAlign: 'center' }}>
                <Text size="lg" fw={600} mb="xs">
                  Add Manually
                </Text>
                <Text size="sm" c="dimmed">
                  Enter lead information one by one
                </Text>
              </div>
              <Button variant="light" color="green" fullWidth>
                Add Lead
              </Button>
            </Stack>
          </Card>

          <Card
            withBorder
            radius="md"
            p="xl"
            style={{ cursor: 'pointer', transition: 'all 150ms' }}
            className="hover:shadow-md"
            onClick={() => setImportMethod('api')}
          >
            <Stack align="center" gap="md">
              <ThemeIcon size={64} radius="md" variant="light" color="indigo">
                <IconUpload size={32} />
              </ThemeIcon>
              <div style={{ textAlign: 'center' }}>
                <Text size="lg" fw={600} mb="xs">
                  API Integration
                </Text>
                <Text size="sm" c="dimmed">
                  Connect with CRMs and other tools
                </Text>
              </div>
              <Button variant="light" color="indigo" fullWidth>
                Connect
              </Button>
            </Stack>
          </Card>
        </Group>

        <Card withBorder radius="md" p="lg" bg="blue.0">
          <Group gap="md">
            <IconDownload size={20} />
            <div>
              <Text size="sm" fw={600} mb={4}>
                Need a template?
              </Text>
              <Text size="xs" c="dimmed">
                Download our CSV template to ensure your data is formatted correctly
              </Text>
            </div>
            <Button variant="subtle" size="sm" ml="auto">
              Download Template
            </Button>
          </Group>
        </Card>
      </Stack>
    )
  }

  if (importMethod === 'file') {
    return (
      <Stack gap="lg" p="xl">
        <Group justify="space-between">
          <div>
            <Text size="xl" fw={700} mb="xs">
              Import from File
            </Text>
            <Text size="sm" c="dimmed">
              Upload your CSV or Excel file and map the columns
            </Text>
          </div>
          <Button variant="subtle" onClick={() => setImportMethod(null)}>
            Back
          </Button>
        </Group>

        <Stepper active={activeStep} onStepClick={setActiveStep} size="sm">
          <Stepper.Step label="Upload File" description="Select your file">
            <Card withBorder radius="md" p="xl" mt="md">
              <Stack gap="xl" align="center">
                <ThemeIcon size={80} radius="md" variant="light" color="blue">
                  <IconUpload size={40} />
                </ThemeIcon>

                <div style={{ textAlign: 'center' }}>
                  <Text size="lg" fw={600} mb="xs">
                    {file ? file.name : 'Drop your file here or click to browse'}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Supports CSV, XLSX, XLS files up to 10MB
                  </Text>
                </div>

                <FileButton onChange={handleFileUpload} accept=".csv,.xlsx,.xls">
                  {(props) => (
                    <Button {...props} size="lg" leftSection={<IconFileSpreadsheet size={20} />}>
                      {file ? 'Change File' : 'Choose File'}
                    </Button>
                  )}
                </FileButton>

                {file && (
                  <Paper withBorder p="md" radius="md" w="100%">
                    <Group justify="space-between">
                      <Group gap="sm">
                        <IconFileSpreadsheet size={24} color="#228BE6" />
                        <div>
                          <Text size="sm" fw={500}>
                            {file.name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {(file.size / 1024).toFixed(2)} KB
                          </Text>
                        </div>
                      </Group>
                      <Badge color="green" variant="light">
                        Ready
                      </Badge>
                    </Group>
                  </Paper>
                )}
              </Stack>
            </Card>
          </Stepper.Step>

          <Stepper.Step label="Map Columns" description="Match your fields">
            <Card withBorder radius="md" p="lg" mt="md">
              <Stack gap="md">
                <div>
                  <Text size="md" fw={600} mb="xs">
                    Map Your Columns
                  </Text>
                  <Text size="sm" c="dimmed">
                    Match the columns from your file to our lead fields
                  </Text>
                </div>

                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>CSV Column</Table.Th>
                      <Table.Th>Sample Data</Table.Th>
                      <Table.Th>Map To Field</Table.Th>
                      <Table.Th>Required</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {columnMappings.map((mapping, index) => (
                      <Table.Tr key={index}>
                        <Table.Td>
                          <Text size="sm" fw={500}>
                            {mapping.csvColumn}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c="dimmed">
                            {mapping.csvColumn === 'Email' ? 'john@example.com' : 
                             mapping.csvColumn === 'First Name' ? 'John' :
                             mapping.csvColumn === 'Company' ? 'Acme Inc' : 
                             'Sample data'}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Select
                            data={fieldOptions}
                            value={mapping.mappedTo}
                            onChange={(value) => {
                              const newMappings = [...columnMappings]
                              newMappings[index].mappedTo = value || 'skip'
                              setColumnMappings(newMappings)
                            }}
                            size="sm"
                          />
                        </Table.Td>
                        <Table.Td>
                          {mapping.mappedTo === 'email' || mapping.mappedTo === 'firstName' ? (
                            <Badge color="red" variant="light" size="sm">
                              Required
                            </Badge>
                          ) : (
                            <Text size="sm" c="dimmed">
                              Optional
                            </Text>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>

                <Group justify="flex-end" mt="md">
                  <Button variant="default" onClick={() => setActiveStep(0)}>
                    Back
                  </Button>
                  <Button onClick={() => setActiveStep(2)}>
                    Continue to Review
                  </Button>
                </Group>
              </Stack>
            </Card>
          </Stepper.Step>

          <Stepper.Step label="Review" description="Validate and import">
            <Card withBorder radius="md" p="lg" mt="md">
              <Stack gap="xl">
                <div>
                  <Text size="md" fw={600} mb="xs">
                    Review Import
                  </Text>
                  <Text size="sm" c="dimmed">
                    Review the data before importing to your database
                  </Text>
                </div>

                <Group grow>
                  <Card withBorder p="md" radius="md">
                    <Group gap="xs" mb="xs">
                      <ThemeIcon size="sm" color="green" variant="light">
                        <IconCheck size={12} />
                      </ThemeIcon>
                      <Text size="xs" tt="uppercase" fw={600} c="dimmed">
                        Valid Leads
                      </Text>
                    </Group>
                    <Text size="xl" fw={700} c="green">
                      847
                    </Text>
                    <Text size="xs" c="dimmed" mt={4}>
                      Ready to import
                    </Text>
                  </Card>

                  <Card withBorder p="md" radius="md">
                    <Group gap="xs" mb="xs">
                      <ThemeIcon size="sm" color="yellow" variant="light">
                        <IconCheck size={12} />
                      </ThemeIcon>
                      <Text size="xs" tt="uppercase" fw={600} c="dimmed">
                        Duplicates
                      </Text>
                    </Group>
                    <Text size="xl" fw={700} c="yellow">
                      23
                    </Text>
                    <Text size="xs" c="dimmed" mt={4}>
                      Already in database
                    </Text>
                  </Card>

                  <Card withBorder p="md" radius="md">
                    <Group gap="xs" mb="xs">
                      <ThemeIcon size="sm" color="red" variant="light">
                        <IconX size={12} />
                      </ThemeIcon>
                      <Text size="xs" tt="uppercase" fw={600} c="dimmed">
                        Invalid
                      </Text>
                    </Group>
                    <Text size="xl" fw={700} c="red">
                      12
                    </Text>
                    <Text size="xs" c="dimmed" mt={4}>
                      Missing required fields
                    </Text>
                  </Card>
                </Group>

                <Card withBorder p="md" radius="md" bg="blue.0">
                  <Stack gap="xs">
                    <Group gap="xs">
                      <Checkbox defaultChecked />
                      <Text size="sm" fw={500}>
                        Skip duplicate leads
                      </Text>
                    </Group>
                    <Group gap="xs">
                      <Checkbox />
                      <Text size="sm" fw={500}>
                        Update existing leads with new data
                      </Text>
                    </Group>
                    <Group gap="xs">
                      <Checkbox defaultChecked />
                      <Text size="sm" fw={500}>
                        Send import summary email
                      </Text>
                    </Group>
                  </Stack>
                </Card>

                <Group justify="space-between">
                  <Button variant="default" onClick={() => setActiveStep(1)}>
                    Back
                  </Button>
                  <Button color="green" size="lg" leftSection={<IconCheck size={20} />}>
                    Import 847 Leads
                  </Button>
                </Group>
              </Stack>
            </Card>
          </Stepper.Step>

          <Stepper.Completed>
            <Card withBorder radius="md" p="xl" mt="md">
              <Stack align="center" gap="xl">
                <ThemeIcon size={80} radius="md" color="green" variant="light">
                  <IconCheck size={40} />
                </ThemeIcon>
                <div style={{ textAlign: 'center' }}>
                  <Text size="xl" fw={700} mb="xs">
                    Import Complete!
                  </Text>
                  <Text size="sm" c="dimmed">
                    Successfully imported 847 leads to your database
                  </Text>
                </div>
                <Group>
                  <Button variant="default" onClick={() => setImportMethod(null)}>
                    Import More
                  </Button>
                  <Button>View Leads</Button>
                </Group>
              </Stack>
            </Card>
          </Stepper.Completed>
        </Stepper>
      </Stack>
    )
  }

  if (importMethod === 'manual') {
    return (
      <Stack gap="lg" p="xl">
        <Group justify="space-between">
          <div>
            <Text size="xl" fw={700} mb="xs">
              Add Lead Manually
            </Text>
            <Text size="sm" c="dimmed">
              Enter lead information manually
            </Text>
          </div>
          <Button variant="subtle" onClick={() => setImportMethod(null)}>
            Back
          </Button>
        </Group>

        <Card withBorder radius="md" p="xl">
          <Text size="sm" c="dimmed" ta="center" py="xl">
            Manual lead form will be implemented here
          </Text>
        </Card>
      </Stack>
    )
  }

  if (importMethod === 'api') {
    return (
      <Stack gap="lg" p="xl">
        <Group justify="space-between">
          <div>
            <Text size="xl" fw={700} mb="xs">
              API Integration
            </Text>
            <Text size="sm" c="dimmed">
              Connect with your CRM or other tools
            </Text>
          </div>
          <Button variant="subtle" onClick={() => setImportMethod(null)}>
            Back
          </Button>
        </Group>

        <Card withBorder radius="md" p="xl">
          <Text size="sm" c="dimmed" ta="center" py="xl">
            API integration options will be implemented here
          </Text>
        </Card>
      </Stack>
    )
  }

  return null
}
