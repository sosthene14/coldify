import { useState, useEffect } from "react";
import {
  Modal,
  Stack,
  Group,
  Text,
  Loader,
  Card,
  Badge,
} from "@mantine/core";
import {
  IconX,
  IconEye,
  IconCalendar,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconBrowser,
} from "@tabler/icons-react";
import { emailTrackingService, type OpenDetail } from "../../services/email-tracking.service";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type React from "react";
import { UAParser } from "ua-parser-js";

interface EmailOpenDetailsModalProps {
  emailHistoryId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function EmailOpenDetailsModal({
  emailHistoryId,
  isOpen,
  onClose,
}: EmailOpenDetailsModalProps) {
  const [openDetails, setOpenDetails] = useState<OpenDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && emailHistoryId) {
      loadOpenDetails();
    }
  }, [isOpen, emailHistoryId]);

  const loadOpenDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const details = await emailTrackingService.getOpenDetails(emailHistoryId);
      setOpenDetails(details);
    } catch (err) {
      console.error("Failed to load open details:", err);
      setError("Impossible de charger les détails des ouvertures");
    } finally {
      setLoading(false);
    }
  };

  // Parse user agent to extract browser/device info using ua-parser-js
  const parseUserAgent = (userAgent?: string): { icon: React.ReactNode; label: string } => {
    if (!userAgent) {
      return { icon: <IconDeviceDesktop size={16} color="#868E96" />, label: "Inconnu" };
    }

    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    // Determine device type and icon
    let icon: React.ReactNode;
    let deviceType: string;

    if (result.device.type === 'mobile') {
      icon = <IconDeviceMobile size={16} color="#868E96" />;
      deviceType = 'Mobile';
    } else if (result.device.type === 'tablet') {
      icon = <IconDeviceTablet size={16} color="#868E96" />;
      deviceType = 'Tablette';
    } else {
      icon = <IconBrowser size={16} color="#868E96" />;
      deviceType = 'Desktop';
    }

    // Build label with browser and OS info
    const browserName = result.browser.name || 'Navigateur';
    const osName = result.os.name || deviceType;
    const label = `${browserName} sur ${osName}`;

    return { icon, label };
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconEye size={20} />
          <Text fw={600}>Détails des ouvertures</Text>
        </Group>
      }
      size="lg"
    >
      <Stack gap="md">
        {loading ? (
          <Group justify="center" py="xl">
            <Loader size="sm" />
          </Group>
        ) : error ? (
          <Text c="red" ta="center" py="xl">
            {error}
          </Text>
        ) : openDetails.length === 0 ? (
          <Stack align="center" gap="md" py="xl">
            <IconEye size={48} color="#868E96" />
            <Text c="dimmed">Aucune ouverture enregistrée</Text>
          </Stack>
        ) : (
          <Stack gap="xs">
            {openDetails.map((detail, index) => {
              const deviceInfo = parseUserAgent(detail.userAgent);
              
              return (
                <Card
                  key={detail.id}
                  withBorder
                  p="md"
                  radius="md"
                >
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="sm" fw={600}>
                        Ouverture #{openDetails.length - index}
                      </Text>
                      <Badge size="sm" variant="light">
                        {detail.recipient}
                      </Badge>
                    </Group>

                    <Group gap="md">
                      <Group gap="xs">
                        <IconCalendar size={16} color="#868E96" />
                        <Text size="sm" c="dimmed">
                          {format(
                            new Date(detail.openedAt),
                            "dd MMM yyyy 'à' HH:mm",
                            { locale: fr }
                          )}
                        </Text>
                      </Group>

                      <Group gap="xs">
                        {deviceInfo.icon}
                        <Text size="sm" c="dimmed">
                          {deviceInfo.label}
                        </Text>
                      </Group>
                    </Group>
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        )}

        {openDetails.length > 0 && (
          <Text size="sm" c="dimmed" ta="center" mt="md">
            Total: {openDetails.length} ouverture
            {openDetails.length > 1 ? "s" : ""}
          </Text>
        )}
      </Stack>
    </Modal>
  );
}
