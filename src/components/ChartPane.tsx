import { LineChart } from "@mantine/charts";
import { Button, Chip, Group, type MantineColor, ScrollArea, Slider, Space, Stack, Switch, Text } from "@mantine/core";
import { basename } from "@tauri-apps/api/path";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { useEffect, useState } from "react";
import type { Stats } from "../schema";

const colors: MantineColor[] = [
  "blue",
  "red",
  "green",
  "yellow",
  "cyan",
  "pink",
  "lime",
  "orange",
  "indigo",
  "grape",
  "teal",
  "violet",
  "gray",
];

interface ChartPaneProps {
  data: { comparison: string; stats: Stats }[];
  onBack: () => void;
}

type FrameData = {
  frameNum: number;
  [key: string]: number;
};

export const ChartPane = ({ data, onBack }: ChartPaneProps) => {
  const [dataToPlot, setDataToPlot] = useState<FrameData[]>([]);
  const [comparisonBasenames, setComparisonBasenames] = useState<string[] | null>(null);
  const [selectedComparisons, setSelectedComparisons] = useState<string[]>([]);
  const [xScaleFactor, setXScaleFactor] = useState(0);
  const [yAxisAutoScale, setYAxisAutoScale] = useState(false);

  const minVmaf = data.reduce((acc, item) => {
    const min = item.stats.frames.reduce((acc, frame) => {
      return Math.min(acc, frame.metrics.vmaf);
    }, Number.POSITIVE_INFINITY);
    return Math.min(acc, min);
  }, Number.POSITIVE_INFINITY);

  useEffect(() => {
    const comparisons = data.map((d) => d.comparison);
    const promises = comparisons.map((comparison) => basename(comparison));
    Promise.all(promises).then((basenames) => {
      setComparisonBasenames(basenames);

      const elements = data.map((d) => {
        return {
          comparison: d.comparison,
          vmaf: d.stats.frames.map((frame) => {
            return frame.metrics.vmaf;
          }),
        };
      });
      const dataToPlot: FrameData[] = [];
      for (let i = 0; i < elements[0].vmaf.length; i++) {
        const obj: FrameData = { frameNum: i };
        for (const item of elements) {
          obj[item.comparison] = item.vmaf[i];
        }
        dataToPlot.push(obj);
      }
      setDataToPlot(dataToPlot);
    });
  }, [data]);

  // Enable all comparisons by default
  useEffect(() => {
    const comparisons = data.map((d) => d.comparison);
    setSelectedComparisons(comparisons);
  }, [data]);

  if (!comparisonBasenames) {
    return null;
  }

  return (
    <Stack h="100%">
      <Group>
        <Chip.Group multiple value={selectedComparisons} onChange={setSelectedComparisons}>
          {data.map((d, index) => {
            const basename = comparisonBasenames[index];
            return (
              <Chip key={d.comparison} color={colors[index % colors.length]} variant="filled" value={d.comparison}>
                {basename}
              </Chip>
            );
          })}
        </Chip.Group>
      </Group>
      <ScrollArea scrollbars="x" offsetScrollbars type={xScaleFactor === 0 ? "never" : "always"} bg="gray.1" p="md">
        <LineChart
          w={`${100 * 2 ** xScaleFactor}%`}
          h={768}
          data={dataToPlot}
          dataKey="frameNum"
          series={data
            .map((item, index) => {
              return { name: item.comparison, color: colors[index % colors.length] };
            })
            .filter((item) => selectedComparisons.includes(item.name))}
          curveType="linear"
          withDots={false}
          xAxisLabel="フレーム番号"
          yAxisLabel="VMAF"
          xAxisProps={{ padding: { left: 12, right: 12 } }}
          yAxisProps={{ domain: [yAxisAutoScale ? Math.floor(minVmaf / 10) * 10 : 0, 100] }}
          strokeWidth={1}
        />
      </ScrollArea>

      <Group align="flex-end">
        <Stack gap={0}>
          <Text size="sm">X軸スケール</Text>
          <Slider
            w={240}
            value={xScaleFactor}
            onChange={setXScaleFactor}
            min={0}
            max={10}
            step={1}
            label={`${100 * 2 ** xScaleFactor}%`}
            marks={[
              { value: 0 },
              { value: 1 },
              { value: 2 },
              { value: 3 },
              { value: 4 },
              { value: 5 },
              { value: 6 },
              { value: 7 },
              { value: 8 },
              { value: 9 },
              { value: 10 },
            ]}
          />
        </Stack>

        <Switch
          label="Y軸オートスケール"
          checked={yAxisAutoScale}
          onChange={(event) => {
            setYAxisAutoScale(event.currentTarget.checked);
          }}
        />
        <Space flex={1} />
        <Button
          onClick={async () => {
            const filePath = await save({
              canCreateDirectories: true,
              filters: [{ name: "JSON", extensions: ["json"] }],
            });
            if (!filePath) {
              return;
            }
            console.log(filePath);
            await writeTextFile(filePath, JSON.stringify(data));
          }}
        >
          保存
        </Button>
        <Button variant="default" onClick={onBack}>
          戻る
        </Button>
      </Group>
    </Stack>
  );
};
