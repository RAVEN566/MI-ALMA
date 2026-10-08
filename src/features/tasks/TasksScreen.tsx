import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  CheckSquare,
  Plus,
  CheckCircle2,
  Circle,
  Tag,
} from 'lucide-react';
import { db } from '@/db/database';
import type { TaskPriority, Task } from '@/types/db.types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Dialog } from '@/components/common/Dialog';
import { Input, Textarea } from '@/components/common/Input';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const TasksScreen: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('moonlight');
  const [tagsInput, setTagsInput] = useState('focus');
  const [formError, setFormError] = useState('');

  // Live queries
  const tasks = useLiveQuery(() => db.tasks.toArray());
  const taskHistory = useLiveQuery(() => db.taskHistory.toArray());

  if (!tasks) {
    return <LoadingSpinner label="Loading your celestial task scroll..." />;
  }

  // Apply search & filter
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = search.trim()
      ? t.title.toLowerCase().includes(search.toLowerCase()) || (t.tags?.some((tg) => tg.includes(search.toLowerCase())))
      : true;
    const statusMatch =
      filter === 'all' ? true : t.status === filter;
    return matchesSearch && statusMatch;
  });

  // Apply sort
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'date') {
      const aDate = a.dueDate ? parseISO(a.dueDate) : new Date(8640000000000000);
      const bDate = b.dueDate ? parseISO(b.dueDate) : new Date(8640000000000000);
      return aDate.getTime() - bDate.getTime();
    }
    // priority order: supernova > solar > moonlight > starlight
    const priorityOrder = { supernova: 4, solar: 3, moonlight: 2, starlight: 1 } as const;
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  // Section helpers
  const todayTasks = sortedTasks.filter((t) => t.dueDate && isToday(parseISO(t.dueDate)) && t.status !== 'completed');
  const upcomingTasks = sortedTasks.filter((t) => t.dueDate && isFuture(parseISO(t.dueDate)) && t.status !== 'completed');
  const overdueTasks = sortedTasks.filter((t) => t.dueDate && isPast(parseISO(t.dueDate)) && t.status !== 'completed');
  const completedTasks = sortedTasks.filter((t) => t.status === 'completed');

  const handleToggleTask = async (task: Task) => {
    const isNowCompleted = task.status !== 'completed';
    const now = new Date().toISOString();
    await db.transaction('rw', db.tasks, db.taskHistory, async () => {
      await db.tasks.update(task.id, {
        status: isNowCompleted ? 'completed' : 'pending',
        completedAt: isNowCompleted ? now : undefined,
        updatedAt: now,
      });
      await db.taskHistory.add({
        id: `hist-${Date.now()}`,
        taskId: task.id,
        action: isNowCompleted ? 'completed' : 'uncompleted',
        timestamp: now,
      });
    });
    // reward handling left for later step – no reward added here per request
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Task title is required');
      return;
    }
    const now = new Date().toISOString();
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      category: category || undefined,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      reminderAt: reminderAt || undefined,
      focusDurationMinutes: focusMinutes ? Number(focusMinutes) : undefined,
      notes: notes || undefined,
      priority,
      status: 'pending',
      tags,
      subtasks: [],
      actualMinutes: 0,
      createdAt: now,
      updatedAt: now,
    };
    await db.tasks.put(newTask);
    // reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setDueDate('');
    setDueTime('');
    setReminderAt('');
    setFocusMinutes('');
    setNotes('');
    setTagsInput('focus');
    setFormError('');
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-twilight-500/15">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Celestial Tasks & To-Dos
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Structure your rituals and work. Completing tasks rewards Stardust for Luna.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsCreateOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Task
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 glass-panel rounded-xl w-fit">
        {(['pending', 'all', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all min-h-[36px] ${
              filter === tab
                ? 'bg-twilight-600 text-white shadow-glow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Task List or Empty State */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="w-8 h-8 text-twilight-400" />}
          title={
            filter === 'completed'
              ? 'No Completed Tasks Yet'
              : 'Sanctuary is Clear'
          }
          description={
            filter === 'completed'
              ? 'Complete tasks to build your historical record and earn Stardust.'
              : 'You have no pending tasks. Enjoy this peaceful celestial moment or add a new goal.'
          }
          actionLabel="Add Your First Task"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';

            const priorityBadge = {
              starlight: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
              moonlight: 'bg-astral-500/15 text-astral-300 border-astral-500/30',
              solar: 'bg-starlight-500/15 text-starlight-400 border-starlight-500/30',
              supernova: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
            }[task.priority];

            return (
              <Card
                key={task.id}
                className={`transition-opacity ${isCompleted ? 'opacity-65' : ''}`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => handleToggleTask(task)}
                    className="flex-shrink-0 mt-0.5 text-twilight-400 hover:text-twilight-300 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                    aria-label={`Mark task ${task.title} as ${isCompleted ? 'incomplete' : 'completed'}`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4
                        className={`font-semibold text-sm sm:text-base ${
                          isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}
                      >
                        {task.title}
                      </h4>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${priorityBadge}`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {task.tags && task.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-[10px] text-twilight-300 bg-twilight-600/15 px-2 py-0.5 rounded-md"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Task Modal Dialog */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Celestial Task"
        description="Add a new goal or ritual to your daily sanctuary."
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleCreateTask}>
              Create Task
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="e.g. Meditate during Waxing Moon"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setFormError('');
            }}
            error={formError}
            autoFocus
          />

          <Textarea
            label="Description / Notes (Optional)"
            placeholder="Add detailed reflection or checklist notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="w-full">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full bg-midnight-900/60 dark:bg-midnight-900/80 border border-twilight-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-twilight-400 min-h-[44px]"
            >
              <option value="starlight">Starlight (Low Priority - +10 Stardust)</option>
              <option value="moonlight">Moonlight (Medium Priority - +20 Stardust)</option>
              <option value="solar">Solar (High Priority - +35 Stardust)</option>
              <option value="supernova">Supernova (Urgent - +50 Stardust)</option>
            </select>
          </div>

          <Input
            label="Tags (Comma separated)"
            placeholder="focus, ritual, work"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            helperText="Tags help organize your celestial calendar and habits."
          />
        </form>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Celestial Task"
        description="Modify task details."
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleEditTask}>
              Save Changes
            </Button>
          </>
        }
      >
        {editTask && (
          <form onSubmit={handleEditTask} className="space-y-4">
            <Input label="Task Title" value={editTask.title} onChange={(e) => setEditTask({ ...editTask, title: e.target.value })} />
            <Textarea label="Description" value={editTask.description || ''} onChange={(e) => setEditTask({ ...editTask, description: e.target.value })} />
            <Select label="Priority" value={editTask.priority} onChange={(e) => setEditTask({ ...editTask, priority: e.target.value as TaskPriority })} options={[{value:'starlight',label:'Starlight'}, {value:'moonlight',label:'Moonlight'}, {value:'solar',label:'Solar'}, {value:'supernova',label:'Supernova'}]} />
            <Input label="Category" value={editTask.category || ''} onChange={(e) => setEditTask({ ...editTask, category: e.target.value })} />
            <Input type="date" label="Due Date" value={editTask.dueDate || ''} onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })} />
            <Input type="time" label="Due Time" value={editTask.dueTime || ''} onChange={(e) => setEditTask({ ...editTask, dueTime: e.target.value })} />
            <Input type="datetime-local" label="Reminder" value={editTask.reminderAt || ''} onChange={(e) => setEditTask({ ...editTask, reminderAt: e.target.value })} />
            <Input type="number" label="Focus Minutes" value={editTask.focusDurationMinutes?.toString() || ''} onChange={(e) => setEditTask({ ...editTask, focusDurationMinutes: Number(e.target.value) })} />
            <Textarea label="Notes" value={editTask.notes || ''} onChange={(e) => setEditTask({ ...editTask, notes: e.target.value })} />
            <Input label="Tags (comma)" value={editTask.tags?.join(', ') || ''} onChange={(e) => setEditTask({ ...editTask, tags: e.target.value.split(',').map(t=>t.trim()) })} />
          </form>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Task"
        description="Are you sure you want to permanently delete this task? This action cannot be undone."
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="md" onClick={handleDeleteTask}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-500">Task ID: {deleteTaskId}</p>
      </Dialog>
    </div>
  );
};
