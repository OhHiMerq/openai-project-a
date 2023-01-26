
import {Box, Button, Group, ScrollArea, Stack, Text, Textarea} from '@mantine/core'
import { useState,useRef, useEffect,} from 'react';

import { useInputState } from '@mantine/hooks';

const ConvoMessage = ({props}) => {
  return <Box sx={(theme)=>({backgroundColor:theme.colors.gray[0],padding:"5px 20px",borderRadius: theme.radius.md})}> <Stack spacing={5}> 
  <Text fw={700} color="gray.8">{props.name}</Text>
  
  <Text color="gray.8">{props.mess}</Text>
  </Stack> </Box>
}

function App() {
  const viewport = useRef(null);
  const scrollToBottom = () =>
  viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });

 

  const [input,setInput] =useInputState('');
  const [convo,setConvo] = useState([])


  useEffect(()=>{
    scrollToBottom()
  },[convo])

  const sendConvo = (name,mess)=>{
    setConvo((c)=> [...c,{name,mess}])
  }

  const onSend = () => {
    if (!input) return
    sendConvo("me",input)
    setInput('')
  }
 
  return (
    <div style={{margin:"50px 100px"}}>
      <Group position='center' style={{padding:"10px"}}><Text fw={700} fz="xl" >Test Project</Text></Group>
      <Stack >
        <ScrollArea style={{  height: 400 }} viewportRef={viewport}>
        <Stack spacing={"md"}>
        {convo.map((c)=><ConvoMessage key={c.name} props={c}/>)}
        </Stack>
        </ScrollArea>
        <Group position='center'>
          <Textarea onKeyDown={(e)=>{if(e.key === 'Enter'){onSend()}}} value={input} style={{width:"80%"}} label="Chat" minRows={3} onChange={setInput}/>
          <Button onClick={onSend}>Send</Button>
        </Group>
      </Stack>
    </div>
  );
}

export default App;
