import { Stack } from "@mantine/core";
import { useState } from "react";
import { ChartPane } from "./components/ChartPane";
import { FilePane } from "./components/FilePane";
import type { Stats } from "./schema";

export const App = () => {
  const [pane, setPane] = useState<"filePane" | "chartPane">("filePane");
  const [reference, setReference] = useState<string | null>(null);
  const [comparisons, setComparisons] = useState<string[] | null>(null);
  const [analyzeResults, setAnalyzeResults] = useState<{ comparison: string; stats: Stats }[] | null>(null);

  const handleReferenceDrop = (file: string | null) => {
    setReference(file);
  };

  const handleComparisonsDrop = (files: string[] | null) => {
    setComparisons(files);
  };

  const handleAnalyzeComplete = (results: { comparison: string; stats: Stats }[]) => {
    setAnalyzeResults(results);
    setPane("chartPane");
  };

  const handleBack = () => {
    setReference(null);
    setComparisons(null);
    setAnalyzeResults(null);
    setPane("filePane");
  };

  return (
    <Stack h="100vh" p="lg">
      {pane === "filePane" && (
        <FilePane
          reference={reference}
          comparisons={comparisons}
          onReferenceDrop={handleReferenceDrop}
          onComparisonsDrop={handleComparisonsDrop}
          onAnalyzeComplete={handleAnalyzeComplete}
        />
      )}

      {pane === "chartPane" && <ChartPane data={analyzeResults || []} onBack={handleBack} />}
    </Stack>
  );
};
