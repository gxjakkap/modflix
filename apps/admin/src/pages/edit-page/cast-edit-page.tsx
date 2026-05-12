import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import { api } from "../../lib/api";
import styles from "./customer-edit-page.module.css";

interface CastEditPageProps {
  pic?: string;
  username?: string;
}

interface PersonDraft {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageId: string | null;
}

export default function CastEditPage({ pic, username }: CastEditPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<PersonDraft | null>(null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.admin
      .people({ id })
      .get()
      .then((res) => {
        if (res.status !== 200 || !res.data) return;
        setDraft(res.data as PersonDraft);
      });
  }, [id]);

  if (!id) {
    return (
      <>
        <Navbar pic={pic} username={username} />
        <div className={styles.notFound}>
          <p>Missing person ID.</p>
          <button className={styles.backBtn} onClick={() => navigate("/cast")}>
            ← Back
          </button>
        </div>
      </>
    );
  }

  if (!draft) {
    return (
      <>
        <Navbar pic={pic} username={username} />
        <div className={styles.notFound}>
          <p>Person not found.</p>
          <button className={styles.backBtn} onClick={() => navigate("/cast")}>
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
      .people({ id })
      .put({
        id: draft.id,
        name: draft.name,
        slug: draft.slug,
        description: draft.description || undefined,
        imageId: draft.imageId || undefined,
      })
      .then((res) => {
        setSaving(false);
        if (res.status === 200) {
          setSaved(true);
          setTimeout(() => navigate("/cast"), 800);
        } else {
          window.alert(`Error: [${res.error?.status}] ${res.error?.value}`);
        }
      });
  };

  return (
    <>
      <Navbar pic={pic} username={username} />
      <h1 className={styles.pageTitle}>Edit Person</h1>

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

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>DESCRIPTION</label>
              <div className={styles.inputWrap}>
                <textarea
                  className={styles.fieldTextarea}
                  value={draft.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  style={{
                    minHeight: "100px",
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#111",
                    border: "1px solid #333",
                    color: "white",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <button className={styles.backBtn} onClick={() => navigate("/cast")}>
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
