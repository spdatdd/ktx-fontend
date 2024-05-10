import './Layout.css'
import { Outlet, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Layout() {
	console.log('Layout render!')
	const [dataSinhVien, setDataSinhVien] = useState(localStorage.getItem("dataSinhVien"))
	function handleLinkClick(e) {
		const nav = document.getElementById('navigation')
		for (let i=0; i<nav.childNodes.length; i++) {
				const child = nav.childNodes[i]
				child.classList.remove('w3-text-indigo')
		}
		e.target.classList.add('w3-text-indigo')
	}

	function handleLogOut(e) {
		const nav = document.getElementById('navigation')
		for (let i=0; i<nav.childNodes.length; i++) {
				const child = nav.childNodes[i]
				child.classList.remove('w3-text-indigo')
		}
		e.stopPropagation()
		localStorage.removeItem('dataSinhVien')
		setDataSinhVien(null)
		document.getElementById('login').innerText = 'Đăng nhập'
	}
	
	useEffect(() => {
		const login = document.getElementById('login')
		if (dataSinhVien) {login.innerText='Đăng xuất'}
		else {login.innerText='Đăng nhập'}
	}, [])
	
	return (
		<div className="w3-content" style={{maxWidth: '80vw'}}>
			<div
			className="w3-display-container w3-card w3-indigo w3-cell-row"
			id="header">
				<div className="w3-display-center w3-center w3-mobile">
					<Link to="/">
					<h1>Ký túc xá đại học</h1>
					</Link>
				</div>
				<div className="w3-display-right w3-margin-right w3-mobile">
					<Link to="/login" className="w3-button w3-right" onClick={handleLogOut}>
						<i className="fa-solid fa-right-from-bracket w3-text-red"
						style={{marginRight: '1vw'}}>
						</i><span id="login"></span>
					</Link>
				</div>
			</div>
			{/* Thanh chỉ mục */}
			<div 
			className="w3-container w3-card w3-bars w3-center w3-padding"
			id="navigation">
				<Link to="/" onClick={handleLinkClick}
				className="w3-bar-item w3-mobile w3-button"
				>Xem tình trạng phòng
				
				</Link>
				{dataSinhVien && (<Link to="/dang-ky-o" onClick={handleLinkClick}
					className="w3-bar-item w3-mobile w3-button w3-border-left w3-margin-right"
					>Thông tin</Link>)
				}
			</div>
			<Outlet />
			<div className="w3-card w3-center w3-indigo" id="footer">2023</div>
		</div>
	)
}