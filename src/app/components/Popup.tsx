// src/components/Popup.tsx

import React, { useEffect } from 'react';

interface PopupProps {
    message: string;
    onClose: () => void;
    isError: boolean;
}

const Popup: React.FC<PopupProps> = ({ message, isError = false, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed bottom-4 right-4 ${ isError ? 'bg-red-500' : 'bg-green-500' } text-white p-3 rounded shadow-lg`}>
            {message}
        </div>
    );
};

export default Popup;
