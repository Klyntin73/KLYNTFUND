import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, UserCircle, Loader, Filter, ChevronLeft, ChevronRight, Trash2, Eye, CheckCircle, Ban } from "lucide-react";
import { AdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UsersList = () => {
   const { backendUrl, adminToken } = useContext(AdminContext);
   const [users, setUsers] = useState([]);
   const [search, setSearch] = useState("");
   const [role, setRole] = useState("");
   const [loading, setLoading] = useState(false);
   const [page, setPage] = useState(1);
   const [deletingId, setDeletingId] = useState(null);
   const [totalPages, setTotalPages] = useState(1);
   const navigate = useNavigate();

   // Fetch users
   const fetchUsers = async () => {
      try {
         setLoading(true);
         const res = await axios.get(
            `${backendUrl}/api/admin/users?page=${page}&limit=10&search=${search}&role=${role}`,
            { headers: { Authorization: `Bearer ${adminToken}` } }
         );
         setUsers(res.data.data);
         setTotalPages(res.data.totalPages);
      } catch (error) {
         console.error("Error fetching users:", error);
         toast.error(error.response?.data?.message || "Failed to fetched users.");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchUsers();
   }, [page, role]);

   const handleSearch = (e) => {
      e.preventDefault();
      setPage(1);
      fetchUsers();
   };

   // Delete User
   const deleteUser = async (id) => {
      if (!window.confirm("Are you sure you want to delete this project?")) return;
      setDeletingId(id);
      try {
         await axios.delete(`${backendUrl}/api/admin/users/delete/${id}`, {
            headers: { Authorization: `Bearer ${adminToken}` },
         });
         setUsers((prev) => prev.filter((proj) => proj._id !== id));
         toast.success("User deleted successfully");
      } catch (err) {
         console.error("Error deleting user:", err);
         toast.error(err.response?.data?.message || "Failed to delete user");
      } finally {
         setDeletingId(null);
      }
   };

   // Suspend User
   const handleSuspend = async (id) => {
      try {
         const { data } = await axios.patch(
            `${backendUrl}/api/admin/users/${id}/suspend`,
            {},
            { headers: { Authorization: `Bearer ${adminToken}` } }
         );
         toast.info(data.message);
         fetchUsers();
      } catch (error) {
         console.error("Error suspending user:", error);
         toast.error(error.response?.data?.message || "Failed to update suspension status.");
      }
   };

   return (
      <div className="">
         {/* Header */ }
         <motion.h1
            initial={ { opacity: 0, y: -10 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.4 } }
            className="text-2xl font-bold text-[#2C3E50] mb-6"
         >
            Users Management
         </motion.h1>

         {/* Controls */ }
         <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
            {/* Search */ }
            <form onSubmit={ handleSearch } className="flex items-center border border-[#3498DB] rounded-full overflow-hidden w-full md:w-1/3">
               <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="flex-1 px-4 py-2 outline-none"
                  value={ search }
                  onChange={ (e) => setSearch(e.target.value) }
               />
               <button type="submit" className="px-3 text-[#3498DB] hover:text-[#2A7CBF]">
                  <Search size={ 18 } />
               </button>
            </form>

            {/* Filter */ }
            <div className="flex items-center gap-2">
               <Filter className="text-[#3498DB]" size={ 18 } />
               <select
                  className="border border-[#3498DB] rounded-full px-3 py-2 text-sm"
                  value={ role }
                  onChange={ (e) => {
                     setRole(e.target.value);
                     setPage(1);
                  } }
               >
                  <option value="">All Roles</option>
                  <option value="creator">Creator</option>
                  <option value="investor">Investor</option>
               </select>
            </div>
         </div>

         {/* Table */ }
         <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full text-sm text-left border-separate border-spacing-0">
               <thead className="bg-[#3498DB]/10 text-[#2C3E50] font-semibold">
                  <tr>
                     <th className="px-6 py-3 text-left">#</th>
                     <th className="px-6 py-3 text-left">User</th>
                     <th className="px-6 py-3 text-left">Email</th>
                     <th className="px-6 py-3 text-left">Role</th>
                     <th className="px-6 py-3 text-left">Joined</th>
                     <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
               </thead>
               <motion.tbody layout>
                  { loading ? (
                     <tr>
                        <td colSpan={ 4 } className="text-center py-6">
                           <Loader className="animate-spin inline-block mr-2 text-[#3498DB]" />
                           Loading users...
                        </td>
                     </tr>
                  ) : users.length > 0 ? (
                     users.map((user, index) => (
                        <motion.tr
                           key={ user._id }
                           initial={ { opacity: 0, y: 10 } }
                           animate={ { opacity: 1, y: 0 } }
                           transition={ { delay: index * 0.05 } }
                           className="border-b hover:bg-gray-50"
                        >
                           <td className="px-4 py-3 border-t border-[#3498DB]/10 text-gray-500 font-medium">{ index + 1 }</td>
                           <td className="px-6 py-3 flex items-center gap-2">
                              { user.imageUrl ? (
                                 <img src={ user.imageUrl } alt={ user.fullName } className="w-8 h-8 rounded-full object-cover" />
                              ) : (
                                 <UserCircle className="text-[#3498DB]" size={ 28 } />
                              ) }
                              <span className="max-w-[180px] truncate">{ user.fullName }</span>
                           </td>
                           <td className="px-6 py-3">{ user.email }</td>
                           <td className="px-6 py-3 capitalize">{ user.role }</td>
                           <td className="px-6 py-3 max-w-[180px] truncate">{ new Date(user.createdAt).toDateString() }</td>
                           <td className="px-6 py-4 flex items-center gap-2">
                              {/* View Button */ }
                              <motion.button
                                 whileHover={ { scale: 1.1 } }
                                 whileTap={ { scale: 0.95 } }
                                 onClick={ () => navigate(`/admin/user/${user._id}`) }
                                 className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                              >
                                 <Eye size={ 16 } />
                                 View
                              </motion.button>

                              <motion.button
                                 whileHover={ { scale: 1.05 } }
                                 whileTap={ { scale: 0.95 } }
                                 onClick={ () => handleSuspend(user._id) }
                                 className={ `flex items-center gap-2 ${user.suspended
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-yellow-500 hover:bg-yellow-600"
                                    } text-white px-5 py-2 rounded-full shadow-md font-medium transition` }
                              >
                                 { user.suspended ? <CheckCircle size={ 16 } /> : <Ban size={ 16 } /> }
                                 { user.suspended ? "Reactivate" : "Suspend" }
                              </motion.button>

                              {/* Delete Button */ }
                              <motion.button
                                 whileHover={ { scale: 1.1 } }
                                 whileTap={ { scale: 0.95 } }
                                 onClick={ () => deleteUser(user._id) }
                                 className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                 disabled={ deletingId === user._id }
                              >
                                 { deletingId === user._id ? (
                                    <Loader className="animate-spin" size={ 16 } />
                                 ) : (
                                    <Trash2 size={ 16 } />
                                 ) }
                                 Delete
                              </motion.button>
                           </td>
                        </motion.tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={ 4 } className="text-center py-6 text-gray-500">
                           No users found.
                        </td>
                     </tr>
                  ) }
               </motion.tbody>
            </table>
         </div>

         {/* Pagination */ }
         <div className="flex justify-between items-center mt-6">
            <button
               disabled={ page <= 1 }
               onClick={ () => setPage((prev) => prev - 1) }
               className="flex items-center gap-1 px-3 py-2 border border-[#3498DB] rounded-full text-[#3498DB] hover:bg-[#3498DB] hover:text-white disabled:opacity-50"
            >
               <ChevronLeft size={ 16 } /> Prev
            </button>
            <span className="text-sm text-gray-600">
               Page { page } of { totalPages }
            </span>
            <button
               disabled={ page >= totalPages }
               onClick={ () => setPage((prev) => prev + 1) }
               className="flex items-center gap-1 px-3 py-2 border border-[#3498DB] rounded-full text-[#3498DB] hover:bg-[#3498DB] hover:text-white disabled:opacity-50"
            >
               Next <ChevronRight size={ 16 } />
            </button>
         </div>
      </div>
   );
};

export default UsersList;
