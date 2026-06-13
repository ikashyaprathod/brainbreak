import { getItem, setItem, removeItem, getAllEntries, appendToArray, updateInArray, removeFromArray, exportAllData } from '@/utils/storage';

describe('storage utility tests', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('getItem returns parsed JSON and null if missing/corrupt', () => {
    setItem('test-key', { a: 1 });
    expect(getItem<{ a: number }>('test-key')).toEqual({ a: 1 });

    expect(getItem('missing-key')).toBeNull();

    // corrupt JSON
    localStorage.setItem('corrupt-key', '{bad json');
    expect(getItem('corrupt-key')).toBeNull();
  });

  test('setItem stringifies and stores data', () => {
    setItem('test-key', [1, 2, 3]);
    expect(localStorage.getItem('test-key')).toBe('[1,2,3]');
  });

  test('removeItem deletes from store', () => {
    setItem('test-key', 'value');
    removeItem('test-key');
    expect(getItem('test-key')).toBeNull();
  });

  test('getAllEntries returns parsed array or empty array if missing/invalid', () => {
    expect(getAllEntries('empty-key')).toEqual([]);
    
    setItem('array-key', [10, 20]);
    expect(getAllEntries<number>('array-key')).toEqual([10, 20]);

    setItem('invalid-array-key', { not: 'an-array' });
    expect(getAllEntries('invalid-array-key')).toEqual([]);
  });

  test('appendToArray adds items', () => {
    appendToArray<string>('list-key', 'item1');
    expect(getAllEntries<string>('list-key')).toEqual(['item1']);

    appendToArray<string>('list-key', 'item2');
    expect(getAllEntries<string>('list-key')).toEqual(['item1', 'item2']);
  });

  test('updateInArray modifies correct item by ID', () => {
    const list = [{ id: '1', name: 'alice' }, { id: '2', name: 'bob' }];
    setItem('users', list);

    updateInArray<{ id: string; name: string }>('users', '2', (item) => ({ ...item, name: 'charlie' }));
    
    expect(getAllEntries<{ id: string; name: string }>('users')).toEqual([
      { id: '1', name: 'alice' },
      { id: '2', name: 'charlie' }
    ]);
  });

  test('removeFromArray removes correct item by ID', () => {
    const list = [{ id: '1', name: 'alice' }, { id: '2', name: 'bob' }];
    setItem('users', list);

    removeFromArray('users', '1');

    expect(getAllEntries<{ id: string; name: string }>('users')).toEqual([
      { id: '2', name: 'bob' }
    ]);
  });

  test('exportAllData bundles keys into JSON string', () => {
    setItem('key1', 'val1');
    setItem('key2', 'val2');

    const exported = exportAllData(['key1', 'key2', 'key3']);
    const parsed = JSON.parse(exported) as Record<string, unknown>;

    expect(parsed.key1).toBe('val1');
    expect(parsed.key2).toBe('val2');
    expect(parsed.key3).toBeNull();
  });
});
