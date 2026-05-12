import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import { api } from "../../lib/api";
import styles from "../edit-page/customer-edit-page.module.css";

interface GenreCreatePageProps {
  pic?: string;
  username?: string;
}

export default function GenreCreatePage({
  pic,
  username,
}: GenreCreatePageProps) {
  const navigate = useNavigate();
  const [draft, setDraft] = useState({ name: "", slug: "" });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: string) => {
    setErrors((prev) => ({ ...prev, [field]: null }));
    setDraft((prev) => ({ ...prev, [field]: value }));
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
    api.admin.genres.create
      .post({
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
      <h1 className={styles.pageTitle}>Create Genre</h1>

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
            {saved ? "✓ CREATED!" : saving ? "SAVING..." : "CREATE GENRE"}
          </button>
        </div>
      </div>
    </>
  );
}
