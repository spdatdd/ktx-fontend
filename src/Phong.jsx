import { useRef, useEffect, useState } from "react"

export default function Phong({ targetFound, handleSelectTr }) {
	const [contentPhong, setContentPhong] = useState([])
	const numContent = useRef(20)
	const newContentPhong = useRef([])
	console.log('Phong render')
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
		fetch("http://127.0.0.1:8080/phong", requestOptions)
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to fetch data');
				}
				return response.json(); // Trả về dữ liệu dưới dạng JSON
			})
			.then(data => {
				// Xử lý dữ liệu nhận được từ máy chủ
				setContentPhong(data)
			})
			.catch(error => {
				console.error('Error fetching data:', error);
				// Xử lý lỗi ở đây nếu cần thiết
			});
	}, []);

	useEffect(() => {
		function checkScrollPhong(){
			console.log('checkScrollPhong', numContent.current)
			let contentPhongLength = contentPhong.length
			const newContenPhongLength = newContentPhong.current.length
			let contentPhongData = contentPhong
			if (newContenPhongLength > 0) {
				contentPhongData = newContentPhong.current
				contentPhongLength = newContenPhongLength
			}
			// Kiểm tra nếu đã scroll tới cuối phần tử #table-content
			if ((numContent.current<contentPhongData.length) && (containerTable.scrollTop + containerTable.clientHeight >= containerTable.scrollHeight-10)) {
				// Tải thêm nội dung
				let numEnd = contentPhongLength-numContent.current
				if (numEnd>20){
					numEnd = 20
				}
				const tbodyTablePhong = document.getElementById('tbody-phong')
				for(let i=0; i<numEnd; i++) {
					const tr = document.createElement('tr')
					tr.addEventListener('click',(e) => handleSelectTr(e, "phong"))
					for(let j=0; j<8; j++) {
						const td = document.createElement('td')
						try {
							td.textContent = contentPhongData[(numContent.current)+i][j]
							tr.appendChild(td)
						} catch (err) {
							// Xử lý khi hết phần tử trong content[]
							break
						}
					}
					tbodyTablePhong.appendChild(tr)
				}
				if (numContent.current < contentPhongLength) {
					numContent.current += 20
				}
				if (numContent.current>=contentPhongLength) {
					numContent.current = contentPhongLength
				}
			}
		}
		// Lấy phần tử #table-content
		const containerTable = document.getElementById('container-table-phong');
		containerTable.addEventListener("scroll", checkScrollPhong)
		return () => containerTable.removeEventListener('scroll', checkScrollPhong)
	}, []);

	function handlePhong(mode) {
		if(targetFound.current) {
			targetFound.current.classList.remove('w3-yellow')
		}
		const maPhong = document.getElementById('ma-phong')
		const tenPhong = document.getElementById('ten-phong')
		const maDay = document.getElementById('ma-day')
		const maLoai = document.getElementById('ma-loai')
		const donGia = document.getElementById('don-gia')
		const tuyChonNamNu = document.getElementById('tuy-chon-nam-nu')
		const trangThaiPhong = document.getElementById('trang-thai-phong')
		const sucChua = document.getElementById('suc-chua')
		const phong = [maPhong.value, tenPhong.value, maDay.value, maLoai.value, donGia.value, tuyChonNamNu.value, trangThaiPhong.value, sucChua.value]
		const tbodyTablePhong = document.getElementById('tbody-phong')
		const table = document.getElementById('table-phong')
		const containerTable = document.getElementById('container-table-phong')
		const thead = document.getElementById('thead-phong')
		if(mode=='add') {
			const postData = {
				maPhong : maPhong.value,
				tenPhong : tenPhong.value, 
				maDay : maDay.value, 
				maLoai : maLoai.value, 
				donGia : donGia.value, 
				tuyChonNamNu : tuyChonNamNu.value, 
				trangThaiPhong : trangThaiPhong.value, 
				sucChua : sucChua.value
			}
			console.log('postData phong:', postData)
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
			var url = 'http://127.0.0.1:8080/phong';
			// Gửi yêu cầu POST
			fetch(url, requestOptions)
				.then(response => {
					if (!response.ok) {
						throw new Error('Failed to send POST request');
					}
					return response
				})
				.then(data => {
					console.log('add phong response:', data)
					contentPhong.push(phong)
					const tr = document.createElement('tr')
					tr.addEventListener('click',(e) => handleSelectTr(e, 'phong'))
					for(let i=0; i<8; i++) {
						const td = document.createElement('td')
						td.innerText = phong[i]
						tr.appendChild(td)
					}
					tbodyTablePhong.appendChild(tr)
					numContent.current += 1
				})
				.catch(error => {
					console.error('Error sending POST request:', error);
					// Xử lý lỗi ở đây nếu cần thiết
				});
		} else if(mode=='modify') {
			console.log('targetFound.current:', targetFound.current)
			for(let i=0; i<tbodyTablePhong.childNodes.length; i++) {
				const Tr = tbodyTablePhong.childNodes[i]
				if(Tr.childNodes[0].innerText==targetFound.current.childNodes[0].innerText){
					// Dữ liệu cần gửi
					var putData = {
						maPhong : maPhong.value, 
						tenPhong : tenPhong.value, 
						maDay : maDay.value, 
						maLoai : maLoai.value, 
						donGia : donGia.value, 
						tuyChonNamNu : tuyChonNamNu.value, 
						trangThaiPhong : trangThaiPhong.value, 
						sucChua : sucChua.value
					};
					console.log('putData phong', putData)
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
					var url = 'http://127.0.0.1:8080/phong';
					// Gửi yêu cầu POST
					fetch(url, requestOptions)
						.then(response => {
							if (!response.ok) {
								throw new Error('Failed to send PUT request');
							}
							return response
						})
						.then(data => {
							console.log('modify phong response:',data)
							for(let i=0; i<contentPhong.length; i++){
								if(contentPhong[i][0]===targetFound.current.childNodes[0].innerText) {
									contentPhong[i] = phong
								}
							}
							for(let j=0; j<Tr.childNodes.length; j++) {
								Tr.childNodes[j].innerText = phong[j]
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
			for(let i=0; i<tbodyTablePhong.childNodes.length; i++) {
				const Tr = tbodyTablePhong.childNodes[i]
				if(Tr.childNodes[0].innerText===maPhong.value){
					tbodyTablePhong.removeChild(Tr)
					for(let k=0; k<contentPhong.length; k++){
						if(contentPhong[k][0]===maPhong.value) {
							// Dữ liệu cần gửi
							var delData = {
								maPhong: maPhong.value
							};
							console.log('delData phong:', delData)
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
							var url = 'http://127.0.0.1:8080/phong';
							// Gửi yêu cầu POST
							fetch(url, requestOptions)
								.then(response => {
									if (!response.ok) {
										throw new Error('Failed to send DEL request');
									}
									return response
								})
								.then(data => {
									console.log('delete data reponse phong', data) 
									contentPhong.splice(k,1)
									maPhong.value = tenPhong.value = maDay.value = maLoai.value = donGia.value = tuyChonNamNu.value = trangThaiPhong.value = sucChua.value = ''
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
				}
			}
		} else if (mode=='find') {
			console.log('phong:', phong)
			newContentPhong.current = []
			for(let i=0; i<contentPhong.length; i++) {
				const p = contentPhong[i]
				let flag = 1
				for(let j=0; j<8; j++) {
					if(phong[j].length>0){
						let regex = new RegExp(phong[j],"i")
						if(p[j].toString().search(regex)===-1){
							flag = 0
						}
					}
				}
				if(flag===1) {
					// table.scrollIntoView()
					// containerTable.scrollTo(0,td.offsetTop-thead.offsetHeight)
					// Tr.classList.add('w3-yellow')
					newContentPhong.current.push(p)
				}
			}
			table.removeChild(tbodyTablePhong)
			const newtbodyTablePhong = document.createElement('tbody')
			newtbodyTablePhong.id = 'tbody-phong'
			table.appendChild(newtbodyTablePhong)
			let num = 20
			const numPhong = newContentPhong.current.length
			if(numPhong < 20) {num = numPhong}
			for(let i=0; i<num; i++) {
				const tr = document.createElement('tr')
				tr.addEventListener('click',(e) => handleSelectTr(e, "phong"))
				for(let j=0; j<8; j++) {
					const td = document.createElement('td')
					td.textContent = newContentPhong.current[i][j]
					tr.appendChild(td)
				}
				newtbodyTablePhong.appendChild(tr)
			}
			numContent.current = num
			document.getElementById('ket-qua-phong').innerText = 'Kết quả: ' + numPhong
		} else {
			newContentPhong.current = []
			maPhong.value = tenPhong.value = maDay.value = maLoai.value = donGia.value = tuyChonNamNu.value = trangThaiPhong.value = sucChua.value = ''
			table.removeChild(tbodyTablePhong)
			const newtbodyTablePhong = document.createElement('tbody')
			newtbodyTablePhong.id = 'tbody-phong'
			table.appendChild(newtbodyTablePhong)
			let num = 20
			const numPhong = contentPhong.length
			if(numPhong < 20) {num = numPhong}
			for(let i=0; i<num; i++) {
				const tr = document.createElement('tr')
				tr.addEventListener('click',(e) => handleSelectTr(e, "phong"))
				for(let j=0; j<8; j++) {
					const td = document.createElement('td')
					td.textContent = contentPhong[i][j]
					tr.appendChild(td)
				}
				newtbodyTablePhong.appendChild(tr)
			}
			numContent.current = num
			document.getElementById('ket-qua-phong').innerText = 'Kết quả: 0'
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
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="ma-phong">Mã phòng:</label>
						<input type="text" className="w3-half w3-mobile" id="ma-phong"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="ten-phong">Tên phòng:</label>
						<input type="text" className="w3-half w3-mobile" id="ten-phong"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="ma-day">Mã dãy:</label>
						<input type="text" className="w3-half w3-mobile" id="ma-day"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="ma-loai" >Mã loại phòng:</label>
						<input type="text" className="w3-half w3-mobile"id="ma-loai"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="don-gia" >Đơn giá:</label>
						<input type="number" className="w3-half w3-mobile"id="don-gia"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo"htmlFor="tuy-chon-nam-nu"
						>Phòng nam/nữ:</label>
						<select className="w3-half w3-mobile" id="tuy-chon-nam-nu">
							<option value=""></option>
							<option value="Nam">Nam</option>
							<option value="Nữ">Nữ</option>
						</select>
					</div>
					<div className="w3-row">
						<label
						className="w3-half w3-mobile w3-hover-indigo"htmlFor="trang-thai-phong"
						>Trạng thái phòng:</label>
							<select className="w3-half w3-mobile" id="trang-thai-phong">
								<option value=""></option>
								<option value="Đang sử dụng">Đang sử dụng</option>
								<option value="Không còn sử dụng">Không còn sử dụng</option>
								<option value="Đang sửa chữa">Đang sửa chữa</option>
							</select>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo"htmlFor="suc-chua"
						>Sức chứa:</label>
						<select className="w3-half w3-mobile" id="suc-chua">
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
				<div className="w3-margin-top w3-margin-bottom">
					<span className="w3-text-indigo w3-left" id="ket-qua-phong">Kết quả: {contentPhong.length}</span>
					<div className="w3-right">
						<button className="w3-button w3-card w3-margin-left"
						onClick={()=>handlePhong('clear')}>Làm mới</button>
						<button className="w3-button w3-card w3-margin-left"
						onClick={()=>handlePhong('add')}>Thêm</button>
						<button className="w3-button w3-card w3-margin-left w3-margin-right"
						onClick={()=>handlePhong('modify')}>Sửa</button>
						<button className="w3-button w3-card w3-margin-right"
						onClick={()=>handlePhong('delete')}>Xoá</button>
						<button className="w3-button w3-card"
						onClick={()=>handlePhong('find')}>Tìm</button>
					</div>
				</div>
			</div>
			{/*Bảng dữ liệu*/}
			<div className="w3-margin-top" id="container-table-phong"
			style={{ overflow: 'scroll', height: '500px'}}>
				<table className="w3-table w3-striped" id="table-phong">
					<thead className="w3-indigo" id="thead-phong" style={{position: 'sticky', top: 0}}>
						<tr>
							<th>Mã phòng</th>
							<th>Tên phòng</th>
							<th>Mã dãy</th>
							<th>Mã loại</th>
							<th>Đơn giá</th>
							<th>Phòng Nam/Nữ</th>
							<th>Trạng thái</th>
							<th>Sức chứa</th>
						</tr>
					</thead>
					<tbody id="tbody-phong">
						{contentPhong.slice(0,20).map((item, rowIndex) => {
							return (
								<tr key={rowIndex} onClick={(e) => handleSelectTr(e, 'phong')}>
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