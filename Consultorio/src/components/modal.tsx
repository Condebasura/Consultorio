type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    title?: string;
}

export default function Modal({isOpen, onClose, children, title}: ModalProps){

return(
    isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-20">
            <div className="bg-gray-300 border-2 border-black rounded-lg p-6 w-96">
                 <h2 className="text-xl font-bold mb-4">{title}</h2>
                {children}
                <div className="flex justify-center gap-2 mt-4">
                   
                    <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={onClose}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    )
)
}