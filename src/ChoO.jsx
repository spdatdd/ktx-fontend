import { useRef, useEffect, useState } from "react"

export default function ChoO({ targetFound, handleSelectTr }) {
	const [contentChoO, setContentChoO] = useState([])
	const numContent = useRef(20)
	const newContentChoO = useRef([])
	console.log('ChoO render!')
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
		fetch("http://127.0.0.1:8080/cho-o", requestOptions)
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to fetch data');
				}
				return response.json(); // Trả về dữ liệu dưới dạng JSON
			})
			.then(data => {
				// Xử lý dữ liệu nhận được từ máy chủ
				setContentChoO(data)
			})
			.catch(error => {
				console.error('Error fetching data:', error);
				// Xử lý lỗi ở đây nếu cần thiết
			});
	}, []);
	
	useEffect(() => {
		function checkScrollChoO(){
			console.log('checkScrollChoO', numContent.current)
			let contentChoOLength = contentChoO.length
			const newContenChoOLength = newContentChoO.current.length
			let contentChoOData = contentChoO
			if (newContenChoOLength > 0) {
				contentChoOData = newContentChoO.current
				contentChoOLength = newContenChoOLength
			}
			// Kiểm tra nếu đã scroll tới cuối phần tử #table-content
			if ((numContent.current<contentChoOData.length) && (containerTable.scrollTop + containerTable.clientHeight >= containerTable.scrollHeight-10)) {
				// Tải thêm nội dung
				let numEnd = contentChoOLength-numContent.current
				if (numEnd>20){
					numEnd = 20
				}
				const tbodyTableChoO = document.getElementById('tbody-phong')
				for(let i=0; i<numEnd; i++) {
					const tr = document.createElement('tr')
					tr.addEventListener('click',(e) => handleSelectTr(e, "phong"))
					for(let j=0; j<6; j++) {
						const td = document.createElement('td')
						try {
							td.textContent = contentChoOData[(numContent.current)+i][j+1]
							tr.appendChild(td)
						} catch (err) {
							// Xử lý khi hết phần tử trong content[]
							break
						}
					}
					tbodyTableChoO.appendChild(tr)
				}
				if (numContent.current < contentChoOLength) {
					numContent.current += 20
				}
				if (numContent.current>=contentChoOLength) {
					numContent.current = contentChoOLength
				}
			}
		}
		// Lấy phần tử #table-content
		const containerTable = document.getElementById('container-table-cho-o');
		containerTable.addEventListener("scroll", checkScrollChoO)
		return () => containerTable.removeEventListener('scroll', checkScrollChoO)
	}, [contentChoO]);
	
	function handleChoO(mode) {
		if(targetFound.current) {
			targetFound.current.classList.remove('w3-yellow')
		}
		const maDay = document.getElementById('ma-day-cho-o')
		const maPhong = document.getElementById('ma-phong-cho-o')
		const maLoai = document.getElementById('ma-loai-phong-cho-o')
		const maSV = document.getElementById('ma-sinh-vien-cho-o')
		const ngayDuocDuyet = document.getElementById('ngay-duoc-duyet-cho-o')
		const ngayRutDon = document.getElementById('ngay-rut-don-cho-o')
		const choO = [maDay.value, maPhong.value, maLoai.value, maSV.value, ngayDuocDuyet.value, ngayRutDon.value]
		const tbodyTableChoO = document.getElementById('tbody-cho-o')
		const table = document.getElementById('table-cho-o')
		const containerTable = document.getElementById('container-table-cho-o')
		const thead = document.getElementById('thead-cho-o')
		if(mode=='add') {
			// Dữ liệu cần gửi
			var postData = {
				maDay : maDay.value, 
				maPhong : maPhong.value, 
				maLoai : maLoai.value, 
				mssv : maSV.value,
				ngayDuocDuyet : ngayDuocDuyet.value
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
			var url = 'http://127.0.0.1:8080/cho-o';
			// Gửi yêu cầu POST
			fetch(url, requestOptions)
				.then(response => {
					if (!response.ok) {
						throw new Error('Failed to send POST request');
					}
					return response.text()
				})
				.then(data_id => {
					// response.ok
					contentChoO.push([parseInt(data_id), ...choO])
					const tr = document.createElement('tr')
					tr.addEventListener('click',(e) => handleSelectTr(e, 'cho-o'))
					for(let i=0; i<6; i++) {
						const td = document.createElement('td')
						td.innerText = choO[i]
						tr.appendChild(td)
					}
					tbodyTableChoO.appendChild(tr)
					numContent.current += 1
				})
				.catch(error => {
					console.error('Error sending POST request:', error);
					// Xử lý lỗi ở đây nếu cần thiết
				});
		} else if(mode=='modify') {
			console.log('targetFound.current: ', targetFound.current)
			for(let i=0; i<tbodyTableChoO.childNodes.length; i++) {
				const Tr = tbodyTableChoO.childNodes[i]
				if(Tr.childNodes[1].innerText===targetFound.current.childNodes[1].innerText &&
					Tr.childNodes[3].innerText===targetFound.current.childNodes[3].innerText){
					for(let k=0; k<contentChoO.length; k++){
						if(contentChoO[k][2]===targetFound.current.childNodes[1].innerText &&
							contentChoO[k][4]===targetFound.current.childNodes[3].innerText){
							const id = contentChoO[k][0]
							// Dữ liệu cần gửi
							var putData = {
								maDay : maDay.value, 
								maPhong : maPhong.value, 
								maLoai : maLoai.value, 
								mssv : maSV.value,
								id: id,
								ngayDuocDuyet : ngayDuocDuyet.value,
								ngayRutDon : ngayRutDon.value
							};
							console.log(contentChoO,putData)
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
							var url = 'http://127.0.0.1:8080/cho-o';
							// Gửi yêu cầu POST
							fetch(url, requestOptions)
								.then(response => {
									if (!response.ok) {
										throw new Error('Failed to send PUT request');
									}
									return response
								})
								.then(data => {
									// response.ok
									console.log(data)
									for(let j=0; j<Tr.childNodes.length; j++) {
										Tr.childNodes[j].innerText = choO[j]
									}
									contentChoO[k] = [id, ...choO]
									targetFound.current = Tr
								})
								.catch(error => {
									console.error('Error sending PUT request:', error);
									// Xử lý lỗi ở đây nếu cần thiết
								});
							break
						}
					}
					break
				}
			}
		} else if(mode=='delete') {
			for(let i=0; i<tbodyTableChoO.childNodes.length; i++) {
				const Tr = tbodyTableChoO.childNodes[i]
				if(Tr.childNodes[1].innerText===targetFound.current.childNodes[1].innerText &&
					Tr.childNodes[3].innerText===targetFound.current.childNodes[3].innerText){
					for(let k=0; k<contentChoO.length; k++){
						if(contentChoO[k][2]===targetFound.current.childNodes[2].innerText &&
							contentChoO[k][4]===targetFound.current.childNodes[4].innerText){
							const id = contentChoO[k][0]
							// Dữ liệu cần gửi
							var delData = {
								id : id
							};
							console.log(delData)
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
							var url = 'http://127.0.0.1:8080/cho-o';
							// Gửi yêu cầu POST
							fetch(url, requestOptions)
								.then(response => {
									if (!response.ok) {
										throw new Error('Failed to send DEL request');
									return response
									}
								})
								.then(data => {
										// response.ok
										console.log(data)
										contentChoO.splice(k,1)
										tbodyTableChoO.removeChild(Tr)
										maDay.value = maPhong.value = maLoai.value = maSV.value = ''
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
			console.log('choO: '+choO)
			newContentChoO.current = []
			for(let i=0; i<contentChoO.length; i++) {
				const p = contentChoO[i]
				let flag = 1
				for(let j=0; j<6; j++) {
					if(choO[j].length>0){
						let regex = new RegExp(choO[j],"i")
						if(p[j+1].toString().search(regex)===-1){
							flag = 0
						}
					}
				}
				if(flag===1) {
					// table.scrollIntoView()
					// containerTable.scrollTo(0,td.offsetTop-thead.offsetHeight)
					// Tr.classList.add('w3-yellow')
					newContentChoO.current.push(p)
				}
			}
			console.log('newContentChoO.current: '+newContentChoO.current)
			table.removeChild(tbodyTableChoO)
			const newtbodyTableChoO = document.createElement('tbody')
			newtbodyTableChoO.id = 'tbody-cho-o'
			table.appendChild(newtbodyTableChoO)
			let num = 20
			const numPhong = newContentChoO.current.length
			if(numPhong < 20) {num = numPhong}
			for(let i=0; i<num; i++) {
				const tr = document.createElement('tr')
				tr.addEventListener('click',(e) => handleSelectTr(e, "cho-o"))
				for(let j=0; j<6; j++) {
					const td = document.createElement('td')
					td.textContent = newContentChoO.current[i][j+1]
					tr.appendChild(td)
				}
				newtbodyTableChoO.appendChild(tr)
			}
			numContent.current = num
			document.getElementById('ket-qua-cho-o').innerText = 'Kết quả: ' + numPhong
		} else {
			newContentChoO.current = []
			maDay.value = maPhong.value = maLoai.value = maSV.value = ''
			table.removeChild(tbodyTableChoO)
			const newtbodyTableChoO = document.createElement('tbody')
			newtbodyTableChoO.id = 'tbody-cho-o'
			table.appendChild(newtbodyTableChoO)
			let num = 20
			const numPhong = contentChoO.length
			if(numPhong < 20) {num = numPhong}
			for(let i=0; i<num; i++) {
				const tr = document.createElement('tr')
				tr.addEventListener('click',(e) => handleSelectTr(e, "cho-o"))
				for(let j=0; j<6; j++) {
					const td = document.createElement('td')
					td.textContent = contentChoO[i][j+1]
					tr.appendChild(td)
				}
				newtbodyTableChoO.appendChild(tr)
			}
			numContent.current = num
			document.getElementById('ket-qua-cho-o').innerText = 'Kết quả: 0'
		}
	}
	
	return (
		<div>
			{/* Menu tìm kiếm và số lượng kết quả*/}
			<div 
			className="w3-panel w3-card w3-padding"
			>
				{/* Menu tìm kiếm */}
				<div className="w3-content" style={{maxWidth: '60vw'}} id="search-menu-cho-o">
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="ma-day-cho-o"
						>Mã dãy:</label>
						<input type="text" className="w3-half w3-mobile" id="ma-day-cho-o"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="ma-phong-cho-o"
						>Mã phòng:</label>
						<input type="text" className="w3-half w3-mobile" id="ma-phong-cho-o"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo"
						htmlFor="ma-loai-phong-cho-o">Mã loại phòng:</label>
						<input type="text" className="w3-half w3-mobile"id="ma-loai-phong-cho-o"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo"
						htmlFor="ma-sinh-vien-cho-o">Mã sinh viên:</label>
						<input type="text" className="w3-half w3-mobile"id="ma-sinh-vien-cho-o"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo"
						htmlFor="ngay-duoc-duyet-cho-o">Ngày được duyệt:</label>
						<input type="date" className="w3-half w3-mobile"id="ngay-duoc-duyet-cho-o"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo"
						htmlFor="ngay-rut-don-cho-o">Ngày rút đơn ở:</label>
						<input type="date" className="w3-half w3-mobile"id="ngay-rut-don-cho-o"/>
					</div>
				</div>
				{/*Số lượng kết quả và button tìm kiếm*/}
				<div className="w3-margin-top w3-margin-bottom">
					<span className="w3-text-indigo w3-left" id="ket-qua-cho-o">Kết quả: {contentChoO.length}</span>
					<div className="w3-right">
						<button className="w3-button w3-card w3-margin-left"
						onClick={()=>handleChoO('clear')}>Làm mới</button>
						<button className="w3-button w3-card w3-margin-left"
						onClick={()=>handleChoO('add')}>Thêm</button>
						<button className="w3-button w3-card w3-margin-left w3-margin-right"
						onClick={()=>handleChoO('modify')}>Sửa</button>
						<button className="w3-button w3-card w3-margin-right"
						onClick={()=>handleChoO('delete')}>Xoá</button>
						<button className="w3-button w3-card"
						onClick={()=>handleChoO('find')}>Tìm</button>
					</div>
				</div>
			</div>
			{/*Bảng dữ liệu*/}
			<div className="w3-margin-top" id="container-table-cho-o"
			style={{ overflow: 'scroll', height: '500px'}}>
				<table className="w3-table w3-striped" id="table-cho-o">
					<thead className="w3-indigo" id="thead-cho-o" style={{position: 'sticky', top: 0}}>
						<tr>
							<th>Mã dãy</th>
							<th>Mã phòng</th>
							<th>Mã loại phòng</th>
							<th>Mã sinh viên</th>
							<th>Ngày được duyệt</th>
							<th>Ngày rút đơn</th>
						</tr>
					</thead>
					<tbody id="tbody-cho-o">
						{contentChoO.slice(0,20).map((item, rowIndex) => {
							return (
								<tr key={rowIndex} onClick={(e) => handleSelectTr(e, 'cho-o')}>
									{item.map((cell, cellIndex) => {
										if (cellIndex === 0) return null;
										return (
											<td key={cellIndex}>{cell}</td>
										)
									})}
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		</div>
	)
}