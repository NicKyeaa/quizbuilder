'use client';
import { useState } from 'react';
// Replaced the previous library with @nextui-org/react components
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Select,
  SelectItem,
} from '@nextui-org/react';

const initialQuestions = [
  {
    id: 1,
    title: 'What is the capital of France?',
    content: 'Choose the correct answer.',
    category: 'Category 1',
  },
  {
    id: 2,
    title: 'Who wrote Hamlet?',
    content: 'Select the author.',
    category: 'Category 2',
  },
];

// Define the categories in a separate array for clarity
const categoryItems = [
  { key: 'Category 1', label: 'Category 1' },
  { key: 'Category 2', label: 'Category 2' },
];

export default function QuestionManagementPage() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    category: 'Category 1',
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  }

  // The onSelectionChange handler provides a Set of keys. This function correctly handles that.
  function handleCategoryChange(keys: Set<string>) {
    const selectedCategory = keys.values().next().value;
    if (selectedCategory) {
      setNewQuestion({ ...newQuestion, category: selectedCategory });
    }
  }

  function handleAddQuestion() {
    // Basic validation to prevent adding empty questions
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) {
      return;
    }

    setQuestions([
      ...questions,
      {
        id: Date.now(),
        ...newQuestion,
      },
    ]);
    // Reset the form after adding
    setNewQuestion({ title: '', content: '', category: 'Category 1' });
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Question Management</h1>
      <form
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          alignItems: 'flex-end',
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleAddQuestion();
        }}
      >
        <Input
          name='title'
          label='Question Title'
          placeholder='e.g., What is 2+2?'
          value={newQuestion.title}
          onChange={handleInputChange}
          required
        />
        <Input
          name='content'
          label='Question Content'
          placeholder='e.g., Choose the correct answer.'
          value={newQuestion.content}
          onChange={handleInputChange}
          required
        />
        <Select
          name='category'
          label='Category'
          selectedKeys={[newQuestion.category]}
          onSelectionChange={handleCategoryChange}
          items={categoryItems}
          required
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>
        <Button type='submit' color='primary'>
          Add Question
        </Button>
      </form>

      {/* Refactored the table to use NextUI's Table components for proper rendering */}
      <Table aria-label='Question management table'>
        <TableHeader>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>CONTENT</TableColumn>
          <TableColumn>CATEGORY</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody items={questions}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.content}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {/* NextUI uses `isDisabled` instead of `disabled` */}
                  <Button size='sm' variant='bordered' isDisabled>
                    Edit
                  </Button>
                  <Button size='sm' variant='flat' color='danger' isDisabled>
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>
  );
}
