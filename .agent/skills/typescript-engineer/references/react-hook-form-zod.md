---
name: react-hook-form-zod
description: React Hook Form + Zod validation patterns — schema definition, zodResolver, server error mapping, type inference. Score 9.7.
source: https://github.com/jezweb/claude-skills (score 9.7)
---

# React Hook Form + Zod — Reference

## Basic Setup

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// 1. Define schema
const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

// 2. Infer TypeScript type
type FormData = z.infer<typeof formSchema>

function LoginForm() {
  // 3. Setup form with resolver
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' }, // REQUIRED — prevents uncontrolled warnings
  })

  const onSubmit = (data: FormData) => {
    console.log('Valid data:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span role="alert">{errors.email.message}</span>}

      <input type="password" {...register('password')} />
      {errors.password && <span role="alert">{errors.password.message}</span>}

      <button type="submit">Login</button>
    </form>
  )
}
```

## Server Error Mapping

```tsx
const onSubmit = async (data: FormData) => {
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    const result = await response.json()

    if (!result.success && result.errors) {
      // Map server errors to form fields
      Object.entries(result.errors).forEach(([field, message]) => {
        setError(field, {
          type: 'server',
          message: Array.isArray(message) ? message[0] : message,
        })
      })
    }
  } catch (error) {
    // Network error → root-level error
    setError('root', {
      type: 'server',
      message: 'Unable to connect. Please try again.',
    })
  }
}
```

## Dependencies

```bash
npm install react-hook-form zod @hookform/resolvers
```

## Rules

- **Always** provide `defaultValues` — prevents uncontrolled input warnings
- **Always** use `z.infer<typeof schema>` for type inference
- **Use** `setError(field, ...)` for server-side validation errors
- **Use** `setError('root', ...)` for global/network errors
- **Add** `role="alert"` to error messages for accessibility
