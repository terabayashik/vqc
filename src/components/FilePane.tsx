import { Box, Button, Center, Divider, Group, Loader, LoadingOverlay, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { basename } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/plugin-dialog";
import { useEffect, useState } from "react";
import { analyze } from "../ffmpeg";
import type { Stats } from "../schema";

interface FilePaneProps {
  reference: string | null;
  comparisons: string[] | null;
  onReferenceDrop: (file: string | null) => void;
  onComparisonsDrop: (files: string[] | null) => void;
  onAnalyzeComplete: (results: { comparison: string; stats: Stats }[]) => void;
}

export const FilePane = ({
  reference,
  comparisons,
  onReferenceDrop,
  onComparisonsDrop,
  onAnalyzeComplete,
}: FilePaneProps) => {
  const [referenceBasename, setReferenceBasename] = useState<string | null>(null);
  const [comparisonBasenames, setComparisonBasenames] = useState<string[] | null>(null);
  const [visible, { open: enableOverlay, close: disableOverlay }] = useDisclosure(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reference) {
      basename(reference).then((basename) => setReferenceBasename(basename));
    }
  }, [reference]);

  useEffect(() => {
    if (comparisons) {
      const promises = comparisons.map((comparison) => basename(comparison));
      Promise.all(promises).then(setComparisonBasenames);
    }
  }, [comparisons]);

  return (
    <Stack h="100%">
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ blur: 4 }}
        loaderProps={{
          children: (
            <Stack align="center">
              <Loader color="blue" size="xl" type="bars" />
              <Stack gap={0} align="center">
                <Text size="xl">解析中...</Text>
                <Text size="xl">
                  {progress} / {comparisons?.length}
                </Text>
              </Stack>
            </Stack>
          ),
        }}
      />
      <Group h="100%" justify="center">
        <Center flex={1} p="md">
          <Stack w="100%">
            <Group justify="space-between">
              <Title order={2}>リファレンス</Title>
              <Button
                variant="default"
                onClick={async () => {
                  const selected = await open({
                    multiple: false,
                  });
                  onReferenceDrop(selected);
                }}
              >
                選択
              </Button>
            </Group>
            {reference && (
              <Box bg="gray.2" p="xs" style={{ borderRadius: "4px" }}>
                <Text>{referenceBasename}</Text>
              </Box>
            )}
          </Stack>
        </Center>

        <Divider orientation="vertical" />

        <Center flex={1} p="md">
          <Stack w="100%">
            <Group justify="space-between">
              <Title order={2}>比較対象(複数選択可)</Title>
              <Button
                variant="default"
                onClick={async () => {
                  const selected = await open({
                    multiple: true,
                  });
                  onComparisonsDrop(selected);
                }}
              >
                選択
              </Button>
            </Group>
            {comparisons && (
              <Stack gap={4} bg="gray.2" p="xs" style={{ borderRadius: "4px" }}>
                {comparisonBasenames?.map((comparisonBaseName, index) => (
                  <Text key={`${index}-${comparisonBaseName}`}>{comparisonBaseName}</Text>
                ))}
              </Stack>
            )}
          </Stack>
        </Center>
      </Group>
      <Group justify="flex-end">
        <Button
          variant="gradient"
          disabled={!reference || comparisons === null}
          onClick={async () => {
            if (!reference || comparisons === null) {
              return;
            }

            enableOverlay();
            const results: { comparison: string; stats: Stats }[] = [];
            for (const comparison of comparisons) {
              const stats = await analyze(reference, comparison);
              results.push({ comparison, stats });
              setProgress(progress + 1);
            }
            disableOverlay();
            onAnalyzeComplete(results);
          }}
        >
          解析開始
        </Button>
      </Group>
    </Stack>
  );
};
