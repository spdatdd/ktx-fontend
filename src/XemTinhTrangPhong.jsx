import './XemTinhTrangPhong.css'
import { useState, useEffect, useRef } from "react";

export default function XemTinhTrangPhong() {
	document.title = 'Xem tình trạng phòng'
	const [contentXemTinhTrangPhong, setContentXemTinhTrangPhong] = useState({content: [], mangMaDay: [], mangMaLoai: []})
	const numContent = useRef(20)
	const newContentXemTinhTrangPhong = useRef([])
	console.log("XemTinhTrangPhong Render!")
	// useEffect(() => {
		// function Resize() {
			// const header = document.getElementById('header').offsetHeight
			// const navigation = document.getElementById('navigation').offsetHeight
			// const search = document.getElementById('search-menu').offsetHeight
			// const footer = document.getElementById('footer').offsetHeight
			// const button = document.getElementById('button-search').offsetHeight
			// const tong = header + navigation + search + footer + button
			// const height = window.innerHeight
			// document.getElementById('table-content').style.height = height-tong + 'px'
		// }
		// Resize()
		// window.addEventListener('resize', Resize)
		// return () => window.removeEventListener('resize', Resize)
	// }, []);
	
	useEffect(() => {
		// Tùy chọn cho yêu cầu GET
		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
				// Các headers khác nếu cần thiết
			}
		};
		// Gửi yêu cầu GET bằng fetch
		fetch("http://127.0.0.1:3000/api/phong", requestOptions)
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to fetch XemTinhTrangPhong data');
				}
				return response.json(); // Trả về dữ liệu dưới dạng JSON
			})
			.then(data => {
				// Xử lý dữ liệu nhận được từ máy chủ
				setContentXemTinhTrangPhong({content: data['mangPhong'], mangMaDay: data['mangDay'], mangMaLoai: data['mangLoai']})
			})
			.catch(error => {
				console.error('Error fetching XemTinhTrangPhong data:', error);
				// Xử lý lỗi ở đây nếu cần thiết
			});
		
	}, []);
	
	useEffect(()=>{
		function checkScrollPhong(){
			console.log('checkScrollXemTinhTrangPhong', numContent.current)
			let contentXemTinhTrangPhongLength = contentXemTinhTrangPhong.content.length
			const newContenXemTinhTrangPhongLength = newContentXemTinhTrangPhong.current.length
			let contentXemTinhTrangPhongData = contentXemTinhTrangPhong.content
			if (newContenXemTinhTrangPhongLength > 0) {
				contentXemTinhTrangPhongData = newContentXemTinhTrangPhong.current
				contentXemTinhTrangPhongLength = newContenXemTinhTrangPhongLength
			}
			// Kiểm tra nếu đã scroll tới cuối phần tử #table-content
			if ((numContent.current<contentXemTinhTrangPhongData.length) && (containerTable.scrollTop + containerTable.clientHeight >= containerTable.scrollHeight-10)) {
				// Tải thêm nội dung
				let numEnd = contentXemTinhTrangPhongLength-numContent.current
				if (numEnd>20){
					numEnd = 20
				}
				const tbodyTablePhong = document.getElementById('tbody-xem-tinh-trang-phong')
				for(let i=0; i<numEnd; i++) {
					const tr = document.createElement('tr')
					for(let j=0; j<10; j++) {
						const td = document.createElement('td')
						try {
							td.textContent = Object.values(contentXemTinhTrangPhongData[(numContent.current)+i])[j]
							tr.appendChild(td)
						} catch (err) {
							// Xử lý khi hết phần tử trong content[]
							break
						}
					}
					tbodyTablePhong.appendChild(tr)
				}
				if (numContent.current < contentXemTinhTrangPhongLength) {
					numContent.current += 20
				}
				if (numContent.current>=contentXemTinhTrangPhongLength) {
					numContent.current = contentXemTinhTrangPhongLength
				}
			}
		}
		// Lấy phần tử #table-content
		const containerTable = document.getElementById('container-table-xem-tinh-trang-phong');
		containerTable.addEventListener("scroll", checkScrollPhong)
		return () => containerTable.removeEventListener('scroll', checkScrollPhong)
	}, [contentXemTinhTrangPhong])
	
	function handleXemTinhTrangPhong() {
		const maPhong = document.getElementById('ma-phong-xem-ttp')
		const maDay = document.getElementById('ma-day-xem-ttp')
		const maLoai = document.getElementById('ma-loai-xem-ttp')
		const tinhTrangPhong = document.getElementById('tinh-trang-phong-xem-ttp')
		const phongNamNu = document.getElementById('tuy-chon-namnu-xem-ttp')
		const tuyChon = document.getElementById('tuy-chon-xem-ttp')
		const sucChua = document.getElementById('suc-chua-xem-tinh-trang-phong')
		const xemTTP = [maPhong.value, '', maDay.value, maLoai.value, '', phongNamNu.value, tinhTrangPhong.value, sucChua.value, '', tuyChon.value]
		const tbodyTableTienPhong = document.getElementById('tbody-xem-tinh-trang-phong')
		const table = document.getElementById('table-xem-tinh-trang-phong')
		const containerTable = document.getElementById('container-table-xem-tinh-trang-phong')
		const thead = document.getElementById('thead-xem-tinh-trang-phong')
		console.log('XemTinhTrangPhong:', xemTTP)
		newContentXemTinhTrangPhong.current = []
		for(let i=0; i<contentXemTinhTrangPhong.content.length; i++) {
			const ttp = contentXemTinhTrangPhong.content[i]
			let flag = 1
			for(let j=0; j<9; j++) {
				if(xemTTP[j].length>0){
					let regex = new RegExp(xemTTP[j],"i")
					if(ttp[j].toString().search(regex)===-1){
						flag = 0
					}
				}
			}
			if (xemTTP[9]==='con trong' && ttp[9]==0) {flag=0}
			if (xemTTP[9]==='khong trong' && ttp[9]!=0) {flag=0}
			if(flag===1) {
				// table.scrollIntoView()
				// containerTable.scrollTo(0,td.offsetTop-thead.offsetHeight)
				// Tr.classList.add('w3-yellow')
				newContentXemTinhTrangPhong.current.push(ttp)
			}
		}
		table.removeChild(tbodyTableTienPhong)
		const newtbodyTableTienPhong = document.createElement('tbody')
		newtbodyTableTienPhong.id = 'tbody-xem-tinh-trang-phong'
		table.appendChild(newtbodyTableTienPhong)
		let num = 20
		const numXemTTP = newContentXemTinhTrangPhong.current.length
		if(numXemTTP < 20) {num = numXemTTP}
		for(let i=0; i<num; i++) {
			const tr = document.createElement('tr')
			for(let j=0; j<10; j++) {
				const td = document.createElement('td')
				td.textContent = newContentXemTinhTrangPhong.current[i][j]
				tr.appendChild(td)
			}
			newtbodyTableTienPhong.appendChild(tr)
		}
		numContent.current = num
		document.getElementById('ket-qua-xem-ttp').innerText = 'Kết quả: ' + numXemTTP
	}
	return (
		<>
			{/* Menu tìm kiếm và số lượng kết quả*/}
			<div 
			className="w3-panel w3-card w3-padding"
			>
				{/* Menu tìm kiếm */}
				<div className="w3-content" style={{maxWidth: '50vw'}} id="search-menu">
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo"htmlFor="tinh-trang-phong-xem-ttp"
						>Tình trạng phòng:</label>
							<select className="w3-half w3-mobile" id="tinh-trang-phong-xem-ttp">
								<option value=""></option>
								<option value="Đang sử dụng">Đang sử dụng</option>
								<option value="Không còn sử dụng">Không còn sử dụng</option>
								<option value="Đang sửa chữa">Đang sửa chữa</option>
							</select>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="ma-day-xem-ttp"
						>Mã dãy:</label>
						<select className="w3-half w3-mobile" id="ma-day-xem-ttp">
							<option value=""></option>
							{contentXemTinhTrangPhong.mangMaDay.map((item, idx) => {
								return (
									<option key={idx} value={item}>{item}</option>
								)
							})}
						</select>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="ma-phong-xem-ttp"
						>Mã phòng:</label>
						<input type="text" className="w3-half w3-mobile" id="ma-phong-xem-ttp" />
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo"
						htmlFor="ma-loai-xem-ttp" >Mã loại phòng:</label>
						<select className="w3-half w3-mobile"id="ma-loai-xem-ttp">
							<option value=""></option>
							{contentXemTinhTrangPhong.mangMaLoai.map((item, idx) => {
							 return (
								<option key={idx} value={item}>{item}</option>
							)})}
						</select>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile"htmlFor="tuy-chon-namnu-xem-ttp"
						>Phòng nam/nữ:</label>
						<select className="w3-half w3-mobile" id="tuy-chon-namnu-xem-ttp">
							<option value=""></option>
							<option value="Nam">Nam</option>
							<option value="Nữ">Nữ</option>
						</select>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="tuy-chon-xem-ttp">
						Tuỳ chọn chỗ ở:</label>
						<select className="w3-half w3-mobile"id="tuy-chon-xem-ttp">
							<option value=""></option>
							<option value="con trong">Còn trống</option>
							<option value="khong trong">Hết chỗ trống</option>
						</select>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo"htmlFor="suc-chua-xem-tinh-trang-phong"
						>Sức chứa:</label>
						<select className="w3-half w3-mobile" id="suc-chua-xem-tinh-trang-phong">
							<option value=""></option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="8">8</option>
							<option value="6">6</option>
						</select>
					</div>
				</div>
				{/*Số lượng kết quả và button tìm kiếm*/}
				<div
				className="w3-padding" id="button-search">
					<span className="w3-text-indigo" id="ket-qua-xem-ttp">Kết quả: {contentXemTinhTrangPhong.content.length}</span>
					<button className="w3-button w3-card w3-right w3-hover-indigo"
					onClick={handleXemTinhTrangPhong}>Tìm kiếm</button>
				</div>
			</div>
			{/*Bảng dữ liệu*/}
			<div className="w3-margin-top" id="container-table-xem-tinh-trang-phong"
			style={{ overflow: 'scroll', height: '500px'}}>
				<table className="w3-table w3-striped" id="table-xem-tinh-trang-phong">
					<thead className="w3-indigo" id="thead-xem-tinh-trang-phong" style={{position: 'sticky', top: 0}}>
						<tr>
							<th>Mã phòng</th>
							<th>Tên phòng</th>
							<th>Mã dãy</th>
							<th>Mã loại</th>
							<th>Đơn giá</th>
							<th>Phòng Nam/Nữ</th>
							<th>Trạng thái</th>
							<th>Sức chứa</th>
							<th>Đã ở</th>
							<th>Còn trống</th>
						</tr>
					</thead>
					<tbody id="tbody-xem-tinh-trang-phong">
						{contentXemTinhTrangPhong.content.slice(0,20).map((item, rowIndex) => {
							return (
								<tr key={rowIndex}>
									{Object.values(item).map((cell, cellIndex) => (
										<td key={cellIndex}>{cell}</td>
									))}
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		</>
	)
}