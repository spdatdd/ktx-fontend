import { useRef, useEffect, useState } from "react"

export default function TienPhong({ targetFound, handleSelectTr }) {
	const [contentTienPhong, setContentTienPhong] = useState([])
	let numContent = useRef(20)
	const newContentTienPhong = useRef([])
	console.log('TienPhong render!')
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
		fetch("http://127.0.0.1:8080/tien-phong", requestOptions)
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to fetch data');
				}
				return response.json(); // Trả về dữ liệu dưới dạng JSON
			})
			.then(data => {
				// Xử lý dữ liệu nhận được từ máy chủ
				setContentTienPhong(data)
			})
			.catch(error => {
				console.error('Error fetching data:', error);
				// Xử lý lỗi ở đây nếu cần thiết
			});
	}, []);
	useEffect(() => {
		function checkScrollTienPhong(){
			console.log('checkScrollTienPhong', numContent.current)
			let contentTienPhongLength = contentTienPhong.length
			const newContenTienPhongLength = newContentTienPhong.current.length
			let contentTienPhongData = contentTienPhong
			if (newContenTienPhongLength > 0) {
				contentTienPhongData = newContentTienPhong.current
				contentTienPhongLength = newContenTienPhongLength
			}
			// Kiểm tra nếu đã scroll tới cuối phần tử #table-content
			if ((numContent.current<contentTienPhongData.length) && (containerTable.scrollTop + containerTable.clientHeight >= containerTable.scrollHeight-10)) {
				// Tải thêm nội dung
				let numEnd = contentTienPhongLength-numContent.current
				if (numEnd>20){
					numEnd = 20
				}
				const tbodyTableTienPhong = document.getElementById('tbody-tien-phong')
				for(let i=0; i<numEnd; i++) {
					const tr = document.createElement('tr')
					tr.addEventListener('click',(e) => handleSelectTr(e, "tien-phong"))
					for(let j=0; j<9; j++) {
						const td = document.createElement('td')
						try {
							td.textContent = contentTienPhongData[(numContent.current)+i][j]
							tr.appendChild(td)
						} catch (err) {
							// Xử lý khi hết phần tử trong content[]
							break
						}
					}
					tbodyTableTienPhong.appendChild(tr)
				}
				if (numContent.current < contentTienPhongLength) {
					numContent.current += 20
				}
				if (numContent.current>=contentTienPhongLength) {
					numContent.current = contentTienPhongLength
				}
			}
		}
		// Lấy phần tử #table-content
		const containerTable = document.getElementById('container-table-tien-phong');
		containerTable.addEventListener("scroll", checkScrollTienPhong)
		return () => containerTable.removeEventListener('scroll', checkScrollTienPhong)
	}, []);
	
	function handleTienPhong(mode) {
		if(targetFound.current) {
			targetFound.current.classList.remove('w3-yellow')
		}
		const maDay = document.getElementById('ma-day-tien-phong')
		const maPhong = document.getElementById('ma-phong-tien-phong')
		const maLoai = document.getElementById('ma-loai-tien-phong')
		const soTien = document.getElementById('so-tien-phong')
		const hocKy = document.getElementById('hoc-ky')
		const namHoc = document.getElementById('nam-hoc')
		const maSinhVien = document.getElementById('ma-sinh-vien-tien-phong')
		const hoTenSinhVien = document.getElementById('ho-ten-sv-tien-phong')
		let trangThaiDongPhi = document.getElementById('da-dong-phi-phong').checked
		if (trangThaiDongPhi===true) {
			trangThaiDongPhi = 'đã đóng'
		} else {
			trangThaiDongPhi = 'chưa'
		}
		const tienPhong = [maDay.value, maPhong.value, maLoai.value, soTien.value, hocKy.value, namHoc.value, maSinhVien.value, hoTenSinhVien.value, trangThaiDongPhi]
		const tbodyTableTienPhong = document.getElementById('tbody-tien-phong')
		const table = document.getElementById('table-tien-phong')
		const containerTable = document.getElementById('container-table-tien-phong')
		const thead = document.getElementById('thead-tien-phong')
		if(mode=='add') {
			// Dữ liệu cần gửi
			var postData = {
				maDay : maDay.value, 
				maPhong : maPhong.value,
				maLoai : maLoai.value, 
				soTien : soTien.value, 
				hocKy : hocKy.value, 
				namHoc : namHoc.value, 
				mssv: maSinhVien.value, 
				hoTen : hoTenSinhVien.value,
				trangThaiDongPhi : trangThaiDongPhi
			};
			console.log('postData tienphong:', postData)
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
			var url = 'http://127.0.0.1:8080/tien-phong';
			// Gửi yêu cầu POST
			fetch(url, requestOptions)
				.then(response => {
					if (!response.ok) {
						throw new Error('Failed to send POST request');
					}
					return response
				})
				.then(data_id => {
					// response.ok
					contentTienPhong.push([parseInt(data_id), ...tienPhong])
					const tr = document.createElement('tr')
					tr.addEventListener('click',(e) => handleSelectTr(e, 'tien-phong'))
					for(let i=0; i<9; i++) {
						const td = document.createElement('td')
						td.innerText = tienPhong[i]
						tr.appendChild(td)
					}
					tbodyTableTienPhong.appendChild(tr)
					numContent.current += 1
				})
				.catch(error => {
					console.error('Error sending POST request:', error);
					// Xử lý lỗi ở đây nếu cần thiết
				});
		} else if(mode=='modify') {
			for(let i=0; i<tbodyTableTienPhong.childNodes.length; i++) {
				const Tr = tbodyTableTienPhong.childNodes[i]
				if(Tr.childNodes[4].innerText===targetFound.current.childNodes[4].innerText &&
					Tr.childNodes[5].innerText===targetFound.current.childNodes[5].innerText &&
					Tr.childNodes[6].innerText===targetFound.current.childNodes[6].innerText){
					for(let j=0; j<contentTienPhong.length; j++){
						if(contentTienPhong[j][5]===targetFound.current.childNodes[4].innerText &&
							contentTienPhong[j][6]===targetFound.current.childNodes[5].innerText &&
							contentTienPhong[j][7]===targetFound.current.childNodes[6].innerText) {
							const id = contentTienPhong[j][0]
							// Dữ liệu cần gửi
							var putData = {
								maDay : maDay.value, 
								maPhong : maPhong.value,
								maLoai : maLoai.value, 
								soTien : soTien.value, 
								hocKy : hocKy.value, 
								namHoc : namHoc.value, 
								mssv: maSinhVien.value, 
								hoTen : hoTenSinhVien.value,
								id: id,
								trangThaiDongPhi : trangThaiDongPhi
							};
							console.log('putData tienphong:', putData)
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
							var url = 'http://127.0.0.1:8080/tien-phong';
							// Gửi yêu cầu POST
							fetch(url, requestOptions)
								.then(response => {
									if (!response.ok) {
										throw new Error('Failed to send PUT request');
									}
									return response
								})
								.then(data => {
									console.log('data response put tienphong:', data)
									contentTienPhong[j] = [id, ...tienPhong]
									for(let k=0; k<Tr.childNodes.length; k++) {
										Tr.childNodes[k].innerText = tienPhong[k]
									}
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
			for(let i=0; i<tbodyTableTienPhong.childNodes.length; i++){
				const Tr = tbodyTableTienPhong.childNodes[i]
				if(Tr.childNodes[4].innerText===hocKy.value &&
					Tr.childNodes[5].innerText===namHoc.value &&
					Tr.childNodes[6].innerText===maSinhVien.value){
					for(let j=0; j<contentTienPhong.length; j++){
						if(contentTienPhong[j][5]===hocKy.value &&
							contentTienPhong[j][6]===namHoc.value &&
							contentTienPhong[j][7]===maSinhVien.value){
							const id = contentTienPhong[j][0]
							// Dữ liệu cần gửi
							var delData = {
								id : id
							};
							console.log('delData tienphong:', delData)
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
							var url = 'http://127.0.0.1:8080/tien-phong';
							// Gửi yêu cầu POST
							fetch(url, requestOptions)
								.then(response => {
									if (!response.ok) {
										throw new Error('Failed to send DEL request');
									}
									return response
								})
								.then(data => {
									console.log('data response delete tienphong:', data)
									contentTienPhong.splice(j,1)
									tbodyTableTienPhong.removeChild(Tr)
									maDay.value = maPhong.value = maLoai.value = soTien.value = hocKy.value = namHoc.value = maSinhVien.value = hoTenSinhVien.value = ''
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
			console.log('tienphong:', tienPhong)
			newContentTienPhong.current = []
			for(let i=0; i<contentTienPhong.length; i++) {
				const tp = contentTienPhong[i]
				let flag = 1
				for(let j=0; j<9; j++) {
					if(tienPhong[j].length>0){
						let regex = new RegExp(tienPhong[j],"i")
						if(tp[j+1].toString().search(regex)===-1){
							flag = 0
						}
					}
				}
				if(flag===1) {
					// table.scrollIntoView()
					// containerTable.scrollTo(0,td.offsetTop-thead.offsetHeight)
					// Tr.classList.add('w3-yellow')
					newContentTienPhong.current.push(tp)
				}
			}
			table.removeChild(tbodyTableTienPhong)
			const newtbodyTableTienPhong = document.createElement('tbody')
			newtbodyTableTienPhong.id = 'tbody-tien-phong'
			table.appendChild(newtbodyTableTienPhong)
			let num = 20
			const numTienPhong = newContentTienPhong.current.length
			if(numTienPhong < 20) {num = numTienPhong}
			for(let i=0; i<num; i++) {
				const tr = document.createElement('tr')
				tr.addEventListener('click',(e) => handleSelectTr(e, "tien-phong"))
				for(let j=0; j<9; j++) {
					const td = document.createElement('td')
					td.textContent = newContentTienPhong.current[i][j+1]
					tr.appendChild(td)
				}
				newtbodyTableTienPhong.appendChild(tr)
			}
			numContent.current = num
			document.getElementById('ket-qua-tien-phong').innerText = 'Kết quả: ' + numTienPhong
		} else {
			newContentTienPhong.current = []
			maDay.value = maPhong.value = maLoai.value = soTien.value = hocKy.value = namHoc.value = maSinhVien.value = hoTenSinhVien.value = namHoc.value = hocKy.value = ''
			document.getElementById('da-dong-phi-phong').checked = false
			document.getElementById('chua-dong-phi-phong').checked = false
			table.removeChild(tbodyTableTienPhong)
			const newtbodyTableTienPhong = document.createElement('tbody')
			newtbodyTableTienPhong.id = 'tbody-tien-phong'
			table.appendChild(newtbodyTableTienPhong)
			let num = 20
			const numTienPhong = contentTienPhong.length
			if(numTienPhong < 20) {num = numTienPhong}
			for(let i=0; i<num; i++) {
				const tr = document.createElement('tr')
				tr.addEventListener('click',(e) => handleSelectTr(e, "tien-phong"))
				for(let j=0; j<9; j++) {
					const td = document.createElement('td')
					td.textContent = contentTienPhong[i][j]
					tr.appendChild(td)
				}
				newtbodyTableTienPhong.appendChild(tr)
			}
			numContent.current = num
			document.getElementById('ket-qua-tien-phong').innerText = 'Kết quả: 0'
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
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="ma-day-tien-phong"
						>Mã dãy:</label>
						<input type="text" className="w3-half w3-mobile" id="ma-day-tien-phong"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="ma-phong-tien-phong"
						>Mã phòng:</label>
						<input type="text" className="w3-half w3-mobile" id="ma-phong-tien-phong"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo"
						htmlFor="ma-loai-tien-phong" >Mã loại phòng:</label>
						<input type="text" className="w3-half w3-mobile"id="ma-loai-tien-phong"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="so-tien-phong"
						>Số tiền:</label>
						<input type="number" className="w3-half w3-mobile" id="so-tien-phong"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="hoc-ky"
						>Học kỳ:</label>
						<input type="text" className="w3-half w3-mobile" id="hoc-ky"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="nam-hoc"
						>Năm học:</label>
						<input type="text" className="w3-half w3-mobile" id="nam-hoc"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="ma-sinh-vien-tien-phong"
						>Mã sinh viên:</label>
						<input type="text" className="w3-half w3-mobile" id="ma-sinh-vien-tien-phong"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="ho-ten-sv-tien-phong"
						>Họ tên sinh viên:</label>
						<input type="text" className="w3-half w3-mobile" id="ho-ten-sv-tien-phong"/>
					</div>
					<div className="w3-row">
						<label className="w3-half w3-mobile w3-hover-indigo" >Trạng thái đóng phí:</label>
						<div className="w3-half">
							<input type="radio" id="da-dong-phi-phong" name="trang-thai-dong-phi-phong" value="đã đóng" />
							<label className="w3-margin-right" htmlFor="da-dong-phi-phong">Đã đóng</label>
							<input type="radio" id="chua-dong-phi-phong" name="trang-thai-dong-phi-phong" value="chưa" />
							<label htmlFor="chua-dong-phi-phong">Chưa đóng</label>
						</div>
					</div>
				</div>
				{/*Số lượng kết quả và button tìm kiếm*/}
				<div className="w3-margin-top w3-margin-bottom">
					<span className="w3-text-indigo w3-left" id="ket-qua-tien-phong">Kết quả: {contentTienPhong.length}</span>
					<div className="w3-right">
						<button className="w3-button w3-card w3-margin-left"
						onClick={()=>handleTienPhong('clear')}>Làm mới</button>
						<button className="w3-button w3-card w3-margin-left"
						onClick={()=>handleTienPhong('add')}>Thêm</button>
						<button className="w3-button w3-card w3-margin-left w3-margin-right"
						onClick={()=>handleTienPhong('modify')}>Sửa</button>
						<button className="w3-button w3-card w3-margin-right"
						onClick={()=>handleTienPhong('delete')}>Xoá</button>
						<button className="w3-button w3-card"
						onClick={()=>handleTienPhong('find')}>Tìm</button>
					</div>
				</div>
			</div>
			{/*Bảng dữ liệu*/}
			<div className="w3-margin-top" id="container-table-tien-phong"
			style={{ overflow: 'scroll', height: '500px'}}>
				<table className="w3-table w3-striped" id="table-tien-phong">
					<thead className="w3-indigo" id="thead-tien-phong" style={{position: 'sticky', top: 0}}>
						<tr>
							<th>Mã dãy</th>
							<th>Mã phòng</th>
							<th>Mã loại phòng</th>
							<th>Số tiền</th>
							<th>Học kỳ</th>
							<th>Năm học</th>
							<th>Mã sinh viên</th>
							<th>Họ tên sinh viên</th>
							<th>Trạng thái đóng phí</th>
						</tr>
					</thead>
					<tbody id="tbody-tien-phong">
						{contentTienPhong.slice(0,20).map((item, rowIndex) => {
							return (
								<tr key={rowIndex} onClick={(e)=> handleSelectTr(e, 'tien-phong')}>
									{item.map((cell, cellIndex) => {
										if (cellIndex===0) return null
										return (<td key={cellIndex}>{cell}</td>)
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