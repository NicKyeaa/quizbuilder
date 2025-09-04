'use client';
import React, { useState } from 'react';
import { Button, Input } from '@heroui/react';

type Question = {
  id: number;
  title: string;
  content: string;
  category: string;
};

const initialQuestions: Question[] = [
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

const categories = [
  { key: 'Category 1', label: 'Category 1' },
  { key: 'Category 2', label: 'Category 2' },
];

export default function ClientQuestionManager() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    category: 'Category 1',
  });

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  }

  // (Select replaced with native select; no special handler needed)

  function handleAddQuestion() {
    setQuestions([...questions, { id: Date.now(), ...newQuestion }]);
    setNewQuestion({ title: '', content: '', category: 'Category 1' });
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Question Management (HeroUI)</h1>
      <form
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          alignItems: 'center',
        }}
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

        {/* Use HeroUI Select with defensive handler */}
        <select
          name='category'
          value={newQuestion.category}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, category: e.target.value })
          }
          required
          style={{ padding: '0.5rem', borderRadius: 4 }}
        >
          {categories.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>

        <Button type='submit'>Add Question</Button>
      </form>

      {/* Use native table here to avoid HeroUI Table SSR/structure issues */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: 'left',
                borderBottom: '1px solid #ddd',
                padding: '8px',
              }}
            >
              Title
            </th>
            <th
              style={{
                textAlign: 'left',
                borderBottom: '1px solid #ddd',
                padding: '8px',
              }}
            >
              Content
            </th>
            <th
              style={{
                textAlign: 'left',
                borderBottom: '1px solid #ddd',
                padding: '8px',
              }}
            >
              Category
            </th>
            <th
              style={{
                textAlign: 'left',
                borderBottom: '1px solid #ddd',
                padding: '8px',
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id}>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                {q.title}
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                {q.content}
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                {q.category}
              </td>
              <td
                style={{
                  padding: '8px',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  gap: '0.5rem',
                }}
              >
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
      </table>
    </main>
  );
}
