'use client';
import { useState } from 'react';
import { Button, Input, Select, Table } from '@heroui/react';

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

  function handleCategoryChange(keys: any) {
    let key;
    if (Array.isArray(keys)) {
      key = keys[0];
    } else if (typeof keys === 'string' || typeof keys === 'number') {
      key = keys;
    } else if (typeof keys === 'symbol' || keys === undefined) {
      return;
    } else {
      const arr = Array.from(keys);
      if (!arr.length) return;
      key = arr[0];
      if (typeof key === 'symbol' || key === undefined) return;
    }
    if (typeof key === 'symbol' || key === undefined) return;
    setNewQuestion({ ...newQuestion, category: String(key) });
  }

  function handleAddQuestion() {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        ...newQuestion,
      },
    ]);
    setNewQuestion({ title: '', content: '', category: 'Category 1' });
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Question Management</h1>
      <form
        style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}
        onSubmit={(e) => {
          e.preventDefault();
          handleAddQuestion();
        }}
      >
        <Input
          name='title'
          placeholder='Question Title'
          value={newQuestion.title}
          onChange={handleInputChange}
          required
        />
        <Input
          name='content'
          placeholder='Question Content'
          value={newQuestion.content}
          onChange={handleInputChange}
          required
        />
        <Select
          name='category'
          selectedKeys={[newQuestion.category]}
          onSelectionChange={handleCategoryChange}
          items={[
            { key: 'Category 1', label: 'Category 1' },
            { key: 'Category 2', label: 'Category 2' },
          ]}
          label='Category'
          required
        >
          {(item) => <>{item.label}</>}
        </Select>
        <Button type='submit'>Add Question</Button>
      </form>

      <Table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id}>
              <td>{q.title}</td>
              <td>{q.content}</td>
              <td>{q.category}</td>
              <td>
                <Button size='sm' variant='bordered' disabled>
                  Edit
                </Button>
                <Button size='sm' variant='flat' color='danger' disabled>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </main>
  );
}
