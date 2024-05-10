import { useState } from 'react'

export default function DangKyO() {
	const [data, setData] = useState(JSON.parse(localStorage.getItem('dataSinhVien')))
	console.log("DangKyO render!")

	return (
		<div 
		className="w3-card w3-margin-top w3-padding"
		style={{overflow: 'auto'}}>
		
			{/* Thông tin sinh viên */}
			<h2>Thông tin sinh viên</h2>
			<table
			className="w3-table w3-striped">
				<tbody>
					<tr >
						<th>Mã sinh viên</th>
						<td>{data.account.mssv}</td>
						<th>Ngày sinh</th>
						<td>{data.account.ngaySinh}</td>
					</tr>
					<tr >
						<th>Họ tên</th>
						<td>{data.account.hoTen}</td>
						<th>Lớp</th>
						<td>{data.account.lop}</td>
					</tr>
					<tr >
						<th>Ngành học</th>
						<td>{data.account.nganh}</td>
						<th>Khóa học</th>
						<td>{data.account.khoa}</td>
					</tr>
					<tr >
						<th>Hộ khẩu tỉnh/TP</th>
						<td>{data.account.diaChi}</td>
						<th>Email</th>
						<td>{data.account.mail}</td>
					</tr>
					<tr >
						<th>Số điện thoại cá nhân</th>
						<td>{data.account.sdt}</td>
						<th>Diện chính sách</th>
						<td>{data.account.dien9sach}</td>
					</tr>
				</tbody>
			</table>
			
			{/* Thông tin ở ký túc xá */}
			<h2>Thông tin ở ký túc xá</h2>
			<table
			className="w3-table w3-striped">
				<tbody>
					<tr >
						<th>Loại phòng đăng ký</th>
						<td>{data.account.maLoai}</td>
						<th>Phòng đăng ký</th>
						<td>{data.account.sucChua} chỗ</td>
					</tr>
					<tr >
						<th>Phòng</th>
						<td>{data.account.maPhong}</td>
						<th>Dãy</th>
						<td>{data.account.maDay}</td>
					</tr>
					<tr >
						<th>Chỗ</th>
						<td>{data.account.sucChua}</td>
					</tr>
					<tr >
						<th>Ngày được duyệt</th>
						<td>{data.account.ngayDuocDuyet || ''}</td>
						<th> Tình trạng</th>
						<td>{data.account.trangThaiPhong || ''}</td>
					</tr>
					<tr >
						<th>Ngày rút đơn ở KTX</th>
						<td>{data.account.ngayRutDon || ''}</td>
					</tr>
				</tbody>
			</table>
			
			{/* Thông tin đóng phí điện nước hàng tháng */}
			<h2>Thông tin đóng phí điện nước hàng tháng</h2>
			<table
			className="w3-table w3-striped">
				<thead>
					<tr>
						<th>Stt</th>
						<th>Thời gian</th>
						<th>Số ký điện</th>
						<th>Tiền điện</th>
						<th>Số ký nước</th>
						<th>Tiền nước</th>
						<th>Tổng</th>
						<th>Học kỳ</th>
						<th>Năm học</th>
					</tr>
				</thead>
				<tbody>
					{data.dataDienNuoc.map((item, idx) => {
							return (
								<tr key={idx}>
									<td>{idx+1}</td>
									{item.map((cell, idxCell) => {
										return (
											<td key={idxCell}>{cell}</td>
										)
									})}
								</tr>
							)
					})}
				</tbody>
			</table>
			
			{/* Thông báo đóng phí */}
			<h2>Thông báo đóng phí</h2>
			<table 
			className="w3-table w3-striped">
				<tbody>
					<tr >
						<th>Phí phòng</th>
						<td>{data.account.soTienPhong || ''}</td>
						<th>Trạng thái đóng phí</th>
						<td>{data.account.trangThaiDongPhiPhong || ''}</td>
					</tr>
					<tr >
						<th>Phí điện nước</th>
						<td>{data.dataDienNuoc[data.dataDienNuoc.length-1][5] || ''}</td>
						<th>Trạng thái đóng phí</th>
						<td>{data.dataDienNuoc[data.dataDienNuoc.length-1][8] || ''}</td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}