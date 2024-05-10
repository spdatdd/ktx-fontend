import { useRef, useState, useEffect } from "react"

export default function SinhVien({ targetFound, handleSelectTr }) {
	const [contentSinhVien, setContentSinhVien] = useState([])
	const numContent = useRef(20)
	const newContentSinhVien = useRef([])
	console.log('SinhVien render!')
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
		fetch("http://127.0.0.1:8080/sinhvien", requestOptions)
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to fetch data');
				}
				return response.json(); // Trả về dữ liệu dưới dạng JSON
			})
			.then(data => {
				// Xử lý dữ liệu nhận được từ máy chủ
				setContentSinhVien(data)
			})
			.catch(error => {
				console.error('Error fetching data:', error);
				// Xử lý lỗi ở đây nếu cần thiết
			});
	}, []);
	useEffect(() => {
		function checkScrollSinhVien(){
			console.log('checkScrollSinhVien', numContent.current)
			let contentSvLength = contentSinhVien.length
			const newContenSvLength = newContentSinhVien.current.length
			let contentSvData = contentSinhVien
			if (newContenSvLength > 0) {
				contentSvData = newContentSinhVien.current
				contentSvLength = newContenSvLength
			}
			// Kiểm tra nếu đã scroll tới cuối phần tử #table-content
			if ((numContent.current<contentSvData.length) && (containerTable.scrollTop + containerTable.clientHeight >= containerTable.scrollHeight-10)) {
				// Tải thêm nội dung
				let numEnd = contentSvLength-numContent.current
				if (numEnd>20){
					numEnd = 20
				}
				const tbodyTableSv = document.getElementById('tbody-sinh-vien')
				for(let i=0; i<numEnd; i++) {
					const tr = document.createElement('tr')
					tr.addEventListener('click',(e) => handleSelectTr(e, "sinhvien"))
					for(let j=0; j<10; j++) {
						const td = document.createElement('td')
						try {
							td.textContent = contentSvData[(numContent.current)+i][j]
							tr.appendChild(td)
						} catch (err) {
							// Xử lý khi hết phần tử trong content[]
							break
						}
					}
					tbodyTableSv.appendChild(tr)
				}
				if (numContent.current < contentSvLength) {
					numContent.current += 20
				}
				if (numContent.current>=contentSvLength) {
					numContent.current = contentSvLength
				}
			}
		}
		// Lấy phần tử #table-content
		const containerTable = document.getElementById('container-table-sinh-vien');
		containerTable.addEventListener("scroll", checkScrollSinhVien)
		return () => containerTable.removeEventListener('scroll', checkScrollSinhVien)
	}, [contentSinhVien]);
	function handleSV(mode) {
		if(targetFound.current) {
			targetFound.current.classList.remove('w3-yellow')
		}
		const maSV = document.getElementById('ma-sinh-vien')
		const hoTen = document.getElementById('ho-ten-sv')
		const ngaySinh = document.getElementById('ngay-sinh')
		const nganh = document.getElementById('nganh-hoc')
		const diaChi = document.getElementById('dia-chi')
		const sdt = document.getElementById('sdt')
		const lop = document.getElementById('lop')
		const khoa = document.getElementById('khoa')
		const mail = document.getElementById('mail')
		const dien9sach = document.getElementById('dien-chinh-sach')
		const sinhVien = [hoTen.value, maSV.value, khoa.value, ngaySinh.value, nganh.value, lop.value, sdt.value, diaChi.value, mail.value, dien9sach.value]
		const tbodyTableSv = document.getElementById('tbody-sinh-vien')
		const table = document.getElementById('table-sinh-vien')
		const containerTable = document.getElementById('container-table-sinh-vien')
		const thead = document.getElementById('thead-sinh-vien')
		if(mode=='add') {
			// Dữ liệu cần gửi
			var postData = {
				mssv: maSV.value, 
				hoTen: hoTen.value, 
				sdt: sdt.value, 
				diaChi: diaChi.value, 
				khoa: khoa.value, 
				ngaySinh: ngaySinh.value, 
				nganh: nganh.value, 
				lop: lop.value, 
				mail: mail.value, 
				dien9sach: dien9sach.value
			};
			console.log(postData)
			// Tùy chọn cho yêu cầu POST
			var requestOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
					// Các headers khác nếu cần thiết
				},
				body: JSON.stringify(postData)
			};
			// URL của endpoint nhận yêu cầu POST
			var url = 'http://127.0.0.1:8080/sinhvien';
			// Gửi yêu cầu POST
			fetch(url, requestOptions)
				.then(response => {
					if (!response.ok) {
						throw new Error('Failed to send POST request');
					}
					return response
				})
				.then(data => {
					console.log('data response add sinhvien:',data)
					contentSinhVien.push(sinhVien)
					const tr = document.createElement('tr')
					tr.addEventListener('click',(e) => handleSelectTr(e, "sinhvien"))
					for(let i=0; i<10; i++) {
						const td = document.createElement('td')
						td.innerText = sinhVien[i]
						tr.appendChild(td)
					}
					tbodyTableSv.appendChild(tr)
					numContent.current += 1
				})
				.catch(error => {
					console.error('Error sending POST request:', error);
					// Xử lý lỗi ở đây nếu cần thiết
				});
		} else if(mode=='modify') {
			for(let i=0; i<tbodyTableSv.childNodes.length; i++) {
				const Tr = tbodyTableSv.childNodes[i]
				if(Tr.childNodes[0].innerText===targetFound.current.childNodes[0].innerText){
					// Dữ liệu cần gửi
					var putData = {
						mssv: maSV.value, 
						hoTen: hoTen.value, 
						sdt: sdt.value, 
						diaChi: diaChi.value, 
						khoa: khoa.value, 
						ngaySinh: ngaySinh.value, 
						nganh: nganh.value, 
						lop: lop.value, 
						mail: mail.value, 
						dien9sach: dien9sach.value
					};
					console.log('putData sinhvien:', putData)
					// Tùy chọn cho yêu cầu POST
					var requestOptions = {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json'
							// Các headers khác nếu cần thiết
						},
						body: JSON.stringify(putData)
					};
					// URL của endpoint nhận yêu cầu PUT
					var url = 'http://127.0.0.1:8080/sinhvien';
					// Gửi yêu cầu POST
					fetch(url, requestOptions)
						.then(response => {
							if (!response.ok) {
								throw new Error('Failed to send PUT request');
							}
							return response
						})
						.then(data => {
							console.log('data response put sinhvien:', data)
							for(let i=0; i<contentSinhVien.length; i++){
								if(contentSinhVien[i][0]===targetFound.current.childNodes[0].innerText) {
									contentSinhVien[i] = sinhVien
								}
							}
							for(let j=0; j<Tr.childNodes.length; j++) {
								Tr.childNodes[j].innerText = sinhVien[j]
							}
						})
						.catch(error => {
							console.error('Error sending PUT request:', error);
							// Xử lý lỗi ở đây nếu cần thiết
						});
					break
				}
			}
		} else if(mode=='delete') {
			for(let i=0; i<tbodyTableSv.childNodes.length; i++) {
				const Tr = tbodyTableSv.childNodes[i]
				if(Tr.childNodes[0].innerText===maSV.value){
					for(let k=0; k<contentSinhVien.length; k++){
						if(contentSinhVien[k][0]===maSV.value) {
							// Dữ liệu cần gửi
							var delData = {
								mssv: maSV.value
							};
							console.log('delData sinhvien:', delData)
							// Tùy chọn cho yêu cầu POST
							var requestOptions = {
								method: 'DELETE',
								headers: {
									'Content-Type': 'application/json'
									// Các headers khác nếu cần thiết
								},
								body: JSON.stringify(delData)
							};
							// URL của endpoint nhận yêu cầu DEL
							var url = 'http://127.0.0.1:8080/sinhvien';
							// Gửi yêu cầu POST
							fetch(url, requestOptions)
								.then(response => {
									if (!response.ok) {
										throw new Error('Failed to send DEL request');
									}
									return response
								})
								.then(data => {
									console.log('data response delete sinhvien:', data)
									contentSinhVien.splice(k,1)
									tbodyTableSv.removeChild(Tr)
									hoTen.value = maSV.value = khoa.value = ngaySinh.value = nganh.value = lop.value = sdt.value = diaChi.value = mail.value = dien9sach.value = ''
									targetFound.current = null
									numContent.current -= 1
								})
								.catch(error => {
									console.error('Error sending DEL request:', error);
									// Xử lý lỗi ở đây nếu cần thiết
								});
							break
						}
					}
					break
				}
			}
		} else if (mode=='find') {
			console.log(sinhVien)
			newContentSinhVien.current = []
			for(let i=0; i<contentSinhVien.length; i++) {
				const sv = contentSinhVien[i]
				let flag = 1
				for(let j=0; j<10; j++) {
					if(sinhVien[j].length>0){
						let regex = new RegExp(sinhVien[j],"i")
						if(sv[j].toString().search(regex)===-1){
							flag = 0
						}
					}
				}
				if(flag===1) {
					// table.scrollIntoView()
					// containerTable.scrollTo(0,td.offsetTop-thead.offsetHeight)
					// Tr.classList.add('w3-yellow')
					newContentSinhVien.current.push(sv)
				}
			}
			table.removeChild(tbodyTableSv)
			const newTbodyTableSv = document.createElement('tbody')
			newTbodyTableSv.id = 'tbody-sinh-vien'
			table.appendChild(newTbodyTableSv)
			let num = 20
			const numSinhVien = newContentSinhVien.current.length
			if(numSinhVien < 20) {num = numSinhVien}
			for(let i=0; i<num; i++) {
				const tr = document.createElement('tr')
				tr.addEventListener('click',(e) => handleSelectTr(e, "sinhvien"))
				for(let j=0; j<10; j++) {
					const td = document.createElement('td')
					td.textContent = newContentSinhVien.current[i][j]
					tr.appendChild(td)
				}
				newTbodyTableSv.appendChild(tr)
			}
			numContent.current = num
			document.getElementById('ket-qua-sinh-vien').innerText = 'Kết quả: ' + numSinhVien
		} else {
			newContentSinhVien.current = []
			hoTen.value = maSV.value = khoa.value = ngaySinh.value = nganh.value = lop.value = sdt.value = diaChi.value = mail.value = dien9sach.value = ''
			table.removeChild(tbodyTableSv)
			const newTbodyTableSv = document.createElement('tbody')
			newTbodyTableSv.id = 'tbody-sinh-vien'
			table.appendChild(newTbodyTableSv)
			let num = 20
			const numSinhVien = contentSinhVien.length
			if(numSinhVien < 20) {num = numSinhVien}
			for(let i=0; i<num; i++) {
				const tr = document.createElement('tr')
				tr.addEventListener('click',(e) => handleSelectTr(e, "sinhvien"))
				for(let j=0; j<10; j++) {
					const td = document.createElement('td')
					td.textContent = contentSinhVien[i][j]
					tr.appendChild(td)
				}
				newTbodyTableSv.appendChild(tr)
			}
			numContent.current = num
			document.getElementById('ket-qua-sinh-vien').innerText = 'Kết quả: 0'
		}
	}
	return (
		<div>
			{/* Menu và thao tác*/}
			<div 
			className="w3-panel w3-card w3-padding"
			>
				{/* Menu */}
				<div id="search-menu-sinh-vien"
				className="w3-content" style={{maxWidth: '60vw'}}>
					{/* Mã sinh viên */}
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="ma-sinh-vien"
						>Mã sinh viên:</label>
						<input type="text" className="w3-half w3-mobile" id="ma-sinh-vien"/>
					</div>
					{/* Họ tên */}
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="ho-ten-sv"
						>Họ tên:</label>
						<input type="text" className="w3-half w3-mobile" id="ho-ten-sv"/>
					</div>
					{/* Ngày sinh */}
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="ngay-sinh"
						>Ngày sinh:</label>
						<input type="date" className="w3-half w3-mobile" id="ngay-sinh"/>
					</div>
					{/* Ngành */}
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="nganh-hoc"
						>Ngành học:</label>
						<input type="text" className="w3-half w3-mobile" id="nganh-hoc"/>
					</div>
					{/* Địa chỉ */}
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="dia-chi"
						>Địa chỉ:</label>
						<input type="text" className="w3-half w3-mobile" id="dia-chi"/>
					</div>
					{/* Số điện thoại */}
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="sdt"
						>Số điện thoại:</label>
						<input type="tel" className="w3-half w3-mobile" id="sdt"/>
					</div>
					{/* Lớp */}
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="lop"
						>Lớp:</label>
						<input type="text" className="w3-half w3-mobile" id="lop"/>
					</div>
					{/* Khoá */}
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="khoa"
						>Khoá học:</label>
						<input type="number" className="w3-half w3-mobile" id="khoa"/>
					</div>
					{/* Mail */}
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="mail"
						>Mail:</label>
						<input type="email" className="w3-half w3-mobile" id="mail"/>
					</div>
					{/* Diện chính sách */}
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="dien-chinh-sach"
						>Diện chính sách:</label>
						<input type="text" className="w3-half w3-mobile" id="dien-chinh-sach"/>
					</div>
				</div>
				{/* Thao tác và Kết quả tìm kiếm*/}
				<div className="w3-margin-top w3-margin-bottom">
					{/* Kết quả tìm kiếm */}
					<span id="ket-qua-sinh-vien" className="w3-text-indigo w3-left">Kết quả: {contentSinhVien.length}</span>
					{/* Thao tác */}
					<div className="w3-right">
						<button className="w3-button w3-card w3-margin-left"
						onClick={()=>handleSV('clear')}>Làm mới</button>
						<button className="w3-button w3-card w3-margin-left"
						onClick={()=>handleSV('add')}>Thêm</button>
						<button className="w3-button w3-card w3-margin-left w3-margin-right"
						onClick={()=>handleSV('modify')}>Sửa</button>
						<button className="w3-button w3-card w3-margin-right"
						onClick={()=>handleSV('delete')}>Xoá</button>
						<button className="w3-button w3-card"
						onClick={()=>handleSV('find')}>Tìm</button>
					</div>
				</div>
			</div>
			{/*Bảng dữ liệu*/}
			<div className="w3-margin-top" id="container-table-sinh-vien"
			style={{ overflow: 'scroll', height: '500px'}}>
				<table className="w3-table w3-striped" id="table-sinh-vien">
					<thead className="w3-indigo" id="thead-sinh-vien" style={{position: 'sticky', top: 0}}>
						<tr>
							<th>Mã Sinh viên</th>
							<th>Họ tên</th>
							<th>Số điện thoại</th>
							<th>Hộ khẩu</th>
							<th>Khoá</th>
							<th>Ngày sinh</th>
							<th>Ngành</th>
							<th>Lớp</th>
							<th>Mail</th>
							<th>Diện chính sách</th>
						</tr>
					</thead>
					<tbody id="tbody-sinh-vien">
						{contentSinhVien.slice(0,20).map((item, rowIndex) => {
							return (
								<tr key={rowIndex} onClick={(e) => handleSelectTr(e, "sinhvien")}>
									{item.map((cell, cellIndex) => (
										<td key={cellIndex}>{cell}</td>
									))}
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		</div>
	)
}