import { create } from 'zustand';

export interface PetState {
  name: string;
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  maxXp: number;
  addXp: (amount: number) => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
}

export const usePetStore = create<PetState>((set) => ({
  name: '咪咪',
  hp: 75,
  maxHp: 100,
  xp: 340,
  level: 5,
  maxXp: 500,
  addXp: (amount: number) =>
    set((state) => {
      let newXp = state.xp + amount;
      let newLevel = state.level;
      let newMaxXp = state.maxXp;

      while (newXp >= newMaxXp) {
        newXp -= newMaxXp;
        newLevel += 1;
        newMaxXp = Math.floor(newMaxXp * 1.5);
      }
      return { xp: newXp, level: newLevel, maxXp: newMaxXp };
    }),
  takeDamage: (amount: number) =>
    set((state) => ({ hp: Math.max(0, state.hp - amount) })),
  heal: (amount: number) =>
    set((state) => ({ hp: Math.min(state.maxHp, state.hp + amount) })),
}));

export interface Reminder {
  id: string;
  title: string;
  checked: boolean;
  category: string;
  dueTime: string;
  photoRequired?: boolean;
}

export interface CalendarTask {
  id: string;
  text: string;
  checked: boolean;
}

export interface CalendarEvent {
  id: number;
  title: string;
  time: string;
  location: string;
  date: string;
  tasks: CalendarTask[];
}

const REMINDERS_KEY = 'wowo-reminders';
const CALENDAR_EVENTS_KEY = 'wowo-calendar-events';

const loadFromStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = <T>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore write errors
  }
};

const defaultReminders: Reminder[] = [
  { id: '1', title: '帶雨傘', checked: false, category: '日常', dueTime: '08:00' },
  { id: '2', title: '準時開會', checked: false, category: '工作', dueTime: '10:00' },
  { id: '3', title: '吃藥', checked: false, category: '健康', dueTime: '12:30', photoRequired: true },
  { id: '4', title: '帶便當', checked: true, category: '飲食', dueTime: '07:30' },
  { id: '5', title: '喝水2000ml', checked: false, category: '健康', dueTime: '20:00' },
];

const defaultCalendarEvents: CalendarEvent[] = [
  {
    id: 1,
    title: '專案進度報告',
    time: '10:00 - 11:30',
    location: '會議室 A',
    date: new Date().toISOString().slice(0, 10),
    tasks: [
      { id: 't1', text: '準備簡報檔案', checked: true },
      { id: 't2', text: '列印會議議程', checked: false },
    ],
  },
  {
    id: 2,
    title: '寵物醫院回診',
    time: '14:00 - 15:00',
    location: '快樂動物醫院',
    date: new Date().toISOString().slice(0, 10),
    tasks: [
      { id: 't3', text: '帶健康手冊', checked: false },
      { id: 't4', text: '準備外出籠', checked: false },
    ],
  },
];

export const useDataStore = create<{
  reminders: Reminder[];
  calendarEvents: CalendarEvent[];
  toggleReminder: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  toggleCalendarTask: (eventId: number, taskId: string) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
}>((set) => ({
  reminders: loadFromStorage<Reminder[]>(REMINDERS_KEY, defaultReminders),
  calendarEvents: loadFromStorage<CalendarEvent[]>(CALENDAR_EVENTS_KEY, defaultCalendarEvents),
  toggleReminder: (id) =>
    set((state) => {
      const reminders = state.reminders.map((r) =>
        r.id === id ? { ...r, checked: !r.checked } : r
      );
      saveToStorage(REMINDERS_KEY, reminders);
      return { reminders };
    }),
  addReminder: (reminder) =>
    set((state) => {
      const nextReminder: Reminder = {
        ...reminder,
        id: `${Date.now()}`,
      };
      const reminders = [...state.reminders, nextReminder];
      saveToStorage(REMINDERS_KEY, reminders);
      return { reminders };
    }),
  toggleCalendarTask: (eventId, taskId) =>
    set((state) => {
      const calendarEvents = state.calendarEvents.map((event) => {
        if (event.id !== eventId) return event;
        const tasks = event.tasks.map((task) =>
          task.id === taskId ? { ...task, checked: !task.checked } : task
        );
        return { ...event, tasks };
      });
      saveToStorage(CALENDAR_EVENTS_KEY, calendarEvents);
      return { calendarEvents };
    }),
  addCalendarEvent: (event) =>
    set((state) => {
      const nextEvent: CalendarEvent = {
        ...event,
        id: Date.now(),
      };
      const calendarEvents = [...state.calendarEvents, nextEvent];
      saveToStorage(CALENDAR_EVENTS_KEY, calendarEvents);
      return { calendarEvents };
    }),
}));
