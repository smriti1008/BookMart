import { useEffect, useState } from "react";
import api from "../../util/axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";

const AdminAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get(
        `/get-all-history`
      );
      setOrders(res.data.data || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(
        `/update-status/${orderId}`,
        { status }
      );
      toast.success(`Order status updated to "${status}"`);
      fetchOrders();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status");
    }
  };

  if (loading)
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-white">All Orders</h2>

      <table className="w-full border border-zinc-700 rounded-lg overflow-hidden">
        <thead className="bg-zinc-900 text-zinc-200">
          <tr>
            <th className="p-3 text-left">Sr</th>
            <th className="p-3 text-left">Book(s)</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-center">Details</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((ord, index) => (
            <>
              <tr
                key={ord._id}
                className="border-b border-zinc-700 hover:bg-zinc-800"
              >
                {/* Serial number */}
                <td className="p-3 text-zinc-300">{index + 1}</td>

                {/* Books list with conditional rendering */}
                <td className="p-3 text-zinc-200">
                  {(() => {
                    const titles = (ord.books || [])
                      .map((b) => b?.book?.title)
                      .filter(Boolean);
                    if (titles.length === 0) return "N/A";
                    if (titles.length < 3) return titles.join(", ");
                    return `${titles.slice(0, 2).join(", ")}, ...`;
                  })()}
                </td>

                {/* Description rule: if one book, show start of its desc; else ellipsis */}
                <td className="p-3 text-zinc-400 text-sm truncate max-w-[200px]">
                  {(() => {
                    const items = ord.books || [];
                    if (items.length === 1) {
                      const text = items[0]?.book?.desc || items[0]?.book?.description;
                      return text ? `${text.slice(0, 50)}...` : "N/A";
                    }
                    return "...";
                  })()}
                </td>

                {/* Total Amount */}
                <td className="p-3 text-yellow-400 font-semibold">
                  ₹{ord.totalAmount}
                </td>

                {/* Status dropdown */}
                <td className="p-3">
                  <select
                    className="bg-zinc-700 text-zinc-200 px-2 py-1 rounded"
                    value={ord.status}
                    onChange={(e) => updateStatus(ord._id, e.target.value)}
                  >
                    <option value="order placed">Order Placed</option>
                    <option value="out for delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>

                {/* Details toggle */}
                <td className="p-3 text-center">
                  <button
                    className="text-blue-400 hover:text-blue-600"
                    onClick={() =>
                      setExpandedRow(expandedRow === ord._id ? null : ord._id)
                    }
                  >
                    {expandedRow === ord._id ? (
                      <ChevronUp className="inline w-5 h-5" />
                    ) : (
                      <ChevronDown className="inline w-5 h-5" />
                    )}
                  </button>
                </td>
              </tr>

              {/* Expanded row */}
              {expandedRow === ord._id && (
                <tr>
                  <td colSpan="6" className="bg-zinc-900 p-4 text-zinc-300">
                    <div className="flex flex-col gap-2">
                      <p>
                        <strong>User:</strong> {ord.user?.username} (
                        {ord.user?.email})
                      </p>
                      <div>
                        <strong>Books Ordered:</strong>
                        <ul className="list-disc ml-5">
                          {ord.books?.map((b, i) => (
                            <li key={i}>
                              {b.book?.title} — Qty: {b.qty} — Price: ₹
                              {b.book?.price}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <p>
                        <strong>Order Time:</strong>{" "}
                        {new Date(ord.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <strong>Order ID:</strong> {ord._id}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <p className="text-zinc-400 mt-4">No orders found.</p>
      )}
    </div>
  );
};

export default AdminAllOrders;
