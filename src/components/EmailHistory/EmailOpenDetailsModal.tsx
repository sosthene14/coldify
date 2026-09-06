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
import { useTranslation } from 'react-i18next'
import {
  IconEye,
  IconCalendar,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconBrowser,
} from "@tabler/icons-react";
import { emailTrackingService, type OpenDetail } from "../../services/email-tracking.service";
import { format } from "date-fns";
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
  const { t } = useTranslation()
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
      setError(t('error_sending_email'));
    } finally {
      setLoading(false);
    }
  };

  // Parse user agent to extract browser/device info using ua-parser-js
  const parseUserAgent = (userAgent?: string): { icon: React.ReactNode; label: string } => {
    if (!userAgent) {
      return { icon: <IconDeviceDesktop size={16} color="#868E96" />, label: t('unknown') };
    }

    const normalizedUserAgent = userAgent.toLowerCase()
    if (normalizedUserAgent.includes('googleimageproxy') || normalizedUserAgent.includes('ggpht.com')) {
      return {
        icon: <IconBrowser size={16} color="#868E96" />,
        label: t('gmail_image_proxy'),
      }
    }

    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    // Determine device type and icon
    let icon: React.ReactNode;
    let deviceType: string;

    if (result.device.type === 'mobile') {
      icon = <IconDeviceMobile size={16} color="#868E96" />;
      deviceType = t('mobile');
    } else if (result.device.type === 'tablet') {
      icon = <IconDeviceTablet size={16} color="#868E96" />;
      deviceType = t('tablet');
    } else {
      icon = <IconBrowser size={16} color="#868E96" />;
      deviceType = t('desktop');
    }

    // Build label with browser and OS info
    const browserName = result.browser.name || t('browser');
    const osName = result.os.name || deviceType;
    const label = `${browserName} ${t('on')} ${osName}`;

    return { icon, label };
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconEye size={20} />
          <Text fw={600}>{t('open_details')}</Text>
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
            <Text c="dimmed">{t('no_opens_recorded')}</Text>
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
                        {t('open_number', { count: openDetails.length - index })}
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
                            "dd MMM yyyy 'à' HH:mm"
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
            {t('total_openings', { count: openDetails.length })}
          </Text>
        )}
      </Stack>
    </Modal>
  );
}