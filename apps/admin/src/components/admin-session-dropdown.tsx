import { useEffect, useRef, useState } from "react"
import { authClient } from "../lib/auth-client"

interface DropdownProps {
	token: string
	onRevoke: () => void
}

export default function AdminSessionDropdown({ token, onRevoke }: DropdownProps) {
	const [open, setOpen] = useState(false)
	const [pos, setPos] = useState({ top: 0, left: 0 })
	const btnRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
				setOpen(false)
			}
		}
		document.addEventListener("mousedown", handler)
		return () => document.removeEventListener("mousedown", handler)
	}, [])

	const handleClick = () => {
		if (!open && btnRef.current) {
			const rect = btnRef.current.getBoundingClientRect()
			setPos({
				top: rect.bottom + window.scrollY + 4,
				left: rect.right + window.scrollX - 140,
			})
		}
		setOpen((o) => !o)
	}

	const revokeSession = async () => {
		const { data: _data, error } = await authClient.admin.revokeUserSession({
			sessionToken: token,
		})
		if (error) {
			window.alert(`Error: [${error.status}] ${error.message}`)
			return
		}
		onRevoke()
	}

	return (
		<div ref={btnRef} style={{ position: "relative", display: "inline-block" }}>
			<button style={s.btn} onClick={handleClick}>
				ACTIONS ▼
			</button>

			{open && (
				<div
					style={{
						...s.menu,
						position: "fixed",
						top: pos.top,
						left: pos.left,
					}}
				>
					<div
						key={"ban-unban"}
						style={{
							...s.item,
							color: "#333",
						}}
						onMouseEnter={(e) => (e.currentTarget.style.background = "#fff0e8")}
						onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
						onClick={() => {
							revokeSession()
						}}
					>
						Revoke
					</div>
				</div>
			)}
		</div>
	)
}

const s: Record<string, React.CSSProperties> = {
	btn: {
		background: "#e85d00",
		color: "#fff",
		border: "none",
		borderRadius: "10px",
		padding: "4px 8px",
		fontSize: "14px",
		fontWeight: "600",
		cursor: "pointer",
		whiteSpace: "nowrap",
	},
	menu: {
		background: "#fff",
		border: "1px solid #e0d0c0",
		borderRadius: "8px",
		zIndex: 9999,
		minWidth: "150px",
		boxShadow: "0 4px 16px rgba(0,0,0,.2)",
		overflow: "hidden",
	},
	item: {
		padding: "9px 14px",
		fontSize: "14px",
		cursor: "pointer",
		fontWeight: "500",
		background: "transparent",
		transition: "background .15s",
	},
}
