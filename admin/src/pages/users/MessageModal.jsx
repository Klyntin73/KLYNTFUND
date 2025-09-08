import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { useState } from "react";

const MessageModal = ({ isOpen, onClose, onSend, user }) => {
   const [message, setMessage] = useState("");

   const handleSend = () => {
      if (message.trim() === "") return;
      onSend(message);
      setMessage("");
      onClose();
   };

   return (
      <AnimatePresence>
         { isOpen && (
            <motion.div
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
               initial={ { opacity: 0 } }
               animate={ { opacity: 1 } }
               exit={ { opacity: 0 } }
            >
               {/* Modal Content */ }
               <motion.div
                  initial={ { scale: 0.9, opacity: 0 } }
                  animate={ { scale: 1, opacity: 1 } }
                  exit={ { scale: 0.9, opacity: 0 } }
                  transition={ { duration: 0.3 } }
                  className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-[#3498DB]/20"
               >
                  {/* Header */ }
                  <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-semibold text-[#2C3E50]">
                        Message { user?.fullName }
                     </h2>
                     <button
                        onClick={ onClose }
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                     >
                        <X className="w-5 h-5 text-gray-600" />
                     </button>
                  </div>

                  {/* Textarea */ }
                  <textarea
                     className="w-full h-32 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#3498DB] focus:outline-none resize-none"
                     placeholder={ `Write a message to ${user?.fullName}...` }
                     value={ message }
                     onChange={ (e) => setMessage(e.target.value) }
                  />

                  {/* Footer */ }
                  <div className="flex justify-end gap-3 mt-4">
                     <button
                        onClick={ onClose }
                        className="px-4 py-2 rounded-full border text-gray-600 hover:bg-gray-100 transition"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={ handleSend }
                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#3498DB] text-white hover:bg-[#2A7CBF] transition"
                     >
                        <Send className="w-4 h-4" />
                        Send
                     </button>
                  </div>
               </motion.div>
            </motion.div>
         ) }
      </AnimatePresence>
   );
};

export default MessageModal;
