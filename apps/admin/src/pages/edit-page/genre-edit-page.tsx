import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/navbar";
import { api } from "../../lib/api";
import styles from "./customer-edit-page.module.css";

interface GenreEditPageProps {
  pic?: string;
  username?: string;
}

interface GenreEdit {
  id: string;
  name: string;
  slug: string;
}

export default function GenreEditPage({ pic, username }: GenreEditPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<GenreEdit | null>(null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!id) {
    return (
      <>
        <Navbar pic={pic} username={username} />
        <div className={styles.notFound}>
          <p>Missing id params.</p>
          <button
            className={styles.backBtn}
            onClick={() => navigate("/genres")}
          >
            ← Back
          </button>
        </div>
      </>
    );
  }

  useEffect(() => {
    api.admin
      .genres({ id })
      .get()
      .then((res) => {
        if (res.status !== 200 || !res.data) return;
        setDraft(res.data as unknown as GenreEdit);
      });
  }, []);

  if (!draft) {
    return (
      <>
        <Navbar pic={pic} username={username} />
        <div className={styles.notFound}>
          <p>
            Genre with id <strong>{id}</strong> not found.
          </p>
          <button
            className={styles.backBtn}
            onClick={() => navigate("/genres")}
          >
            ← Back
          </button>
        </div>
      </>
    );
  }

  const handleChange = (field: string, value: string) => {
    setErrors((prev) => ({ ...prev, [field]: null }));
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!draft.name?.trim()) e.name = "Required";
    if (!draft.slug?.trim()) e.slug = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);
    api.admin
      .genres({ id })
      .put({
        id: draft.id,
        name: draft.name,
        slug: draft.slug,
      })
      .then((res) => {
        if (res.status === 200) {
          setSaving(false);
          setSaved(true);
          setTimeout(() => navigate("/genres"), 800);
        } else {
          setSaving(false);
          if (
            typeof res.error?.value === "object" &&
            res.error?.value !== null &&
            "message" in res.error.value
          ) {
            window.alert(`Error: ${res.error.value.message}`);
          } else {
            window.alert(`Error: [${res.error?.status}] ${res.error?.value}`);
          }
        }
      });
  };

  return (
    <>
      <Navbar pic={pic} username={username} />
      <h1 className={styles.pageTitle}>Edit Genre</h1>

      <div className={styles.pageWrapper}>
        <div className={styles.topSection}>
          <div className={styles.fieldsSection}>
            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>
                NAME <span className={styles.req}>*</span>
              </label>
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.fieldInput} ${errors.name ? styles.inputErr : ""}`}
                  value={draft.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                {errors.name && (
                  <span className={styles.errMsg}>{errors.name}</span>
                )}
              </div>
            </div>
            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>
                SLUG <span className={styles.req}>*</span>
              </label>
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.fieldInput} ${errors.slug ? styles.inputErr : ""}`}
                  value={draft.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                />
                {errors.slug && (
                  <span className={styles.errMsg}>{errors.slug}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <button
            className={styles.backBtn}
            onClick={() => navigate("/genres")}
          >
            ← Back
          </button>
          <button
            className={`${styles.saveBtn} ${saved ? styles.savedBtn : ""}`}
            onClick={handleSave}
            disabled={saved || saving}
          >
            {saved ? "✓ SAVED!" : saving ? "SAVING..." : "SAVE CHANGES"}
          </button>
        </div>
      </div>
    </>
  );
}
