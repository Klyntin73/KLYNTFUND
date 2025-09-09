import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Handshake,
  Mail,
  User,
  FileText,
  Calendar,
  Loader,
  ArrowLeft,
  CheckCircle,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DisputedInvestment = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const [disputes, setDisputes] = useState([]);
  const [refundingId, setRefundingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/admin/investments/disputed`,
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          }
        );
        setDisputes(res.data.data || []);
      } catch (err) {
        console.error("Error fetching disputed investments:", err);
        toast.error("Failed to load disputed investments");
      } finally {
        setLoading(false);
      }
    };
    fetchDisputes();
  }, [backendUrl, adminToken]);

  // --- Toggle Dispute Resolved/Unresolved ---
  const toggleDispute = async (id, resolved) => {
    setUpdatingId(id);
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/admin/investments/disputed/${id}`,
        { resolved },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      if (data.success) {
        toast.success(data.message);
        setDisputes((prev) =>
          prev.map((d) =>
            d._id === id ? { ...d, dispute: { ...d.dispute, resolved } } : d
          )
        );
      } else {
        toast.error(data.message || "Failed to update dispute");
      }
    } catch (err) {
      console.error("Update dispute error:", err);
      toast.error("Error updating dispute");
    } finally {
      setUpdatingId(null);
    }
  };

  // --- Refund Investment Handler ---
  const refundInvestment = async (id) => {
    setRefundingId(id);
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/admin/investments/refund/${id}`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      if (data.success) {
        toast.success(data.message);
        // remove refunded one from disputes list
        setDisputes((prev) => prev.filter((d) => d._id !== id));
      } else {
        toast.error(data.message || "Failed to refund");
      }
    } catch (err) {
      console.error("Refund error:", err);
      toast.error("Error refunding investment");
    } finally {
      setRefundingId(null);
    }
  };

  return (
    <div className="">
      {/* Back Button */}
      <button
        onClick={() => {
          navigate(-1);
          scrollTo(0, 0);
        }}
        className="flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4 text-[#3498DB]" /> Back
      </button>

      {/* Page Title */}
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-green-600">
          <Handshake className="w-6 h-6" />
          Disputed Investments
        </h1>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader className="animate-spin text-[#3498DB]" size={28} />
        </div>
      ) : disputes.length === 0 ? (
        <p className="flex justify-center text-gray-500">
          No disputed investments found at the moment.
        </p>
      ) : (
        <div className="grid gap-4">
          {disputes.map((inv, index) => (
            <motion.div
              key={inv._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-5 rounded-2xl bg-slate-800 shadow-md border border-slate-700 hover:border-green-500 transition-colors"
            >
              {/* Project Info */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {inv.project.title}
                </h2>
                <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                  {inv.project.category}
                </span>
              </div>

              {/* Investor Info */}
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

              {/* Investment Details */}
              <div className="mt-3 space-y-2">
                <p className="text-sm">
                  <span className="font-semibold text-gray-400">Amount:</span>{" "}
                  <span className="text-green-400">GHS {inv.amount}</span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-gray-400">
                    Payment Ref:
                  </span>{" "}
                  <span className="text-green-400">{inv.paymentRef}</span>
                </p>
                <p className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {new Date(inv.dispute?.date || inv.investedAt).toLocaleString()}
                </p>
              </div>

              {/* Dispute or Fraud Reason */}
<div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg">
  <p className="font-semibold text-yellow-400 text-sm flex items-center gap-2">
    <Handshake className="w-4 h-4" />
    {inv.fraudFlag ? "Fraud Flagged:" : "Dispute Reason:"}
  </p>
  <p className="text-gray-300 text-sm mt-1">
    {inv.fraudFlag
      ? inv.fraudReasons?.join(", ") || "No fraud reason provided"
      : inv.dispute?.reason || "No dispute reason provided"}
  </p>
</div>
              {/* Status + Actions */}
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`flex items-center gap-1 text-sm font-medium ${
                    inv.dispute?.resolved ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {inv.dispute?.resolved ? (
                    <>
                      <CheckCircle className="w-4 h-4" /> Resolved
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" /> Unresolved
                    </>
                  )}
                </span>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleDispute(inv._id, !inv.dispute?.resolved)}
                    disabled={updatingId === inv._id}
                    className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${
                      inv.dispute?.resolved
                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    }`}
                  >
                    {updatingId === inv._id
                      ? "Updating..."
                      : inv.dispute?.resolved
                      ? "Reopen"
                      : "Resolve"}
                  </button>

                  <button
                    onClick={() => refundInvestment(inv._id)}
                    disabled={refundingId === inv._id}
                    className="px-3 py-1 text-sm rounded-md font-medium bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors flex items-center gap-1"
                  >
                    {refundingId === inv._id ? (
                      "Refunding..."
                    ) : (
                      <>
                        <RotateCcw className="w-4 h-4" /> Refund
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisputedInvestment;