import Phong from './Phong.jsx'
import DienNuoc from './DienNuoc.jsx'
import TienPhong from './TienPhong.jsx'
import ChoO from './ChoO.jsx'
import SinhVien from './SinhVien.jsx'
import { useRef } from 'react'

export default function DashBoard() {
	document.title = 'Dashboard'
	const targetFound = useRef(null)
	console.log('DashBoard render!')
	function openCity(event, city) {
		const citys = document.getElementsByClassName('admin')
		for(let i=0; i<citys.length; i++) {
			citys[i].style.display = 'none'
		}
		const tabLinks = document.getElementsByClassName('tab-links')
		for(let i=0; i<tabLinks.length; i++) {
			tabLinks[i].classList.remove('w3-text-indigo')
		}
		document.getElementById(city).style.display = 'block'
		event.target.classList.add('w3-text-indigo')
	}
	function handleSelectTr(event, type) {
		if(targetFound.current) {
			targetFound.current.classList.remove('w3-yellow')
		}
		const targetTr = event.target.parentElement
		console.log('selected tr:', targetTr)
		if (type==="sinhvien") {
			document.getElementById('ma-sinh-vien').value=targetTr.childNodes[0].innerText
			document.getElementById('ho-ten-sv').value=targetTr.childNodes[1].innerText
			document.getElementById('sdt').value=targetTr.childNodes[2].innerText
			document.getElementById('dia-chi').value=targetTr.childNodes[3].innerText
			document.getElementById('khoa').value=targetTr.childNodes[4].innerText
			document.getElementById('ngay-sinh').value=targetTr.childNodes[5].innerText
			document.getElementById('nganh-hoc').value=targetTr.childNodes[6].innerText
			document.getElementById('lop').value=targetTr.childNodes[7].innerText
			document.getElementById('mail').value=targetTr.childNodes[8].innerText
			document.getElementById('dien-chinh-sach').value=targetTr.childNodes[9].innerText
		} else if (type==="phong") {
			document.getElementById('ma-phong').value = targetTr.childNodes[0].innerText
			document.getElementById('ten-phong').value = targetTr.childNodes[1].innerText
			document.getElementById('ma-day').value = targetTr.childNodes[2].innerText
			document.getElementById('ma-loai').value = targetTr.childNodes[3].innerText
			document.getElementById('don-gia').value = targetTr.childNodes[4].innerText
			document.getElementById('tuy-chon-nam-nu').value = targetTr.childNodes[5].innerText
			document.getElementById('trang-thai-phong').value = targetTr.childNodes[6].innerText
			document.getElementById('suc-chua').value = targetTr.childNodes[7].innerText
		} else if (type==="cho-o") {
			document.getElementById('ma-day-cho-o').value = targetTr.childNodes[0].innerText
			document.getElementById('ma-phong-cho-o').value = targetTr.childNodes[1].innerText
			document.getElementById('ma-loai-phong-cho-o').value = targetTr.childNodes[2].innerText
			document.getElementById('ma-sinh-vien-cho-o').value = targetTr.childNodes[3].innerText
			document.getElementById('ngay-duoc-duyet-cho-o').value = targetTr.childNodes[4].innerText
			document.getElementById('ngay-rut-don-cho-o').value = targetTr.childNodes[5].innerText
		} else if (type==="dien-nuoc") {
			document.getElementById('ma-day-dien-nuoc').value = targetTr.childNodes[0].innerText
			document.getElementById('ma-phong-dien-nuoc').value = targetTr.childNodes[1].innerText
			document.getElementById('ma-loai-dien-nuoc').value = targetTr.childNodes[2].innerText
			const soKyDien = document.getElementById('so-ky-dien').value = targetTr.childNodes[3].innerText
			const soKyNuoc = document.getElementById('so-ky-nuoc').value = targetTr.childNodes[4].innerText
			document.getElementById('gia-dien').value = targetTr.childNodes[5].innerText/soKyDien
			document.getElementById('gia-nuoc').value = targetTr.childNodes[6].innerText/soKyNuoc
			document.getElementById('thoi-gian-dien-nuoc').value = targetTr.childNodes[8].innerText
			document.getElementById('nam-hoc-dien-nuoc').value = targetTr.childNodes[9].innerText
			document.getElementById('hoc-ky-dien-nuoc').value = targetTr.childNodes[10].innerText
			const trangThaiDongPhi = targetTr.childNodes[11].innerText
			if (trangThaiDongPhi==='chưa') {
				document.getElementById("chua-dong-phi-dien-nuoc").checked = true
			} else {
				document.getElementById("da-dong-phi-dien-nuoc").checked = true
			}
		} else {
			document.getElementById('ma-day-tien-phong').value = targetTr.childNodes[0].innerText
			document.getElementById('ma-phong-tien-phong').value = targetTr.childNodes[1].innerText
			document.getElementById('ma-loai-tien-phong').value = targetTr.childNodes[2].innerText
			document.getElementById('so-tien-phong').value = targetTr.childNodes[3].innerText
			document.getElementById('hoc-ky').value = targetTr.childNodes[4].innerText
			document.getElementById('nam-hoc').value = targetTr.childNodes[5].innerText
			document.getElementById('ma-sinh-vien-tien-phong').value = targetTr.childNodes[6].innerText
			document.getElementById('ho-ten-sv-tien-phong').value = targetTr.childNodes[7].innerText
			const trangThaiDongPhi = targetTr.childNodes[8].innerText
			if (trangThaiDongPhi==='chưa') {
				document.getElementById("chua-dong-phi-phong").checked = true
			} else {
				document.getElementById("da-dong-phi-phong").checked = true
			}
		}
		targetTr.classList.add('w3-yellow')
		targetFound.current=targetTr
	}
	return (
		<div className="w3-container w3-card w3-margin-top w3-padding">
			<div className="w3-bar">
				<button 
					className="tab-links w3-bar-item w3-button w3-border-right w3-text-indigo" 
					onClick={(e)=>openCity(e,'sinh-vien')}>Sinh viên
				</button>
				<button 
					className="tab-links w3-bar-item w3-button w3-border-right" 
					onClick={(e)=>openCity(e,'thong-tin-phong')}>Phòng
				</button>
				<button 
					className="tab-links w3-bar-item w3-button w3-border-right" 
					onClick={(e)=>openCity(e,'cho-o')}>Chổ ở
				</button>
				<button 
					className="tab-links w3-bar-item w3-button w3-border-right" 
					onClick={(e)=>openCity(e,'dien-nuoc')}>Điện Nước</button>
				<button 
					className="tab-links w3-bar-item w3-button" 
					onClick={(e)=>openCity(e,'tien-phong')}>Tiền phòng
				</button>
			</div>
			<div id="sinh-vien" className="admin">
				<SinhVien targetFound={targetFound} handleSelectTr={handleSelectTr}/>
			</div>
			<div id="thong-tin-phong" className="admin" style={{display:'none'}}>
				<Phong targetFound={targetFound} handleSelectTr={handleSelectTr}/>
			</div>
			<div id="cho-o" className="admin" style={{display:'none'}}>
				<ChoO targetFound={targetFound} handleSelectTr={handleSelectTr}/>
			</div> 
			<div id="dien-nuoc" className="admin" style={{display:'none'}}>
				<DienNuoc targetFound={targetFound} handleSelectTr={handleSelectTr}/>
			</div>
			<div id="tien-phong" className="admin" style={{display:'none'}}>
				<TienPhong targetFound={targetFound} handleSelectTr={handleSelectTr}/>
			</div>
		</div>
	)
}