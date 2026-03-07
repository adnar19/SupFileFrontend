import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <div className='absolute z-[99999]'>
      <ToastContainer />
    </div>
  );
};

export default App;
