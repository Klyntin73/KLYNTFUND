import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FileText, User, Mail, Calendar, Loader, ArrowLeft, RotateCcw } from "lucide-react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RefundedInvestment = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const [refunded, setRefunded] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRefunded = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/admin/investments/refunded`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        setRefunded(res.data.data || []);
      } catch (err) {
        console.error("Error fetching refunded investments:", err);
        toast.error("Failed to load refunded investments");
      } finally {
        setLoading(false);
      }
    };
    fetchRefunded();
  }, [backendUrl, adminToken]);

  return (
    <div>
      <button
        onClick={() => {
          navigate(-1);
          scrollTo(0, 0);
        }}
        className="flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4 text-[#3498DB]" /> Back
      </button>

      <div className="flex justify-center">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-red-600">
          <RotateCcw className="w-6 h-6" />
          Refunded Investments
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader className="animate-spin text-[#3498DB]" size={28} />
        </div>
      ) : refunded.length === 0 ? (
        <p className="flex justify-center text-gray-500">
          No refunded investments found at the moment.
        </p>
      ) : (
        <div className="grid gap-4">
          {refunded.map((inv, index) => (
            <motion.div
              key={inv._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-5 rounded-2xl bg-slate-800 shadow-md border border-slate-700 hover:border-red-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {inv.project.title}
                </h2>
                <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full">
                  {inv.project.category}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-gray-400">
                  <User className="w-4 h-4" />
                  <span>{inv.investor.fullName}</span>
                </p>
                <p className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>{inv.investor.email}</span>
                </p>
              </div>

              <div className="mt-3 space-y-2">
                <p className="text-sm">
                  <span className="font-semibold text-gray-400">Amount:</span>{" "}
                  <span className="text-red-400">GHS {inv.amount}</span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-gray-400">Payment Ref:</span>{" "}
                  <span className="text-red-400">{inv.paymentRef}</span>
                </p>
                <p className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {new Date(inv.repaidAt).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RefundedInvestment;
