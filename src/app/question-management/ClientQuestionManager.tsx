'use client';
import React, { useMemo, useState } from 'react';
import { Button, Input, Card, Badge, Select, SelectItem } from '@heroui/react';

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
  const [showDeleteId, setShowDeleteId] = useState<number | null>(null);
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
            className='w-40'
          />
          <Select
            items={[{ key: 'all', label: 'All Categories' }, ...categories]}
            selectedKeys={new Set([filterCategory])}
            onSelectionChange={(keys) => {
              const key = Array.isArray(keys) ? keys[0] : keys;
              setFilterCategory(String(key));
            }}
            className='w-40'
          >
            {[{ key: 'all', label: 'All Categories' }, ...categories].map(
              (item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              )
            )}
          </Select>
          <Button onClick={openNewModal} className='ml-2'>
            Add Question
          </Button>
        </div>
      </div>

      <Card className='p-4'>
        {filtered.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12'>
            <div className='text-lg text-gray-500 mb-4'>
              No questions found.
            </div>
            <Button onClick={openNewModal}>Add your first question</Button>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse text-sm'>
              <thead>
                <tr className='bg-gray-50'>
                  <th className='text-left border-b px-4 py-3'>Title</th>
                  <th className='text-left border-b px-4 py-3'>Content</th>
                  <th className='text-left border-b px-4 py-3'>Category</th>
                  <th className='text-left border-b px-4 py-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => (
                  <tr key={q.id} className='hover:bg-gray-100 transition'>
                    <td className='px-4 py-3 border-b'>{q.title}</td>
                    <td className='px-4 py-3 border-b'>{q.content}</td>
                    <td className='px-4 py-3 border-b'>{q.category}</td>
                    <td className='px-4 py-3 border-b'>
                      <div className='flex gap-2'>
                        <Button
                          size='sm'
                          variant='bordered'
                          onClick={() => openEditModal(q.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          size='sm'
                          variant='flat'
                          color='danger'
                          onClick={() => setShowDeleteId(q.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {isModalOpen && (
        <div
          className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'
          onClick={() => setIsModalOpen(false)}
        >
          <Card
            className='max-w-lg mx-auto p-6'
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className='text-xl font-semibold mb-4'>
              {editingId ? 'Edit Question' : 'New Question'}
            </h2>
            <div className='grid gap-4'>
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
              <Select
                items={categories}
                selectedKeys={new Set([newQuestion.category])}
                onSelectionChange={(keys) => {
                  const key = Array.isArray(keys) ? keys[0] : keys;
                  setNewQuestion({ ...newQuestion, category: String(key) });
                }}
                className='w-full'
              >
                {categories.map((item) => (
                  <SelectItem key={item.key}>{item.label}</SelectItem>
                ))}
              </Select>
            </div>
            <div className='flex gap-2 justify-end mt-6'>
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
          </Card>
        </div>
      )}
      {showDeleteId && (
        <div
          className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'
          onClick={() => setShowDeleteId(null)}
        >
          <Card
            className='max-w-md mx-auto p-6'
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className='text-lg font-semibold mb-4'>Delete Question?</h2>
            <p className='mb-6'>
              Are you sure you want to delete this question? This action cannot
              be undone.
            </p>
            <div className='flex gap-2 justify-end'>
              <Button variant='flat' onClick={() => setShowDeleteId(null)}>
                Cancel
              </Button>
              <Button
                color='danger'
                onClick={() => {
                  setQuestions(questions.filter((x) => x.id !== showDeleteId));
                  setShowDeleteId(null);
                }}
              >
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}
