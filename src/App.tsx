import { Button, Stack, Text, TextInput } from "@mantine/core";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

export const App = () => {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <Stack p={8}>
      <Text>Hello</Text>
      <Button onClick={greet}>Greet</Button>
      <Text>{greetMsg}</Text>
      <TextInput
        label="Input label"
        description="Input description"
        placeholder="Input placeholder"
        onChange={(event) => {
          setName(event.currentTarget.value);
        }}
      />
    </Stack>
  );
};
