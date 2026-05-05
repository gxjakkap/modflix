import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './App.css'
import LoginPage from './LoginPage/LoginPage.jsx'
import LandingPage from './LandingPage/LandingPage.jsx'
import ProductPage from './Pages/ProductPage.jsx'
import ProductEditPage from './Pages/EditPage/ProductEditPage.jsx'
import CastPage from './Pages/CastPage.jsx'
import CastEditPage from './Pages/EditPage/CastEditPage.jsx'
import CustomerPage from './Pages/CustomerPage.jsx'
import CustomerEditPage from './Pages/EditPage/CustomerEditPage.jsx'
import Background from './Background/Background.jsx'
import mockProfilePic from './assets/rigbyMockProfilePic.png'
import AdminProfilePage from './Pages/AdminProfilePage.jsx'
import UserBehaviorPage from './Pages/UserBehaviorPage.jsx';
import PopularityPage from './Pages/PopularityPage.jsx';
import ManagementDashboard from './components/ManagementDashboard.jsx';
import Signup from './components/Signup.jsx';
import SalesReportPage from './Pages/SalesReportPage.jsx'

const mkEps = (count, price) =>
    Array.from({ length: count }, (_, i) => ({
        code: `EP${String(i + 1).padStart(2, '0')}`,
        name: `Episode ${i + 1}`,
        price,
    }))

const mkCast = (members) =>
    members.map((m, i) => ({ code: `EC${String(i + 1).padStart(2, '0')}`, ...m }))

const INITIAL_PRODUCTS = [
    { code: 'P01', name: 'Avatar 1',            price: '200.00', type: 'MOVIE',  genre: 'Sci-Fi',  description: '', totalEpisodes: 0,  episodes: [] },
    { code: 'P02', name: 'Avatar 2',            price: '200.00', type: 'MOVIE',  genre: 'Sci-Fi',  description: '', totalEpisodes: 0,  episodes: [] },
    { code: 'P03', name: 'Avatar 3',            price: '200.00', type: 'MOVIE',  genre: 'Sci-Fi',  description: '', totalEpisodes: 0,  episodes: [] },
    { code: 'P04', name: 'Star War',            price: '150.00', type: 'MOVIE',  genre: 'Sci-Fi',  description: '', totalEpisodes: 0,  episodes: [] },
    { code: 'P05', name: 'Your name',           price: '150.00', type: 'MOVIE',  genre: 'Romance', description: '', totalEpisodes: 0,  episodes: [] },
    { code: 'P06', name: 'Stranger Things ss1', price: '300.00', type: 'SERIES', genre: 'Horror',  description: 'A group of kids uncover a supernatural mystery in their small town.',  totalEpisodes: 8,  episodes: mkEps(8,  '37.50')  },
    { code: 'P07', name: 'Itaewon Class',       price: '450.00', type: 'SERIES', genre: 'Drama',   description: 'In a colorful Seoul neighborhood, an ex-con and his friends fight to make their street bar a reality.', totalEpisodes: 16, episodes: mkEps(16, '28.125') },
    { code: 'P08', name: 'One piece',           price: '450.00', type: 'SERIES', genre: 'Action',  description: 'A young pirate sets sail to find the legendary treasure called the One Piece.', totalEpisodes: 12, episodes: mkEps(12, '37.50')  },
    { code: 'P09', name: 'Blue Lock',           price: '200.00', type: 'SERIES', genre: 'Sports',  description: "Three hundred strikers compete to become Japan's best striker.", totalEpisodes: 10, episodes: mkEps(10, '20.00')  },
]

const INITIAL_CASTS = [
    { code: 'CA01', name: 'Avatar 1',            type: 'MOVIE',  cast: mkCast([{name:'Sam Worthington',role:'Actor'},{name:'Zoe Saldana',role:'Actor'},{name:'Sigourney Weaver',role:'Actor'}]) },
    { code: 'CA02', name: 'Avatar 2',            type: 'MOVIE',  cast: mkCast([{name:'Sam Worthington',role:'Actor'},{name:'Zoe Saldana',role:'Actor'},{name:'Kate Winslet',role:'Actor'}]) },
    { code: 'CA03', name: 'Avatar 3',            type: 'MOVIE',  cast: mkCast([{name:'Sam Worthington',role:'Actor'},{name:'Zoe Saldana',role:'Actor'}]) },
    { code: 'CA04', name: 'Star War',            type: 'MOVIE',  cast: mkCast([{name:'Mark Hamill',role:'Actor'},{name:'Harrison Ford',role:'Actor'},{name:'Carrie Fisher',role:'Actor'}]) },
    { code: 'CA05', name: 'Your name',           type: 'MOVIE',  cast: mkCast([{name:'Ryunosuke Kamiki',role:'Voice Actor'},{name:'Mone Kamishiraishi',role:'Voice Actor'}]) },
    { code: 'CA06', name: 'Stranger Things ss1', type: 'SERIES', cast: mkCast([{name:'Millie Bobby Brown',role:'Actor'},{name:'Finn Wolfhard',role:'Actor'},{name:'David Harbour',role:'Actor'},{name:'Winona Ryder',role:'Actor'}]) },
    { code: 'CA07', name: 'Itaewon Class',       type: 'SERIES', cast: mkCast([{name:'Park Seo-Jun',role:'Actor'},{name:'Kim Da-Mi',role:'Actor'},{name:'Kim Seong-yoon',role:'Director'},{name:'Gwang Jin',role:'Writer'},{name:'Yoo Jae-Myung',role:'Actor'},{name:'Lee Joo-Young',role:'Actor'},{name:'Kwon Na-Ra',role:'Actor'},{name:'Ahn Bo-Hyun',role:'Actor'},{name:'Kim Hye-Eun',role:'Actor'}]) },
    { code: 'CA08', name: 'One piece',           type: 'SERIES', cast: mkCast([{name:'Iñaki Godoy',role:'Actor'},{name:'Mackenyu',role:'Actor'},{name:'Emily Rudd',role:'Actor'}]) },
    { code: 'CA09', name: 'Blue Lock',           type: 'SERIES', cast: mkCast([{name:'Kazuki Ura',role:'Voice Actor'},{name:'Tasuku Hatanaka',role:'Voice Actor'}]) },
]

const INITIAL_CUSTOMERS = [
    { code: 'CU01', name: 'Vera',     phone: '0123456789', email: 'wow@gmail.com',  country: 'Thailand', dob: '01/01/2549' },
    { code: 'CU02', name: 'Ttime',    phone: '0123456789', email: 'wow1@gmail.com', country: 'Thailand', dob: '02/02/2540' },
    { code: 'CU03', name: 'Jungkook', phone: '0123456789', email: 'wow2@gmail.com', country: 'Korea',    dob: '01/09/2540' },
    { code: 'CU04', name: 'Namjoon',  phone: '0123456789', email: 'wow3@gmail.com', country: 'Korea',    dob: '12/09/2537' },
    { code: 'CU05', name: 'Jimin',    phone: '0123456789', email: 'wow4@gmail.com', country: 'Korea',    dob: '13/10/2538' },
    { code: 'CU06', name: 'J-Hope',   phone: '0123456789', email: 'wow5@gmail.com', country: 'Korea',    dob: '18/02/2537' },
    { code: 'CU07', name: 'V',        phone: '0123456789', email: 'wow6@gmail.com', country: 'Korea',    dob: '30/12/2538' },
    { code: 'CU08', name: 'SUGA',     phone: '0123456789', email: 'wow7@gmail.com', country: 'Korea',    dob: '09/03/2537' },
    { code: 'CU09', name: 'Jin',      phone: '0123456789', email: 'wow8@gmail.com', country: 'Korea',    dob: '04/12/2535' },
]

const INITIAL_DATA = [
    { id: '0001', name: 'KIM MINJEONG', role: 'SUPER ADMIN', login: '12/12/24 01:03 PM', email: 'winrina@gmail.com', device: 'Mac',     ip: '203.0.113.1', last: '1 min ago',  risk: 'LOW',    time: 'MAR 23, 10:15', event: 'LOGIN' },
    { id: '0002', name: 'NUCH',         role: 'ADMIN',       login: '12/12/24 01:03 PM', email: 'winrina@gmail.com', device: 'Phone',   ip: '101.51.22.9', last: '5 min ago',  risk: 'HIGH',   time: 'MAR 23, 10:15', event: 'LOGIN' },
    { id: '0003', name: 'LISA',         role: 'ADMIN',       login: '12/12/24 01:03 PM', email: 'winrina@gmail.com', device: 'Windows', ip: '101.51.22.9', last: '1 min ago',  risk: 'MEDIUM', time: 'MAR 23, 10:15', event: 'LOGIN' },
    { id: '0004', name: 'JENNIE',       role: 'ADMIN',       login: '12/12/24 01:03 PM', email: 'winrina@gmail.com', device: 'Mac',     ip: '203.0.113.1', last: '2 days ago', risk: 'LOW',    time: 'MAR 23, 10:15', event: 'LOGIN' },
    { id: '0005', name: 'KARINA',       role: 'ADMIN',       login: '12/12/24 01:03 PM', email: 'winrina@gmail.com', device: 'Mac',     ip: '101.51.22.9', last: '1 min ago',  risk: 'LOW',    time: 'MAR 23, 10:15', event: 'LOGIN' },
    { id: '0006', name: 'NINGNING',     role: 'ADMIN',       login: '12/12/24 01:03 PM', email: 'winrina@gmail.com', device: 'Mac',     ip: '101.51.22.9', last: '5 min ago',  risk: 'MEDIUM', time: 'MAR 23, 10:15', event: 'LOGIN' },
]

function LoginRoute({ isLoggedIn, onLogin }) {
    const navigate = useNavigate()
    return isLoggedIn
        ? <Navigate to="/" replace />
        : <LoginPage onLogin={onLogin} onSignup={() => navigate('/signup')} />
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername]     = useState('LetmeuseKase')
    const [pic]                       = useState(mockProfilePic)
    const [data, setData]             = useState(INITIAL_DATA)
    const [products, setProducts]     = useState(INITIAL_PRODUCTS)
    const [casts, setCasts]           = useState(INITIAL_CASTS)
    const [customers, setCustomers]   = useState(INITIAL_CUSTOMERS)

    useEffect(() => {
        document.body.style.overflow = isLoggedIn ? '' : 'hidden'
    }, [isLoggedIn])

    const [signupUser, setSignupUser] = useState(() => {
        const saved = localStorage.getItem('user')
        return saved ? JSON.parse(saved) : null
    })
    const [signupList, setSignupList] = useState(() => {
        const saved = localStorage.getItem('signupList')
        return saved ? JSON.parse(saved) : []
    })

    const handleSignup = (formData) => {
        setSignupUser(formData)
        localStorage.setItem('user', JSON.stringify(formData))
        const newList = [...signupList, formData]
        setSignupList(newList)
        localStorage.setItem('signupList', JSON.stringify(newList))
    }

    const handleDelete      = (id)      => setData(prev => prev.filter(item => item.id !== id))
    const handleSaveProduct = (updated) => setProducts(prev  => prev.map(p => p.code === updated.code ? updated : p))
    const handleSaveCast    = (updated) => setCasts(prev     => prev.map(c => c.code === updated.code ? updated : c))
    const handleSaveCustomer= (updated) => setCustomers(prev => prev.map(c => c.code === updated.code ? updated : c))

    const handleAddAdmin = (newAdmin) => {
        const nextId  = String(data.length + 1).padStart(4, '0')
        const now     = new Date()
        const dateStr = `${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}/${String(now.getFullYear()).slice(-2)} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`
        const months  = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
        const timeStr = `${months[now.getMonth()]} ${now.getDate()}, ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
        setData(prev => [...prev, {
            id: nextId, name: newAdmin.fullname.toUpperCase(), role: newAdmin.role || 'ADMIN',
            login: dateStr, email: newAdmin.email, device: 'Mac', ip: '192.168.1.1',
            last: '1 min ago', risk: 'LOW', time: timeStr, event: 'LOGIN',
        }])
    }

    const commonProps = { isLoggedIn, username, pic }

    return (
        <BrowserRouter>
            <Background />
            <Routes>

                <Route 
                path="/reports/users" 
                    element={isLoggedIn
                            ? <UserBehaviorPage {...commonProps} />
                            : <Navigate to="/login" replace />
                            } />
                <Route path="/reports/popularity" 
                    element={isLoggedIn
                            ? <PopularityPage {...commonProps} />
                            : <Navigate to="/login" replace />} />
                <Route path="/reports/sales"
                    element={
                        isLoggedIn
                        ? <SalesReportPage pic={pic} username={username} />
                        : <Navigate to="/login" replace />
                }/>

                {/* edit */}
                <Route
                    path="/login"
                    element={
                         <LoginRoute
                            isLoggedIn={isLoggedIn}
                            onLogin={() => setIsLoggedIn(true)}
                         />
                    }
                />
                <Route path="/signup"  element={<Signup onSignup={handleSignup} onLoginSuccess={() => setIsLoggedIn(true)} />} />
                <Route path="/"        element={isLoggedIn ? <LandingPage {...commonProps} /> : <Navigate to="/login" replace />} />

                <Route path="/products"           element={isLoggedIn ? <ProductPage  {...commonProps} data={products} /> : <Navigate to="/login" replace />} />
                <Route path="/products/edit/:code" element={isLoggedIn ? <ProductEditPage  {...commonProps} products={products}  onSave={handleSaveProduct}  /> : <Navigate to="/login" replace />} />

                <Route path="/cast"               element={isLoggedIn ? <CastPage     {...commonProps} data={casts} /> : <Navigate to="/login" replace />} />
                <Route path="/cast/edit/:code"    element={isLoggedIn ? <CastEditPage {...commonProps} casts={casts} onSave={handleSaveCast} /> : <Navigate to="/login" replace />} />
                <Route
                    path="/"
                    element={
                        isLoggedIn
                            ? <LandingPage {...commonProps} />
                            : <Navigate to="/login" replace />
                    }
                />
                <Route
                    path="/products"
                    element={
                        isLoggedIn
                            ? <ProductPage {...commonProps} />
                            : <Navigate to="/login" replace />
                    }
                />
                <Route
                    path="/admin-profile"
                    element={
                        isLoggedIn
                            ? <AdminProfilePage {...commonProps} onSave={(newUsername) => setUsername(newUsername)} />
                            : <Navigate to="/login" replace />
                    }
                />
                <Route path="/customers"              element={isLoggedIn ? <CustomerPage     {...commonProps} data={customers} /> : <Navigate to="/login" replace />} />
                <Route path="/customers/edit/:code"   element={isLoggedIn ? <CustomerEditPage {...commonProps} customers={customers} onSave={handleSaveCustomer} /> : <Navigate to="/login" replace />} />

                <Route path="/admin-profile" element={isLoggedIn ? <AdminProfilePage {...commonProps} onSave={setUsername} /> : <Navigate to="/login" replace />} />
                <Route path="/management/*"  element={isLoggedIn
                    ? <ManagementDashboard data={data} signupList={signupList} handleDelete={handleDelete} handleAddAdmin={handleAddAdmin} user={signupUser} pic={mockProfilePic} username="LetmeuseKase" />
                    : <Navigate to="/login" replace />
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App