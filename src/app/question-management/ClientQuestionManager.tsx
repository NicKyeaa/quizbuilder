'use client';
import React, { useMemo, useState } from 'react';
import { Button, Input, Card, Badge, Select, SelectItem } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';

type Question = {
  id: number;
  title: string;
  content: string;
  category: string;
  type: string;
  answers?: string[]; // For ABCD type questions (A, B, C, D)
  answer?: string; // For other question types
};

const initialQuestions: Question[] = [
  {
    id: 1,
    title: 'What is the capital of France?',
    content: 'Choose the correct answer.',
    category: 'Category 1',
    type: 'ABCD type',
    answers: ['Paris', 'London', 'Berlin', 'Madrid'],
  },
  {
    id: 2,
    title: 'Who wrote Hamlet?',
    content: 'Select the author.',
    category: 'Category 2',
    type: 'ABCD type',
    answers: ['Shakespeare', 'Dickens', 'Austen', 'Hemingway'],
  },
];

const categories = [
  { key: 'Povijest', label: 'Povijest' },
  { key: 'Geografija', label: 'Geografija' },
  { key: 'Matematika', label: 'Matematika' },
  { key: 'Priroda', label: 'Priroda' },
  { key: 'Sport', label: 'Sport' },
  { key: 'Zabava', label: 'Zabava' },
  { key: 'Umjetnost', label: 'Umjetnost' },
  { key: 'Glazba', label: 'Glazba' },
  { key: 'Znanost', label: 'Znanost' },
  { key: 'Tehnologija', label: 'Tehnologija' },
  { key: 'Literatura', label: 'Literatura' },
  { key: 'Film', label: 'Film' },
];

const questionTypes = [
  { key: 'ABCD type', label: 'ABCD type' },
  { key: 'asocijacija', label: 'asocijacija' },
  { key: 'slikovna', label: 'slikovna' },
  { key: 'pitanje otvorenog odgovora', label: 'pitanje otvorenog odgovora' },
];

export default function ClientQuestionManager() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    category: 'Category 1',
    type: 'ABCD type',
    answers: ['', '', '', ''], // A, B, C, D for ABCD type
    answer: '', // For other question types
  });
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | 'all'>('all');
  const [filterType, setFilterType] = useState<string | 'all'>('all');
  const [showDeleteId, setShowDeleteId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // inputs are wired inline via setNewQuestion

  // (Select replaced with native select; no special handler needed)

  function handleAddQuestion() {
    // Validate all fields are filled
    if (
      !newQuestion.title.trim() ||
      !newQuestion.content.trim() ||
      !newQuestion.category ||
      !newQuestion.type
    ) {
      alert(
        'All fields are required. Please fill in all fields before saving.'
      );
      return;
    }

    // Validate answer fields based on question type
    if (newQuestion.type === 'ABCD type') {
      if (
        !newQuestion.answers ||
        newQuestion.answers.some((answer) => !answer.trim())
      ) {
        alert(
          'All 4 answer options (A, B, C, D) are required for ABCD type questions.'
        );
        return;
      }
    } else {
      if (!newQuestion.answer || !newQuestion.answer.trim()) {
        alert('Answer is required for this question type.');
        return;
      }
    }

    if (editingId) {
      setQuestions(
        questions.map((q) =>
          q.id === editingId ? { ...q, ...newQuestion } : q
        )
      );
    } else {
      setQuestions([...questions, { id: Date.now(), ...newQuestion }]);
    }
    setNewQuestion({
      title: '',
      content: '',
      category: 'Category 1',
      type: 'ABCD type',
      answers: ['', '', '', ''],
      answer: '',
    });
    setIsModalOpen(false);
    setEditingId(null);
  }

  function openNewModal() {
    setEditingId(null);
    setNewQuestion({
      title: '',
      content: '',
      category: 'Category 1',
      type: 'ABCD type',
      answers: ['', '', '', ''],
      answer: '',
    });
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
      type: q.type,
      answers: q.answers || ['', '', '', ''],
      answer: q.answer || '',
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
      const matchesType = filterType === 'all' || q.type === filterType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [questions, search, filterCategory, filterType]);

  // Function to highlight search terms
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'gi'
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          style={{
            backgroundColor: 'rgb(196, 181, 253)',
            color: '#1f2937',
            padding: '0.125rem 0.25rem',
            borderRadius: '0.125rem',
            fontWeight: '500',
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

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
              const selectedValue = Array.from(keys)[0];
              setFilterCategory(String(selectedValue));
            }}
            className='w-40'
          >
            {[{ key: 'all', label: 'All Categories' }, ...categories].map(
              (item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              )
            )}
          </Select>
          <Select
            items={[{ key: 'all', label: 'All Types' }, ...questionTypes]}
            selectedKeys={new Set([filterType])}
            onSelectionChange={(keys) => {
              const selectedValue = Array.from(keys)[0];
              setFilterType(String(selectedValue));
            }}
            className='w-40'
          >
            {[{ key: 'all', label: 'All Types' }, ...questionTypes].map(
              (item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              )
            )}
          </Select>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={openNewModal} className='ml-2'>
              Add Question
            </Button>
          </motion.div>
        </div>
      </div>

      <Card className='p-4'>
        {filtered.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12'>
            <div className='text-lg text-gray-500 mb-4'>
              No questions found.
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={openNewModal}>Add your first question</Button>
            </motion.div>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse text-sm'>
              <thead>
                <tr className='bg-gray-50'>
                  <th className='text-left border-b px-4 py-3'>Title</th>
                  <th className='text-left border-b px-4 py-3'>Content</th>
                  <th className='text-left border-b px-4 py-3'>Category</th>
                  <th className='text-left border-b px-4 py-3'>Type</th>
                  <th className='text-left border-b px-4 py-3'>Answer</th>
                  <th className='text-left border-b px-4 py-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => (
                  <tr key={q.id} className='hover:bg-gray-100 transition'>
                    <td className='px-4 py-3 border-b'>
                      {highlightText(q.title, search)}
                    </td>
                    <td className='px-4 py-3 border-b'>
                      {highlightText(q.content, search)}
                    </td>
                    <td className='px-4 py-3 border-b'>{q.category}</td>
                    <td className='px-4 py-3 border-b'>{q.type}</td>
                    <td className='px-4 py-3 border-b'>
                      {q.type === 'ABCD type'
                        ? q.answers?.map((answer, index) => (
                            <div key={index} className='text-xs'>
                              {String.fromCharCode(65 + index)}: {answer}
                            </div>
                          ))
                        : q.answer}
                    </td>
                    <td className='px-4 py-3 border-b'>
                      <div className='flex gap-2'>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            size='sm'
                            variant='bordered'
                            onClick={() => openEditModal(q.id)}
                          >
                            Edit
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            size='sm'
                            variant='flat'
                            color='danger'
                            onClick={() => setShowDeleteId(q.id)}
                          >
                            Delete
                          </Button>
                        </motion.div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
                duration: 0.3,
              }}
              className='max-w-3xl mx-auto'
              onClick={(e) => e.stopPropagation()}
            >
              <Card className='p-6 w-full'>
                <div onClick={(e) => e.stopPropagation()}>
                  <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className='text-xl font-semibold mb-4'
                  >
                    {editingId ? 'Edit Question' : 'New Question'}
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className='grid gap-4'
                  >
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
                      isRequired
                      label='Title *'
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
                      isRequired
                      label='Content *'
                    />
                    <Select
                      items={categories}
                      selectedKeys={new Set([newQuestion.category])}
                      onSelectionChange={(keys) => {
                        const selectedValue = Array.from(keys)[0];
                        setNewQuestion({
                          ...newQuestion,
                          category: String(selectedValue),
                        });
                      }}
                      className='w-full'
                      isRequired
                      label='Category *'
                    >
                      {categories.map((item) => (
                        <SelectItem key={item.key}>{item.label}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      items={questionTypes}
                      selectedKeys={new Set([newQuestion.type])}
                      onSelectionChange={(keys) => {
                        const selectedValue = Array.from(keys)[0];
                        setNewQuestion({
                          ...newQuestion,
                          type: String(selectedValue),
                        });
                      }}
                      className='w-full'
                      isRequired
                      label='Type *'
                    >
                      {questionTypes.map((item) => (
                        <SelectItem key={item.key}>{item.label}</SelectItem>
                      ))}
                    </Select>
                    {newQuestion.type === 'ABCD type' ? (
                      <div className='space-y-2'>
                        <h4 className='text-sm font-medium'>
                          Answer Options *
                        </h4>
                        {['A', 'B', 'C', 'D'].map((letter, index) => (
                          <Input
                            key={letter}
                            placeholder={`Option ${letter}`}
                            value={newQuestion.answers?.[index] || ''}
                            onChange={(e) =>
                              setNewQuestion({
                                ...newQuestion,
                                answers: newQuestion.answers?.map((ans, i) =>
                                  i === index
                                    ? (e.target as HTMLInputElement).value
                                    : ans
                                ) || ['', '', '', ''],
                              })
                            }
                            isRequired
                            label={`Option ${letter} *`}
                          />
                        ))}
                      </div>
                    ) : (
                      <Input
                        placeholder='Answer'
                        value={newQuestion.answer || ''}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            answer: (e.target as HTMLInputElement).value,
                          })
                        }
                        isRequired
                        label='Answer *'
                      />
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className='flex gap-2 justify-end mt-6'
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
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
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button onClick={handleAddQuestion}>
                        {editingId ? 'Save' : 'Add'}
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showDeleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'
            onClick={() => setShowDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
                duration: 0.3,
              }}
              className='max-w-lg mx-auto'
              onClick={(e) => e.stopPropagation()}
            >
              <Card className='p-6 w-full'>
                <div onClick={(e) => e.stopPropagation()}>
                  <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className='text-lg font-semibold mb-4'
                  >
                    Delete Question?
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className='mb-6'
                  >
                    Are you sure you want to delete this question? This action
                    cannot be undone.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className='flex gap-2 justify-end'
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant='flat'
                        onClick={() => setShowDeleteId(null)}
                      >
                        Cancel
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        color='danger'
                        onClick={() => {
                          setQuestions(
                            questions.filter((x) => x.id !== showDeleteId)
                          );
                          setShowDeleteId(null);
                        }}
                      >
                        Delete
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
