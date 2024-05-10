import Layout from './Layout.jsx'
import XemTinhTrangPhong from './XemTinhTrangPhong.jsx'
import DangKyO from './DangKyO.jsx'
import DashBoard from './DashBoard.jsx'
import Login from './Login.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
	console.log("App render !")
	return (
		<BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
					<Route index element={<XemTinhTrangPhong />} />
					<Route path="dang-ky-o" element={<DangKyO />} />
					<Route path="dashboard" element={<DashBoard />} />
					<Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
	)
}