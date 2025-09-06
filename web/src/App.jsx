import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
import '../assets/styles/yamato.scss'

export default function App() { return <RouterProvider router={router} /> }
