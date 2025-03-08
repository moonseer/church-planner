import { Routes, Route } from 'react-router-dom'
import Layout from '@components/layout/Layout'
import Dashboard from '@pages/Dashboard'
import NotFound from '@pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        {/* Add more routes here as they are developed */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App 