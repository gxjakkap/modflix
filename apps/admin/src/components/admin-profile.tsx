import { useState } from "react";
import "./admin-profile.css";

 
// Typing Rules (กรอง character ตอนพิมพ์)
const TYPING_RULES: Record<string, RegExp> = {
  fullName: /^[a-zA-Zก-๙\s]+$/,   // รับเฉพาะตัวอักษร
  birthday: /^[0-9/]+$/,           // รับเฉพาะตัวเลขและ /
  phone:    /^[0-9]+$/,            // รับเฉพาะตัวเลข
};
 
// Save Rules (validate รูปแบบตอนกด Save)
const SAVE_RULES: Record<string, { pattern: RegExp; message: string }> = {
  fullName: {
    pattern: /^[a-zA-Zก-๙\s]+$/,
    message: "กรอกได้เฉพาะตัวอักษรเท่านั้น",
  },
  username: {
    pattern: /^.+$/,                  
    message: "กรุณากรอก Username",
  },
  birthday: {
    pattern: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/[0-9]{4}$/,
    message: "รูปแบบวันที่ไม่ถูกต้อง กรุณากรอก dd/mm/yyyy (เช่น 12/04/2549)",
  },
  phone: {
    pattern: /^[0-9]{10}$/,
    message: "เบอร์โทรต้องเป็นตัวเลข 10 หลักเท่านั้น",
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,  
    message: "กรุณากรอก Email ให้ถูกต้อง",
  },
};

interface ProfileFormData {
  fullName: string
  username: string
  birthday: string
  phone: string
  email: string
}

interface FieldProps {
  label: string
  field: string
  full?: boolean
  editing: boolean
  value: string
  draft: string
  onChange: (field: string, value: string) => void
  error?: string | null
}

function Field({ label, field, full, editing, value, draft, onChange, error }: FieldProps) {
  return (
    <div className={`field-item${full ? " full" : ""}`}>
      <div className="field-label">{label}</div>
      {editing ? (
        <>
          <input
            className={`field-input${error ? " input-error" : ""}`}
            value={draft}
            onChange={(e) => onChange(field, e.target.value)}
          />
          {error && <div className="field-error">{error}</div>}
        </>
      ) : (
        <div className="field-value">{value}</div>
      )}
    </div>
  );
}

interface AdminProfileProps {
  username?: string
  pic?: string
  onSave?: (username: string) => void
}

function AdminProfile({ username = "WINTER", pic, onSave }: AdminProfileProps) {
  const [editing, setEditing] = useState(false);
  const [error] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
  const [form, setForm] = useState<ProfileFormData>({
    fullName: "KIM MINJEONG",
    username: username,
    birthday: "12/04/2549",
    phone: "0123456789",
    email: "winrina@gmail.com",
  });
  const [draft, setDraft] = useState<ProfileFormData>({ ...form });

  const handleEdit = () => {
    setDraft({ ...form });
    setFieldErrors({});
    setEditing(true);
  };
 
  const handleCancel = () => {
    setFieldErrors({});
    setEditing(false);
  };

  // กรอง character ตอนพิมพ์
  const handleChange = (field: string, value: string) => {
    const typingPattern = TYPING_RULES[field];
    if (typingPattern && value !== "") {
      if (!typingPattern.test(value)) return; // บล็อก character ที่ไม่อนุญาต
    }
    setFieldErrors((prev) => ({ ...prev, [field]: null }));
    setDraft((prev) => ({ ...prev, [field]: value }));
  };
 
  // Validate รูปแบบตอนกด Save
  const validate = () => {
    const errors: Record<string, string> = {};
    Object.entries(SAVE_RULES).forEach(([field, rule]) => {
      if (!rule) return;
      if (!rule.pattern.test(draft[field as keyof ProfileFormData] || "")) {
        errors[field] = rule.message;
      }
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => { 
    if (!validate()) return; 
    setForm({ ...draft }); 
    setEditing(false);
    onSave?.(draft.username);
  };

  const fields: Array<{ label: string; field: string; full?: boolean }> = [
    { label: "FULL NAME",  field: "fullName"  },
    { label: "USERNAME",   field: "username"  },
    { label: "BIRTHDAY",   field: "birthday"  },
    { label: "PHONE",      field: "phone"     },
    { label: "EMAIL",      field: "email", full: true },
  ];

  if (error)   return <div className="admin-status error">Error: {error}</div>;

  return (
    <div className="admin-wrapper">
      {/* Header */}
      <div className="admin-header">
        <h1>Super Admin</h1>
      </div>

      {/* Body */}
      <div className="admin-body">
        {/* Avatar Row */}
        <div className="admin-avatar-row">
          <div className="admin-avatar-info">
            <div className="admin-avatar">
              {/* Replace the letter with <img src="..." alt="avatar" /> for a real photo */}
              {pic
                ? <img src={pic} alt="avatar" />
                : form.username[0]   // ถ้าไม่มีรูปให้แสดงตัวอักษรแรก
              }
            </div>
            <div>
              <div className="admin-name">{form.username}</div>
              <div className="admin-userid">USER ID : 0001</div>
            </div>
          </div>

          <div className="btn-group">
            {editing ? (
              <>
                <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
                <button className="btn-save" onClick={handleSave}>Save Changes</button>
              </>
            ) : (
              <button className="btn-edit" onClick={handleEdit}>EDIT</button>
            )}
          </div>
        </div>

        {/* Fields */}
        <div className="admin-fields">
          {fields.map(({ label, field, full }) => (
            <Field
              key={field}
              label={label}
              field={field}
              full={full}
              editing={editing}
              value={form[field as keyof ProfileFormData]}
              draft={draft[field as keyof ProfileFormData]}
              onChange={handleChange}
              error={fieldErrors[field]} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
