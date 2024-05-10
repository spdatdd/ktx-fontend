export default function Login() {
	document.title = 'Login'
	console.log('Login render!')
	function loginHandle() {
		let flag = 1
		const model = document.getElementById('modal')
		const modelContent = document.getElementById('modal-content')
		const acc = document.getElementById('account').value
		const passwd = document.getElementById('password').value
		const re_passwd = document.getElementById('re-password').value
		if (acc.length==0 || passwd.length==0 || re_passwd.length==0) {
			model.style.display = 'block'
			modelContent.innerText = 'Vui lòng điền đầy đủ thông tin!'
			flag = 0
		}
		if (passwd !== re_passwd) {
			model.style.display = 'block'
			modelContent.innerText = 'Mật khẩu không khớp !'
			flag = 0
		}
		if (flag==1) {
			const postData = {
				sdt : passwd,
				mail : acc
			}
			console.log('postData login:', postData)
			const req_option = {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
					// Các headers khác nếu cần thiết
				},
				body: JSON.stringify(postData)
			}
			fetch("http://127.0.0.1:8080/login", req_option)
				.then(response => {
					if(!response.ok) {throw new Error('fail to login')}
					return response.json()
				})
				.then(data => {
					console.log('data response login:', data)
					if (data.length==0) {
						model.style.display = 'block'
						modelContent.innerText = 'Tài khoản hoặc mật khẩu không chính xác!'
					} else {
						const dataDienNuoc = data.map(item => [item.thoiGian,  item.soKyDien, item.tienDien, item.soKyNuoc, item.tienNuoc, item.tong, item.hocKy, item.namHoc, item.trangThaiDongPhi])
						const { diaChi, dien9sach, hoTen, hocKy, khoa, lop, maDay, maLoai, maPhong, mail, mssv, namHoc, nganh, ngayDuocDuyet, ngayRutDon, ngaySinh, sdt, soTienPhong, sucChua, tenphong, trangThaiPhong, trangThaiDongPhiPhong } = data[0]
						data = {
							account: { diaChi, dien9sach, hoTen, hocKy, khoa, lop, maDay, maLoai, maPhong, mail, mssv, namHoc, nganh, ngayDuocDuyet, ngayRutDon, ngaySinh, sdt, soTienPhong, sucChua, tenphong, trangThaiPhong, trangThaiDongPhiPhong }, 
							dataDienNuoc: dataDienNuoc
						}
						localStorage.setItem("dataSinhVien", JSON.stringify(data));
						window.location.href = "/";
					}
				})
				.catch(err => {
					console.error('Error login:', err)
				})
		}
	}
	return (
		<div className="w3-card w3-margin-top w3-display-container" 
		style={{height: '50vh'}}>
		
			<div className="w3-display-middle w3-card ">
			
				<div className="w3-row w3-padding">
					<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="account">Tài khoản:</label>
					<input type="text" className="w3-half w3-mobile w3-input w3-hove" id="account"/>
				</div>
				
				<div className="w3-row w3-padding">
					<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="password">Mật khẩu:</label>
					<input type="password" className="w3-half w3-mobile w3-input w3-hove" id="password"/>
				</div>
				
				<div className="w3-row w3-padding">
					<label className="w3-half w3-mobile w3-hover-indigo" htmlFor="re-password">Nhập lại mật khẩu:</label>
					<input type="password" className="w3-half w3-mobile w3-input w3-hove" id="re-password"/>
				</div>
				
				<button onClick={loginHandle}
				className="w3-button w3-card w3-right w3-margin">Đăng nhập</button>
			</div>
			
			{/* model */}
			<div id="modal" className="w3-modal">
				<div className="w3-modal-content">
					<div className="w3-container">
						<span onClick={()=>document.getElementById('modal').style.display='none'} className="w3-button w3-display-topright">&times;</span>
						<p id="modal-content"></p>
					</div>
				</div>
			</div>
		</div>
	)
}