import { genSecret } from '../../../util/crypto/genSecret';
import { EUserRole } from '../user/User.enum';

export const AppointmentTemplates = {
  receipt: (appointment: any, role: EUserRole) => /* html */ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Booking Receipt</title>
        <style>
          /* Reset and base */
          body {
            margin: 0 auto;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            width: 100vw;
            height: 100vh;
          }
        
          /* Container */
          .receipt-container {
            width: 100vw;
            background: white;
            border-radius: 1rem; /* rounded-xl */
            border: 1px solid #e5e7eb;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1); /* receipt-shadow */
            overflow: hidden;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
        
          /* Header */
          .header {
            background-color: #2563eb; /* blue-600 */
            color: white;
            padding: 1.5rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        
          .header h1 {
            font-size: 1.5rem; /* text-2xl */
            font-weight: 700;
            letter-spacing: 0.05em; /* tracking-wide */
            margin: 0;
          }
        
          .header p {
            margin-top: 0.25rem;
            font-size: 0.75rem; /* text-xs */
            color: #bfdbfe; /* blue-100 */
          }
        
          .header .date {
            font-weight: 600;
            font-size: 0.875rem; /* text-sm */
          }
        
          .font-mono {
            font-family: monospace, monospace;
          }
        
          /* Body */
          .body {
            padding: 1.5rem 2rem;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 1.5rem; /* space-y-6 */
            color: #374151; /* gray-700 */
            font-size: 0.875rem; /* text-sm */
          }
        
          /* Info grid */
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem; /* gap-6 */
          }
        
          .info-item p:first-child {
            color: #9ca3af; /* gray-400 */
            margin: 0 0 0.25rem 0;
          }
        
          .info-item p:last-child {
            font-weight: 600;
            margin: 0;
          }
        
          .info-item.col-span-2 {
            grid-column: span 2;
          }
        
          a.address-link {
            color: #2563eb; /* text-blue-600 */
            text-decoration: none;
          }
        
          a.address-link:hover {
            text-decoration: underline;
          }
        
          /* Services table */
          .services-table {
            margin: 1rem 0 0 0;
            border: 1px solid #e5e7eb; /* border-gray-200 */
            border-radius: 0.375rem; /* rounded-md */
            overflow: hidden;
          }
        
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.875rem;
            color: #374151; /* gray-700 */
          }
        
          thead {
            background-color: #f9fafb; /* bg-gray-50 */
            color: #6b7280; /* text-gray-500 */
            text-transform: uppercase;
            font-size: 0.75rem;
          }
        
          th, td {
            padding: 0.5rem 1rem;
          }
        
          th {
            text-align: left;
          }
        
          tbody tr {
            border-top: 1px solid #e5e7eb; /* border-t */
          }
        
          td.price {
            text-align: right;
          }
        
          tbody tr.no-services td {
            text-align: center;
            font-style: italic;
            color: #9ca3af; /* text-gray-400 */
            padding: 1rem 0;
          }
        
          /* Total */
          .total {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1rem;
            font-weight: 600;
            font-size: 1.125rem; /* text-lg */
            color: #2563eb; /* text-blue-600 */
          }
        
          /* QR Code */
          .qr-code-section {
            text-align: center;
            padding-top: 2rem;
            color: #6b7280; /* gray-500 */
          }
        
          .qr-code-section p {
            margin: 0.25rem 0;
          }
        
          .qr-code-section img {
            display: inline-block;
            width: 120px;
            height: 120px;
          }
        
          .qr-code-section .qr-id {
            font-size: 0.75rem; /* text-xs */
            color: #9ca3af; /* gray-400 */
            margin-top: 0.25rem;
            font-family: monospace, monospace;
          }
        
          /* Footer */
          .footer {
            background-color: #eff6ff; /* bg-blue-50 */
            color: #3b82f6; /* text-blue-500 */
            text-align: center;
            font-size: 0.75rem; /* text-xs */
            padding: 1rem 0;
            border-top: 1px solid #e0e7ff; /* border-t */
          }
        
        </style>
      </head>
        
      <body>
        <div class="receipt-container">
          <!-- Header -->
          <div class="header">
            <div>
              <h1>Booking Receipt</h1>
              <p>
                Receipt ID:
                <span class="font-mono" style="font-weight: 600">${appointment?._id ?? genSecret(8)}</span>
              </p>
            </div>
            <div class="date">
              ${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>
            
          <!-- Body -->
          <div class="body">
            <!-- Info -->
            <div class="info-grid">
              <div class="info-item">
                <p>Customer</p>
                <p>${appointment?.user?.name ?? 'Unknown'}</p>
              </div>
              <div class="info-item">
                <p>Phone</p>
                <p>
                  ${(role === EUserRole.USER ? appointment?.salon?.contact : appointment?.user?.phone) ?? 'Unknown'}
                </p>
              </div>
              <div class="info-item">
                <p>Salon</p>
                <p>${appointment?.salon?.name ?? 'Unknown'}</p>
              </div>
              <div class="info-item">
                <p>Address</p>
                <p>
                  <a
                    href="https://www.google.com/maps?q=${appointment?.salon?.location?.coordinates?.[1]},${appointment?.salon?.location?.coordinates?.[0]}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="address-link"
                  >
                    ${appointment?.salon?.location?.address ?? 'Unknown'}
                  </a>
                </p>
              </div>
              <div class="info-item">
                <p>Booking Date</p>
                <p>
                  ${new Date(
                    appointment?.date ?? Date.now(),
                  ).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div class="info-item">
                <p>Time</p>
                <p>
                  ${new Date(
                    appointment?.date ?? Date.now(),
                  ).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  })}
                </p>
              </div>
              <div class="info-item col-span-2">
                <p>Specialist</p>
                <p>${appointment?.specialist?.name ?? 'Unknown'}</p>
              </div>
            </div>
                
            <!-- Services -->
            <div class="services-table">
              <table>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th class="price">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    appointment?.services?.length
                      ? appointment.services
                          .map(
                            (service: any) => `
                            <tr>
                              <td>${service?.name ?? 'N/A'}</td>
                              <td class="price">$${Number(service?.price ?? 0).toFixed(2)}</td>
                            </tr>
                          `,
                          )
                          .join('')
                      : `<tr class="no-services"><td colspan="2">No services listed</td></tr>`
                  }
                </tbody>
              </table>
            </div>
                
            <!-- Total -->
            <div class="total">
              <span>Total Amount</span>
              <span>$${Number(appointment?.amount ?? 0).toFixed(2)}</span>
            </div>
                
            <!-- QR Code -->
            <div class="qr-code-section">
              <p>Scan this QR to verify your appointment ID</p>
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                  appointment?._id ?? genSecret(8),
                )}"
                alt="Appointment QR Code"
              />
              <p class="qr-id">ID: <span>${appointment?._id ?? genSecret(8)}</span></p>
            </div>
          </div>
              
          <!-- Footer -->
          <div class="footer">
            Thank you for booking with <strong>${appointment?.salon?.name ?? 'our salon'}</strong>.
          </div>
        </div>
      </body>
    </html>
  `,
};
