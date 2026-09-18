import { useEffect, useState } from "react";
import { api } from "../services/api";
import Message from "../components/Message";

export default function Billing({
  selectedAppointment,
  setSelectedAppointment,
  refreshDashboard,
}) {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");

  async function load() {
    try {
      setAppointments(await api.appointments.list());
    } catch (e) {
      setMessage(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const invoice = selectedAppointment;

  async function savePayment() {
    if (!invoice) return;

    try {
      await api.invoices.create({
        appointmentId: invoice._id,
      });

      setMessage("Payment saved successfully.");
      setSelectedAppointment(null);

      await load();
      refreshDashboard();
    } catch (e) {
      setMessage(e.message);
    }
  }

  function printBill() {
    window.print();
  }

  return (
    <div className="card billing-page">
      <div className="section-heading billing-heading">
        <h3>Billing</h3>
        <Message>{message}</Message>
      </div>

      <div className="billing-grid">

        {/* =========================
            APPOINTMENTS
        ========================= */}
        <div className="billing-list">
          <div className="muted billing-instruction">
            Select an appointment to generate a bill.
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>When</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((a) => (
                    <tr key={a._id}>
                      <td>
                        {new Date(a.datetime).toLocaleString()}
                      </td>

                      <td>
                        {a.patient?.name || ""}
                      </td>

                      <td>
                        {a.doctor?.name || ""}
                      </td>

                      <td className="actions">
                        <button
                          className="btn primary"
                          onClick={() =>
                            setSelectedAppointment(a)
                          }
                        >
                          Generate
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">
                      <div className="empty-state billing-empty">
                        No appointments found.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* =========================
            BILL PREVIEW
        ========================= */}
        <div className="bill-preview">

          <div className="bill-preview-header">
            <h4>Bill Preview</h4>
          </div>

          {invoice ? (
            <div className="invoice">

              <div className="invoice-top">
                <div>
                  <strong>Hospital Invoice</strong>
                  <div className="muted">
                    Medical Billing Receipt
                  </div>
                </div>

                <div className="invoice-label">
                  INVOICE
                </div>
              </div>

              <div className="invoice-date">
                <span>Date & Time</span>
                <strong>
                  {new Date(invoice.datetime).toLocaleString()}
                </strong>
              </div>

              <div className="invoice-info">
                <div className="invoice-info-box">
                  <span>Patient</span>
                  <strong>
                    {invoice.patient?.name || "N/A"}
                  </strong>
                </div>

                <div className="invoice-info-box">
                  <span>Doctor</span>
                  <strong>
                    {invoice.doctor?.name || "N/A"}
                  </strong>
                </div>
              </div>

              <div className="invoice-items">

                <div className="bill-row">
                  <span>Doctor Fee</span>
                  <strong>
                    Rs.{" "}
                    {Number(
                      invoice.doctor?.fee || 0
                    ).toLocaleString()}
                  </strong>
                </div>

                <div className="bill-row">
                  <span>Other Charges</span>
                  <strong>Rs. 0</strong>
                </div>

              </div>

              <div className="bill-total">
                <span>Total</span>

                <strong>
                  Rs.{" "}
                  {Number(
                    invoice.doctor?.fee || 0
                  ).toLocaleString()}
                </strong>
              </div>

            </div>
          ) : (
            <div className="empty-state bill-empty-preview">
              <div>
                <strong>No Bill Selected</strong>
                <span>
                  Choose an appointment to preview its bill.
                </span>
              </div>
            </div>
          )}

          <div className="billing-actions">
            <button
              className="btn primary"
              disabled={!invoice}
              onClick={printBill}
            >
              Print Bill
            </button>

            <button
              className="btn ghost"
              disabled={!invoice}
              onClick={savePayment}
            >
              Mark as Paid
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}