# StatusModal Component

A reusable modal component for displaying success and error messages with customizable actions.

## Import

```typescript
import StatusModal from "../Components/StatusModal";
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Controls modal visibility |
| `onClose` | `() => void` | Yes | Called when modal backdrop or close button is clicked |
| `type` | `"success" \| "error"` | Yes | Determines the modal style and icon |
| `title` | `string` | Yes | Modal title text |
| `message` | `string` | Yes | Modal message (supports HTML) |
| `primaryAction` | `ActionButton` | No | Primary button configuration |
| `secondaryAction` | `ActionButton` | No | Secondary button configuration |
| `tertiaryAction` | `TertiaryAction` | No | Text link configuration |

### ActionButton Type
```typescript
{
  label: string;
  to?: string;        // Link destination (react-router)
  onClick?: () => void; // Click handler (if not using 'to')
}
```

### TertiaryAction Type
```typescript
{
  label: string;
  onClick: () => void;
}
```

## Usage Examples

### Success Modal (Create Issue)

```typescript
const [showSuccessModal, setShowSuccessModal] = useState(false);
const [createdIssueId, setCreatedIssueId] = useState<string | null>(null);

<StatusModal
  isOpen={showSuccessModal}
  onClose={() => {
    setShowSuccessModal(false);
    navigate("/issues");
  }}
  type="success"
  title="Issue Created Successfully!"
  message={`Your issue has been created with ID <span class="font-semibold text-indigo-600">#${createdIssueId}</span>`}
  primaryAction={{
    label: "View Issue",
    to: `/issues/${createdIssueId}`,
  }}
  secondaryAction={{
    label: "Back to Issues",
    to: "/issues",
  }}
  tertiaryAction={{
    label: "Create Another Issue",
    onClick: () => {
      setShowSuccessModal(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  }}
/>
```

### Success Modal (Update Issue)

```typescript
const [showSuccessModal, setShowSuccessModal] = useState(false);
const { id } = useParams();

<StatusModal
  isOpen={showSuccessModal}
  onClose={() => {
    setShowSuccessModal(false);
    navigate("/issues");
  }}
  type="success"
  title="Issue Updated Successfully!"
  message={`Issue <span class="font-semibold text-indigo-600">#${id}</span> has been updated successfully.`}
  primaryAction={{
    label: "View Issue",
    to: `/issues/${id}`,
  }}
  secondaryAction={{
    label: "Back to Issues",
    to: "/issues",
  }}
/>
```

### Error Modal

```typescript
const [showErrorModal, setShowErrorModal] = useState(false);
const [errorMessage, setErrorMessage] = useState("");

<StatusModal
  isOpen={showErrorModal}
  onClose={() => setShowErrorModal(false)}
  type="error"
  title="Failed to Create Issue"
  message={errorMessage || "An unexpected error occurred. Please try again."}
  primaryAction={{
    label: "Try Again",
    onClick: () => {
      setShowErrorModal(false);
      // Retry logic here
    },
  }}
  secondaryAction={{
    label: "Cancel",
    onClick: () => {
      setShowErrorModal(false);
      navigate("/issues");
    },
  }}
/>
```

### Simple Success Modal

```typescript
<StatusModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  type="success"
  title="Operation Successful"
  message="The operation completed successfully."
  primaryAction={{
    label: "OK",
    onClick: () => setShowModal(false),
  }}
/>
```

### Simple Error Modal

```typescript
<StatusModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  type="error"
  title="Error Occurred"
  message="Something went wrong. Please try again later."
  primaryAction={{
    label: "Close",
    onClick: () => setShowModal(false),
  }}
/>
```

## Features

- ✨ Smooth animations with Framer Motion
- 🎨 Auto-styled based on success/error type
- 🎯 Flexible action buttons (links or handlers)
- 📱 Responsive design
- ⌨️ Backdrop click to dismiss
- ❌ Close button in top-right
- 🔗 React Router integration
- 💅 Beautiful gradient shadows

## Styling

- **Success**: Green icon, indigo primary button
- **Error**: Red icon, red primary button
- Both: Gray secondary button, styled text link
