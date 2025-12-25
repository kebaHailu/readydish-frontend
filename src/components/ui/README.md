# UI Components Reference

This directory contains all the reusable UI components for the ReadyDish application.

## Components

### Button
A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

<Button variant="outline" isLoading={true}>
  Loading...
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean (shows spinner and disables button)
- All standard button HTML attributes

---

### Input
Text input with label and error handling.

```tsx
import { Input } from '@/components/ui';

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error={errors.email}
  required
/>
```

**Props:**
- `label`: string (optional)
- `error`: string (optional, displays error message)
- `helperText`: string (optional, displays helper text)
- All standard input HTML attributes

---

### Label
Form label component with optional required indicator.

```tsx
import { Label } from '@/components/ui';

<Label htmlFor="email" required>
  Email Address
</Label>
```

**Props:**
- `required`: boolean (shows red asterisk)
- All standard label HTML attributes

---

### Card
Container component for grouping content.

```tsx
import { Card } from '@/components/ui';

<Card padding="md">
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>
```

**Props:**
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `className`: string (additional classes)

---

### Select
Dropdown select component with label and error handling.

```tsx
import { Select } from '@/components/ui';

<Select
  label="Status"
  options={[
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' }
  ]}
  placeholder="Select status"
  error={errors.status}
/>
```

**Props:**
- `label`: string (optional)
- `options`: Array of { value: string, label: string }
- `placeholder`: string (optional)
- `error`: string (optional)
- `helperText`: string (optional)
- All standard select HTML attributes

---

### Badge
Status indicator badge component.

```tsx
import { Badge } from '@/components/ui';

<Badge variant="success" size="md">
  Active
</Badge>
```

**Props:**
- `variant`: 'default' | 'success' | 'warning' | 'danger' | 'info'
- `size`: 'sm' | 'md'

---

### Spinner
Loading spinner component.

```tsx
import { Spinner } from '@/components/ui';

<Spinner size="md" />
```

**Props:**
- `size`: 'sm' | 'md' | 'lg'

---

### Toast (via ToastContext)
Toast notifications for user feedback.

```tsx
import { useToast } from '@/contexts/ToastContext';

const { showSuccess, showError, showInfo, showWarning } = useToast();

// Usage
showSuccess('Order placed successfully!');
showError('Something went wrong');
showInfo('Please check your email');
showWarning('Low stock available');
```

**ToastProvider Setup:**
Wrap your app with ToastProvider in `main.tsx` or `App.tsx`:

```tsx
import { ToastProvider } from '@/contexts/ToastContext';

<ToastProvider>
  <App />
</ToastProvider>
```

---

## Importing Components

You can import components individually or from the index:

```tsx
// Individual import
import Button from '@/components/ui/Button';

// Or from index (recommended)
import { Button, Input, Card } from '@/components/ui';
```

---

## Styling

All components use Tailwind CSS and are fully customizable. You can:
- Override styles using the `className` prop
- Modify component files to change default styles
- Extend components to create variants

---

## Next Steps

1. Test each component in isolation
2. Customize colors/styles to match your design
3. Add more components as needed (Modal, Dropdown, etc.)
4. Use these components throughout your pages


