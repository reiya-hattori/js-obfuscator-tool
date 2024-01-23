import React, {useState, useEffect, ChangeEvent, MouseEvent} from 'react';
import {obfuscate} from 'javascript-obfuscator';
import {
  Box,
  Textarea,
  Text,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Radio,
  RadioGroup,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Checkbox,
  CheckboxGroup,
} from '@chakra-ui/react';
import './App.css';

type History = {
  input: string;
  output: string;
  method: string;
  isProtected: boolean;
};

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [type, setType] = useState<string>('obfuscator');
  const [histories, setHistories] = useState<History[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const savedHistories = localStorage.getItem('_histories');
    if (savedHistories) setHistories(JSON.parse(savedHistories));
  }, []);

  useEffect(() => {
    localStorage.setItem('_histories', JSON.stringify(histories));
  }, [histories]);

  const handleObfuscate = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (input.trim() === '') {
      return; // Do nothing if input is empty
    }
    try {
      let processedCode = '';
      if (type === 'minify') {
        processedCode = input.replace(/\s+/g, ''); // remove all whitespaces
      } else if (type === 'obfuscator') {
        processedCode = obfuscate(input).getObfuscatedCode();
      }
      setOutput(processedCode);

      setHistories((prevHistories) => {
        const newHistories = [
          {input, output: processedCode, method: type, isProtected: false},
          ...prevHistories,
        ];
        if (newHistories.length > 10) {
          newHistories.pop(); // remove the oldest item
        }
        return newHistories;
      });
      setShowAlert(true); // Show the alert
      setTimeout(() => {
        setShowAlert(false); // Hide the alert after 5 seconds
      }, 3000);
    } catch (error) {
      console.error('Error processing code:', error);
    }
  };

  const handleClearHistories = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const newHistories = histories.filter((history) => history.isProtected);
    setHistories(newHistories);
    localStorage.setItem('_histories', JSON.stringify(newHistories));
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleAllClear = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setInput('');
    setOutput('');
  };

  const handleClear = (index: number) => {
    if (histories[index].isProtected) {
      return; // Do not delete if the item is protected
    }
    const newHistories = histories.filter((_, i) => i !== index);
    setHistories(newHistories);
    localStorage.setItem('_histories', JSON.stringify(newHistories));
  };

  const handleCheckboxChange = (index: number) => {
    const newHistories = [...histories];
    newHistories[index].isProtected = !newHistories[index].isProtected;
    setHistories(newHistories);
    localStorage.setItem('_histories', JSON.stringify(newHistories));
  };

  const handleConversionAlert = () => {
    if (showAlert) {
      return (
        <Box position='fixed' inset='0'>
          <Alert status='success'>
            <AlertIcon />
            <AlertTitle>Successful conversion</AlertTitle>
            <AlertDescription>
              Please copy the code of 'OBFUSCATOR JAVASCRIPT CODE'.
            </AlertDescription>
          </Alert>
        </Box>
      );
    } else {
      // return (
      //   <Box position='fixed' inset='0'>
      //     <Alert status='warning'>
      //       <AlertIcon />
      //       <AlertTitle>Oops! Code not entered</AlertTitle>
      //       <AlertDescription>
      //         Please enter the code in the 'INPUT PLANE JAVASCRIPT CODE' area.
      //       </AlertDescription>
      //     </Alert>
      //   </Box>
      // );
    }
  };

  const handleTextareaClick = (
    event: React.MouseEvent<HTMLTextAreaElement>
  ) => {
    event.currentTarget.select();
  };

  return (
    <>
      <Box className='App'>
        {handleConversionAlert()}
        <Heading as='h1' size='md' mb='3.75vw' padding='1.25vw'>
          JavaScript Obfuscator Tool
        </Heading>
        <Box className='input-area' mb='5vw' textAlign='left' overflowX='auto'>
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>Input Plane JavaScript Code</Th>
                  <Th></Th>
                  <Th>Obfuscator JavaScript Code</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <Textarea
                      id='input'
                      cols={30}
                      rows={10}
                      value={input}
                      onChange={handleInputChange}
                      resize='vertical'
                      bg='white'
                      size='xs'
                    />
                  </Td>
                  <Td>
                    <RadioGroup onChange={setType} value={type}>
                      <Stack mb='2.5vw'>
                        <Radio value='minify'>Minify</Radio>
                        <Radio value='obfuscator'>Obfuscator</Radio>
                      </Stack>
                    </RadioGroup>
                    <Button
                      colorScheme='blue'
                      onClick={handleObfuscate}
                      mb='1.25vw'
                      display='block'
                    >
                      Conversion
                    </Button>
                    <Button colorScheme='gray' onClick={handleAllClear}>
                      Clear
                    </Button>
                  </Td>
                  <Td>
                    <Textarea
                      name='output'
                      id='output'
                      cols={30}
                      rows={10}
                      value={output}
                      isReadOnly={true}
                      resize='vertical'
                      bg='white'
                      size='xs'
                      onClick={handleTextareaClick}
                    />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        <Box className='histories-area' textAlign='left'>
          <Box
            pb='1.25vw'
            display='flex'
            justifyContent='space-between'
            alignItems='center'
          >
            <Heading as='h2' size='md' mr='1.25vw' display='inline-block'>
              History
            </Heading>
            <Button colorScheme='red' mr='24px' onClick={handleClearHistories}>
              Clear All History
            </Button>
          </Box>
          <TableContainer>
            <Table variant='striped' bg='WhiteAlpha.50'>
              <Thead>
                <Tr>
                  <Th>Index</Th>
                  <Th>Input Values</Th>
                  <Th>Obfuscator Values</Th>
                  <Th>Keep</Th>
                  <Th>Clear Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                {histories.map((history, index) => (
                  <Tr key={index}>
                    <Td>
                      <Text>{index + 1}</Text>
                      <Text>{history.method}</Text>
                    </Td>
                    <Td>
                      <Textarea
                        value={history.input}
                        size='xs'
                        isReadOnly
                        onClick={handleTextareaClick}
                      ></Textarea>
                    </Td>
                    <Td>
                      <Textarea
                        value={history.output}
                        size='xs'
                        isReadOnly
                        onClick={handleTextareaClick}
                      ></Textarea>
                    </Td>
                    <Td>
                      <Checkbox
                        isChecked={history.isProtected}
                        onChange={() => handleCheckboxChange(index)}
                      ></Checkbox>
                    </Td>
                    <Td textAlign='right'>
                      <Button
                        colorScheme={!history.isProtected ? 'red' : 'gray'}
                        isDisabled={history.isProtected}
                        onClick={() => handleClear(index)}
                      >
                        Clear
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default App;
