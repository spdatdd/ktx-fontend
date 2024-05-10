import { useRef, useEffect, useState } from "react"

export default function DienNuoc({ targetFound, handleSelectTr }) {
	const [contentDienNuoc, setContentDienNuoc] = useState([])
	let numContent = useRef(20)
	const newContentDienNuoc = useRef([])
	console.log('DienNuoc render!')
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
		fetch("http://127.0.0.1:8080/dien-nuoc", requestOptions)
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to fetch data');
				}
				return response.json(); // Trả về dữ liệu dưới dạng JSON
			})
			.then(data => {
				// Xử lý dữ liệu nhận được từ máy chủ
				setContentDienNuoc(data)
			})
			.catch(error => {
				console.error('Error fetching data:', error);
				// Xử lý lỗi ở đây nếu cần thiết
			});
	}, []);
	
	useEffect(() => {
		function checkScrollDienNuoc(){
			console.log('checkScrollDienNuoc', numContent.current)
			let contentDienNuocLength = contentDienNuoc.length
			const newContenDienNuocLength = newContentDienNuoc.current.length
			let contentDienNuocData = contentDienNuoc
			if (newContenDienNuocLength > 0) {
				contentDienNuocData = newContentDienNuoc.current
				contentDienNuocLength = newContenDienNuocLength
			}
			// Kiểm tra nếu đã scroll tới cuối phần tử #table-content
			if ((numContent.current<contentDienNuocData.length) && (containerTable.scrollTop + containerTable.clientHeight >= containerTable.scrollHeight-10)) {
				// Tải thêm nội dung
				let numEnd = contentDienNuocLength-numContent.current
				if (numEnd>20){
					numEnd = 20
				}
				const tbodyTableSv = document.getElementById('tbody-dien-nuoc')
				for(let i=0; i<numEnd; i++) {
					const tr = document.createElement('tr')
					tr.addEventListener('click',(e) => handleSelectTr(e, "dien-nuoc"))
					for(let j=0; j<12; j++) {
						const td = document.createElement('td')
						try {
							td.textContent = contentDienNuocData[(numContent.current)+i][j]
							tr.appendChild(td)
						} catch (err) {
							// Xử lý khi hết phần tử trong content[]
							break
						}
					}
					tbodyTableSv.appendChild(tr)
				}
				if (numContent.current < contentDienNuocLength) {
					numContent.current += 20
				}
				if (numContent.current>=contentDienNuocLength) {
					numContent.current = contentDienNuocLength
				}
			}
		}
		// Lấy phần tử #table-content
		const containerTable = document.getElementById('container-table-dien-nuoc');
		containerTable.addEventListener("scroll", checkScrollDienNuoc)
		return () => containerTable.removeEventListener('scroll', checkScrollDienNuoc)
	}, []);
	function handleDN(mode) {
		if(targetFound.current) {
			targetFound.current.classList.remove('w3-yellow')
		}
		const maDay = document.getElementById('ma-day-dien-nuoc')
		const maPhong = document.getElementById('ma-phong-dien-nuoc')
		const maLoai = document.getElementById('ma-loai-dien-nuoc')
		const soKyDien = document.getElementById('so-ky-dien')
		const soKyNuoc = document.getElementById('so-ky-nuoc')
		const giaDien = document.getElementById('gia-dien')
		const giaNuoc = document.getElementById('gia-nuoc')
		const thoiGian = document.getElementById('thoi-gian-dien-nuoc')
		const hocKy = document.getElementById('hoc-ky-dien-nuoc')
		const namHoc = document.getElementById('nam-hoc-dien-nuoc')
		const tienDien = soKyDien.value*giaDien.value
		const tienNuoc = soKyNuoc.value*giaNuoc.value
		const tong = tienDien + tienNuoc
		let trangThaiDongPhi = document.getElementById('da-dong-phi-dien-nuoc').checked
		if (trangThaiDongPhi===true) {
			trangThaiDongPhi = 'đã đóng'
		} else {
			trangThaiDongPhi = 'chưa'
		}
		const dienNuoc = [maDay.value, maPhong.value, maLoai.value, soKyDien.value, soKyNuoc.value, tienDien, tienNuoc, tong, thoiGian.value, namHoc.value, hocKy.value, trangThaiDongPhi]
		const tbodyTableSv = document.getElementById('tbody-dien-nuoc')
		const table = document.getElementById('table-dien-nuoc')
		const containerTable = document.getElementById('container-table-dien-nuoc')
		const thead = document.getElementById('thead-dien-nuoc')
		if(mode=='add') {
			// Dữ liệu cần gửi
			var postData = {
				thoiGian : thoiGian.value, 
				maDay : maDay.value, 
				maPhong : maPhong.value, 
				maLoai : maLoai.value, 
				soKyDien : soKyDien.value, 
				soKyNuoc : soKyNuoc.value, 
				tienDien : tienDien, 
				tienNuoc : tienNuoc, 
				tong : tong,
				hocKy : hocKy.value,
				namHoc : namHoc.value,
				trangThaiDongPhi : trangThaiDongPhi
			};
			console.log('postData diennuoc:', postData)
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
			var url = 'http://127.0.0.1:8080/dien-nuoc';
			// Gửi yêu cầu POST
			fetch(url, requestOptions)
				.then(response => {
					if (!response.ok) {
						throw new Error('Failed to send POST request');
					}
					return response
				})
				.then(data => {
					console.log('data response add diennuoc:',data)
					contentDienNuoc.push(dienNuoc)
					const tr = document.createElement('tr')
					tr.addEventListener('click',handleSelectTr)
					for(let i=0; i<12; i++) {
						const td = document.createElement('td')
						td.innerText = dienNuoc[i]
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
				if(Tr.childNodes[1].innerText===targetFound.current.childNodes[1].innerText &&
					Tr.childNodes[8].innerText===targetFound.current.childNodes[8].innerText){
					// Dữ liệu cần gửi
					var putData = {
						thoiGian : thoiGian.value, 
						maDay : maDay.value, 
						maPhong : maPhong.value, 
						maLoai : maLoai.value, 
						soKyDien : soKyDien.value, 
						soKyNuoc : soKyNuoc.value, 
						tienDien : tienDien, 
						tienNuoc : tienNuoc, 
						tong : tong,
						hocKy : hocKy.value,
						namHoc : namHoc.value,
						trangThaiDongPhi : trangThaiDongPhi
					};
					console.log('putData dienNuoc:', putData)
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
					var url = 'http://127.0.0.1:8080/dien-nuoc';
					// Gửi yêu cầu POST
					fetch(url, requestOptions)
						.then(response => {
							if (!response.ok) {
								throw new Error('Failed to send PUT request');
							}
							return response
						})
						.then(data => {
							console.log('data response put dienNuoc:', data)
							for(let i=0; i<contentDienNuoc.length; i++){
								if(contentDienNuoc[i][1]===targetFound.current.childNodes[1].innerText &&
									contentDienNuoc[i][8]===targetFound.current.childNodes[8].innerText) {
									contentDienNuoc[i] = dienNuoc
								}
							}
							for(let j=0; j<Tr.childNodes.length; j++) {
								Tr.childNodes[j].innerText = dienNuoc[j]
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
				if(Tr.childNodes[8].innerText===thoiGian.value &&
					Tr.childNodes[1].innerText===maPhong.value){
					for(let k=0; k<contentDienNuoc.length; k++){
						if(contentDienNuoc[k][8]===thoiGian.value &&
							contentDienNuoc[k][1]===maPhong.value) {
							// Dữ liệu cần gửi
							var delData = {
								thoiGian: thoiGian.value,
								maPhong: maPhong.value
							};
							console.log('delData diennuoc:', delData)
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
							var url = 'http://127.0.0.1:8080/dien-nuoc';
							// Gửi yêu cầu POST
							fetch(url, requestOptions)
								.then(response => {
									if (!response.ok) {
										throw new Error('Failed to send DEL request');
									}
									return response
								})
								.then(data => {
									console.log('data response delete diennuoc:', data)
									contentDienNuoc.splice(k,1)
									tbodyTableSv.removeChild(Tr)
									thoiGian.value, maDay.value = maPhong.value = maLoai.value = soKyDien.value = soKyNuoc.value = giaDien.value = giaNuoc.value = ''
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
			console.log('diennuoc:', dienNuoc)
			newContentDienNuoc.current = []
			for(let i=0; i<contentDienNuoc.length; i++) {
				let flag = 1
				const dn = contentDienNuoc[i]
				if(dn[1]!==dienNuoc[1] || dn[8]!==dienNuoc[8]) {flag=0}
				if (flag===1) {newContentDienNuoc.current.push(dn)}
			}
			table.removeChild(tbodyTableSv)
			const newTbodyTableSv = document.createElement('tbody')
			newTbodyTableSv.id = 'tbody-dien-nuoc'
			table.appendChild(newTbodyTableSv)
			let num = 20
			const numDienNuoc = newContentDienNuoc.current.length
			if(numDienNuoc < 20) {num = numDienNuoc}
			for(let i=0; i<num; i++) {
				const tr = document.createElement('tr')
				tr.addEventListener('click',(e) => handleSelectTr(e, "dien-nuoc"))
				for(let j=0; j<12; j++) {
					const td = document.createElement('td')
					td.textContent = newContentDienNuoc.current[i][j]
					tr.appendChild(td)
				}
				newTbodyTableSv.appendChild(tr)
			}
			numContent.current = num
			document.getElementById('ket-qua-dien-nuoc').innerText = 'Kết quả: ' + numDienNuoc
		} else {
			newContentDienNuoc.current = []
			thoiGian.value = maDay.value = maPhong.value = maLoai.value = soKyDien.value = soKyNuoc.value = giaDien.value = giaNuoc.value = namHoc.value = hocKy.value = ''
			document.getElementById('da-dong-phi-dien-nuoc').checked = false
			document.getElementById('chua-dong-phi-dien-nuoc').checked = false
			table.removeChild(tbodyTableSv)
			const newTbodyTableSv = document.createElement('tbody')
			newTbodyTableSv.id = 'tbody-dien-nuoc'
			table.appendChild(newTbodyTableSv)
			let num = 20
			const numDienNuoc = contentDienNuoc.length
			if(numDienNuoc < 20) {num = numDienNuoc}
			for(let i=0; i<num; i++) {
				const tr = document.createElement('tr')
				tr.addEventListener('click',(e) => handleSelectTr(e, "dien-nuoc"))
				for(let j=0; j<12; j++) {
					const td = document.createElement('td')
					td.textContent = contentDienNuoc[i][j]
					tr.appendChild(td)
				}
				newTbodyTableSv.appendChild(tr)
			}
			numContent.current = num
			document.getElementById('ket-qua-dien-nuoc').innerText = 'Kết quả: 0'
		}
	}
	return (
		<div className="">
			{/* Menu tìm kiếm và số lượng kết quả*/}
			<div 
			className="w3-panel w3-card w3-padding"
			>
				{/* Menu tìm kiếm */}
				<div className="w3-content" style={{maxWidth: '60vw'}} id="search-menu">
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="thoi-gian-dien-nuoc"
						>Thời gian:</label>
						<input type="date" className="w3-half w3-mobile" id="thoi-gian-dien-nuoc"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="ma-day-dien-nuoc"
						>Mã dãy:</label>
						<input type="text" className="w3-half w3-mobile" id="ma-day-dien-nuoc"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="ma-phong-dien-nuoc"
						>Mã phòng:</label>
						<input type="text" className="w3-half w3-mobile" id="ma-phong-dien-nuoc"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo"
						htmlFor="ma-loai-dien-nuoc" >Mã loại phòng:</label>
						<input type="text" className="w3-half w3-mobile"id="ma-loai-dien-nuoc"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="so-ky-dien"
						>Số ký điện:</label>
						<input type="number" className="w3-half w3-mobile" id="so-ky-dien"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="so-ky-nuoc"
						>Số ký nước:</label>
						<input type="number" className="w3-half w3-mobile" id="so-ky-nuoc"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="gia-dien"
						>Giá điện:</label>
						<input type="number" className="w3-half w3-mobile" id="gia-dien"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="gia-nuoc"
						>Giá nước:</label>
						<input type="number" className="w3-half w3-mobile" id="gia-nuoc"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="hoc-ky-dien-nuoc"
						>Học kỳ:</label>
						<input type="number" className="w3-half w3-mobile" id="hoc-ky-dien-nuoc"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="nam-hoc-dien-nuoc"
						>Năm học:</label>
						<input type="text" className="w3-half w3-mobile" id="nam-hoc-dien-nuoc"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" >Trạng thái đóng phí:</label>
						<div className="w3-half">
							<input type="radio" id="da-dong-phi-dien-nuoc" name="trang-thai-dong-phi-dien-nuoc" value="đã đóng" />
							<label className="w3-margin-right" htmlFor="da-dong-phi-dien-nuoc">Đã đóng</label>
							<input type="radio" id="chua-dong-phi-dien-nuoc" name="trang-thai-dong-phi-dien-nuoc" value="chưa" />
							<label htmlFor="chua-dong-phi-dien-nuoc">Chưa đóng</label>
						</div>
					</div>
				</div>
				{/*Số lượng kết quả và button tìm kiếm*/}
				<div className="w3-margin-top w3-margin-bottom">
					<span className="w3-text-indigo w3-left" id="ket-qua-dien-nuoc">Kết quả: {contentDienNuoc.length}</span>
					<div className="w3-right">
						<button className="w3-button w3-card w3-margin-left"
						onClick={()=>handleDN('clear')}>Làm mới</button>
						<button className="w3-button w3-card w3-margin-left"
						onClick={()=>handleDN('add')}>Thêm</button>
						<button className="w3-button w3-card w3-margin-left w3-margin-right"
						onClick={()=>handleDN('modify')}>Sửa</button>
						<button className="w3-button w3-card w3-margin-right"
						onClick={()=>handleDN('delete')}>Xoá</button>
						<button className="w3-button w3-card"
						onClick={()=>handleDN('find')}>Tìm</button>
					</div>
				</div>
			</div>
			{/*Bảng dữ liệu*/}
			<div className="w3-margin-top" id="container-table-dien-nuoc"
			style={{ overflow: 'scroll', height: '500px'}}>
				<table className="w3-table w3-striped" id="table-dien-nuoc">
					<thead className="w3-indigo" id="thead-dien-nuoc" style={{position: 'sticky', top: 0}}>
						<tr>
							<th>Mã dãy</th>
							<th>Mã phòng</th>
							<th>Mã loại</th>
							<th>Số ký điện</th>
							<th>Số ký nước</th>
							<th>Tiền điện</th>
							<th>Tiền nước</th>
							<th>Tổng</th>
							<th>Thời gian</th>
							<th>Năm học</th>
							<th>Học kỳ</th>
							<th>Trạng thái đóng phí</th>
						</tr>
					</thead>
					<tbody id="tbody-dien-nuoc">
						{contentDienNuoc.slice(0,20).map((item, rowIndex) => {
							return (
								<tr key={rowIndex} onClick={(e) => handleSelectTr(e, "dien-nuoc")}>
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