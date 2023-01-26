import {
  Box,
  Button,
  Group,
  ScrollArea,
  Stack,
  Text,
  Progress,
  Textarea,
  LoadingOverlay,
  Select,
  Center,
  Divider,
} from "@mantine/core";
import { useState, useRef, useEffect } from "react";

import { useInputState } from "@mantine/hooks";

const MAX_TOKEN = 100;
const modelMax = {
  "text-davinci-003": 4000,
  "text-curie-001": 2048,
  "text-babbage-001": 2048,
  "text-ada-001": 2048,
};

const ConvoMessage = ({ props }) => {
  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        padding: "5px 20px",
        borderRadius: "5px",
        whiteSpace: "normal",
      }}
    >
      <Stack spacing={5}>
        <Text fw={700} color="gray.8" style={{ width: "80%" }}>
          {props.name}
        </Text>

        <Text color="gray.8">{props.mess}</Text>
      </Stack>
    </div>
  );
};

function App() {
  const viewport = useRef(null);
  const scrollToBottom = () =>
    viewport.current.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "smooth",
    });

  const [prompts, setPrompts] = useState("");
  const [usage, setUsage] = useState({
    prompt_tokens: 0,
    completion_tokens: 0,
    total_tokens: 0,
  });
  const [model, setModel] = useState("text-davinci-003");
  const [responding, setResponding] = useState(false);
  const [input, setInput] = useInputState("");
  const [convo, setConvo] = useState([]);

  const inputToken = (100 * input.length) / 75;
  const isAllowed =
    modelMax[model] - usage["total_tokens"] >= inputToken + MAX_TOKEN;

  useEffect(() => {
    scrollToBottom();
  }, [convo]);

  useEffect(() => {
    setPrompts("");
    setUsage({ prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 });
    setConvo([]);
  }, [model]);

  const sendConvo = (name, mess) => {
    setConvo((c) => [...c, { name, mess }]);
  };

  const onSend = async () => {
    if (!input) return;
    if (!isAllowed) return;
    sendConvo("me", input);
    setInput("");
    getResponse(input);
  };

  const getResponse = (message) => {
    setResponding(true);

    const p = prompts + "\n" + message;

    fetch("http://localhost:3080/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: p, model }),
    })
      .then((res) => res.json())
      .then((d) => {
        sendConvo("Grug", d.message);
        setPrompts(d.prompt + d.message);
        setUsage(d.usage);
        setResponding(false);
      });
  };

  return (
    <div style={{ margin: "50px 100px" }}>
    <LoadingOverlay visible={responding} overlayBlur={2} />
      <Group position="apart" style={{ padding: "10px" }}>
        <Text fw={700} fz={22}>
          OpenAI API Test Project
        </Text>
        <Select
          label="Model"
          placeholder="select model"
          value={model}
          onChange={setModel}
          data={[
            { value: "text-davinci-003", label: "text-davinci-003" },
            { value: "text-curie-001", label: "text-curie-001" },
            { value: "text-babbage-001", label: "text-babbage-001" },
            { value: "text-ada-001", label: "text-ada-001" },
          ]}
        />
      </Group>
      <Stack>
        <ScrollArea style={{ height: 500}} viewportRef={viewport}>
          <Stack spacing={"md"} align={"stretch"}>
            {convo.length > 0 ? (
              convo.map((c, i) => <ConvoMessage key={i} props={c} />)
            ) : (
              <Center>
                <Text>Start Chatting</Text>
              </Center>
            )}
          </Stack>
        </ScrollArea>

        <Divider />
        <Group>
          <Text fw={500}>Prompt Tokens:</Text>
          <Text>{usage["prompt_tokens"]}</Text>
          <Text fw={500}>Completion Tokens:</Text>
          <Text>{usage["completion_tokens"]}</Text>
          <Text fw={500}>Total Tokens:</Text>
          <Text>{usage["total_tokens"]}</Text>
          <Text fw={500}>Max Tokens:</Text>
          <Text>{modelMax[model]}</Text>
        </Group>

        <Progress
          size="xs"
          value={(usage["total_tokens"] / modelMax[model]) * 100}
        />
        {!isAllowed ? (
          <Text fw={500} color={"red"}>
            Next Chat will Exceed Max Token
          </Text>
        ) : null}

        <Group position="center">
          <Text>{input.length}/200</Text>
          

          <Textarea
            maxLength="200"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSend();
              }
            }}
            value={input}
            style={{ width: "80%" }}
            label="Chat"
            minRows={3}
            onChange={setInput}
          />
          <Button disabled={!isAllowed} onClick={onSend}>
            Send
          </Button>
        </Group>
      </Stack>
    </div>
  );
}

export default App;
