'use client';
import React, { useMemo, useState } from 'react';
import { Button, Input, Card, Divider, Badge } from '@heroui/react';

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
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // inputs are wired inline via setNewQuestion

  // (Select replaced with native select; no special handler needed)

  function handleAddQuestion() {
    if (editingId) {
      setQuestions(
        questions.map((q) =>
          q.id === editingId ? { ...q, ...newQuestion } : q
        )
      );
    } else {
      setQuestions([...questions, { id: Date.now(), ...newQuestion }]);
    }
    setNewQuestion({ title: '', content: '', category: 'Category 1' });
    setIsModalOpen(false);
    setEditingId(null);
  }

  function openNewModal() {
    setEditingId(null);
    setNewQuestion({ title: '', content: '', category: 'Category 1' });
    setIsModalOpen(true);
  }

  function openEditModal(id: number) {
    const q = questions.find((x) => x.id === id);
    if (!q) return;
    setEditingId(id);
    setNewQuestion({
      title: q.title,
      content: q.content,
      category: q.category,
    });
    setIsModalOpen(true);
  }

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch =
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.content.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        filterCategory === 'all' || q.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [questions, search, filterCategory]);

  return (
    <main style={{ padding: '2rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Question Management</h1>
          <div style={{ marginTop: 6 }}>
            <Badge color='primary'>{questions.length} questions</Badge>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input
            placeholder='Search questions...'
            value={search}
            onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ padding: 8, borderRadius: 6 }}
          >
            <option value='all'>All Categories</option>
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
          <Button onClick={openNewModal}>Add Question</Button>
        </div>
      </div>

      <Card>
        <div style={{ padding: 12 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 12 }}>Title</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 12 }}>Content</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 12 }}>Category</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 12 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => (
                  <tr key={q.id}>
                    <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{q.title}</td>
                    <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{q.content}</td>
                    <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{q.category}</td>
                    <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Button size='sm' variant='bordered' onClick={() => openEditModal(q.id)}>
                          Edit
                        </Button>
                        <Button size='sm' variant='flat' color='danger' onClick={() => setQuestions(questions.filter((x) => x.id !== q.id))}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <Divider />

      {/* Modal (simple overlay) */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              width: 640,
              background: 'white',
              borderRadius: 8,
              padding: 20,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0 }}>
              {editingId ? 'Edit Question' : 'New Question'}
            </h2>
            <div style={{ display: 'grid', gap: 8 }}>
              <Input
                name='title'
                placeholder='Title'
                value={newQuestion.title}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    title: (e.target as HTMLInputElement).value,
                  })
                }
              />
              <Input
                name='content'
                placeholder='Content'
                value={newQuestion.content}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    content: (e.target as HTMLInputElement).value,
                  })
                }
              />
              <select
                value={newQuestion.category}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, category: e.target.value })
                }
              >
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 8,
                justifyContent: 'flex-end',
                marginTop: 12,
              }}
            >
              <Button
                variant='flat'
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddQuestion}>
                {editingId ? 'Save' : 'Add'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
