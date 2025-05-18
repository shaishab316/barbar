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
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: url('https://www.transparenttextures.com/patterns/paper-fibers.png');
          }
          .receipt-shadow {
            box-shadow: 0 15px 30px rgba(0,0,0,0.1);
          }
        </style>
      </head>

      <body class="bg-gray-100 flex items-center justify-center min-h-screen py-12">
        <div class="w-full max-w-2xl bg-white border rounded-xl receipt-shadow overflow-hidden">
          <!-- Header -->
          <div class="bg-blue-600 text-white px-8 py-6 flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold tracking-wide">Booking Receipt</h1>
              <p class="text-xs text-blue-100 mt-1">
                Receipt ID: <span class="font-mono">${appointment?._id ?? genSecret(8)}</span>
              </p>
            </div>
            <div class="text-sm font-semibold">
              ${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>

          <!-- Body -->
          <div class="px-8 py-6 space-y-6">
            <!-- Info -->
            <div class="grid grid-cols-2 gap-6 text-sm text-gray-700">
              <div>
                <p class="text-gray-400">Customer</p>
                <p class="font-semibold">${appointment?.user?.name ?? 'Unknown'}</p>
              </div>
              <div>
                <p class="text-gray-400">Phone</p>
                <p class="font-semibold">
                  ${(role === EUserRole.USER ? appointment?.salon?.contact : appointment?.user?.phone) ?? 'Unknown'}
                </p>
              </div>
              <div>
                <p class="text-gray-400">Salon</p>
                <p class="font-semibold">${appointment?.salon?.name ?? 'Unknown'}</p>
              </div>
              <div>
                <p class="text-gray-400">Address</p>
                <p class="font-semibold">
                  <a
                    href="https://www.google.com/maps?q=${appointment?.salon?.location?.coordinates?.[1]},${appointment?.salon?.location?.coordinates?.[0]}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:underline"
                  >
                    ${appointment?.salon?.location?.address ?? 'Unknown'}
                  </a>
                </p>
              </div>
              <div>
                <p class="text-gray-400">Booking Date</p>
                <p class="font-semibold">
                  ${new Date(
                    appointment?.date ?? Date.now(),
                  ).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p class="text-gray-400">Time</p>
                <p class="font-semibold">
                  ${new Date(
                    appointment?.date ?? Date.now(),
                  ).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  })}
                </p>
              </div>
              <div class="col-span-2">
                <p class="text-gray-400">Specialist</p>
                <p class="font-semibold">${appointment?.specialist?.name ?? 'Unknown'}</p>
              </div>
            </div>

            <!-- Services -->
            <div class="border border-gray-200 rounded-md overflow-hidden">
              <table class="min-w-full text-sm text-gray-700">
                <thead class="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th class="text-left px-4 py-2">Service</th>
                    <th class="text-right px-4 py-2">Price</th>
                  </tr>
                </thead>
                <tbody class="bg-white">
                  ${
                    appointment?.services?.length
                      ? appointment.services
                          .map(
                            (service: any) => /* html */ `
                              <tr class="border-t">
                                <td class="px-4 py-2">${service?.name ?? 'N/A'}</td>
                                <td class="px-4 py-2 text-right">$${Number(service?.price ?? 0).toFixed(2)}</td>
                              </tr>
                            `,
                          )
                          .join('')
                      : `<tr><td colspan="2" class="text-center py-4 italic text-gray-400">No services listed</td></tr>`
                  }
                </tbody>
              </table>
            </div>

            <!-- Total -->
            <div class="flex justify-between items-center pt-4 text-base font-semibold border-t border-gray-200">
              <span>Total Amount</span>
              <span class="text-blue-600 text-lg font-bold">
                $${Number(appointment?.amount ?? 0).toFixed(2)}
              </span>
            </div>

            <!-- QR Code -->
            <div class="text-center pt-8">
              <p class="text-sm text-gray-500 mb-2">Scan this QR to verify your appointment ID</p>
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                  appointment?._id ?? genSecret(8),
                )}"
                alt="Appointment QR Code"
                class="inline-block"
              />
              <p class="text-xs text-gray-400 mt-1">ID: <span class="font-mono">${appointment?._id ?? genSecret(8)}</span></p>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-blue-50 text-center text-xs text-blue-500 py-4 border-t">
            Thank you for booking with <strong>${appointment?.salon?.name ?? 'our salon'}</strong>.
          </div>
        </div>
      </body>
    </html>
  `,
};
