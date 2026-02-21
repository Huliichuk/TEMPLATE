---
name: tanstack-query
description: TanStack Query v5 patterns — queryOptions factory, useQuery/useMutation, optimistic updates with rollback, cache invalidation. Score 9.7.
source: https://github.com/jezweb/claude-skills (score 9.7)
---

# TanStack Query v5 — Reference

## Query Options Factory Pattern (v5)

```tsx
import { useQuery, useMutation, useQueryClient, queryOptions } from '@tanstack/react-query'

export const todosQueryOptions = queryOptions({
  queryKey: ['todos'],
  queryFn: async () => {
    const res = await fetch('/api/todos')
    if (!res.ok) throw new Error('Failed to fetch')
    return res.json()
  },
})

export function useTodos() {
  return useQuery(todosQueryOptions)
}
```

## Mutations with Invalidation

```tsx
export function useAddTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newTodo) => {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      })
      if (!res.ok) throw new Error('Failed to add')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}
```

## Optimistic Updates (Full Pattern)

```tsx
function useOptimisticToggle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    onMutate: async (updated) => {
      // 1. Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      // 2. Snapshot previous value
      const previous = queryClient.getQueryData(['todos']);
      // 3. Optimistically update cache
      queryClient.setQueryData(['todos'], (old) =>
        old.map(todo => todo.id === updated.id ? updated : todo)
      );
      // 4. Return rollback context
      return { previous };
    },
    onError: (err, vars, context) => {
      // 5. Rollback on error
      queryClient.setQueryData(['todos'], context.previous);
    },
    onSettled: () => {
      // 6. Always refetch after success or error
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });
}
```

## Usage in Components

```tsx
function TodoList() {
  const { data, isPending, isError, error } = useTodos()
  const { mutate } = useAddTodo()

  if (isPending) return <div>Loading...</div>
  if (isError) return <div>Error: {error.message}</div>
  return <ul>{data.map(todo => <li key={todo.id}>{todo.title}</li>)}</ul>
}
```

## Rules

- **Always** use `queryOptions()` factory for reusable query configs
- **Always** invalidate queries after mutations via `onSuccess`
- **Use** optimistic updates for low-risk, frequent actions
- **Never** forget rollback logic in `onError` for optimistic updates
- **Cancel** outgoing queries in `onMutate` to prevent race conditions
