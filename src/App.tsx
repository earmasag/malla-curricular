import './App.css'
import { MallaPage } from './pages/MallaPage';

import { NotificationProvider } from './contexts/NotificationContext';
import { CustomNotification } from './components/CustomNotification/CustomNotification';

function App() {

  return (
    <NotificationProvider>
      <MallaPage />
      <CustomNotification />
    </NotificationProvider>
  )
}

export default App
