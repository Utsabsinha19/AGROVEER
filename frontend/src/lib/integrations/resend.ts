import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';
export const resend = resendApiKey && !resendApiKey.includes('YourResendApiKey')
  ? new Resend(resendApiKey)
  : null;

const SENDER = process.env.RESEND_FROM_EMAIL || 'AGROVÉ Commercial <orders@arveerimpex.com>';
const SELLER_EMAIL = process.env.RESEND_NOTIFICATION_EMAIL || 'sales@arveerimpex.com';
const BASE_URL = process.env.CLIENT_URL || 'http://localhost:3000';

export interface OrderEmailItem {
  name: string;
  sku?: string;
  hsnCode?: string;
  quantity: number;
  unitPrice: number;
  gstRate?: number;
  total?: number;
}

export interface BuyerEmailPayload {
  toEmail: string;
  customerName: string;
  orderNumber: string;
  items: OrderEmailItem[];
  totalAmount: number;
  taxableAmount?: number;
  gstAmount: number;
  paymentMethod: string;
  paymentType: 'FULL_PAYMENT' | 'TWO_STAGE_ADVANCE' | string;
  advancePaid?: number;
  balanceDue?: number;
  razorpayPaymentId?: string;
  destinationGodown?: string;
  shippingAddress: string;
  digitalSignatureHash: string;
}

export interface SellerEmailPayload {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerGstin?: string;
  companyName?: string;
  shippingAddress: string;
  destinationGodown?: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderEmailItem[];
  totalAmount: number;
  taxableAmount: number;
  gstAmount: number;
  paymentMethod: string;
  paymentType: 'FULL_PAYMENT' | 'TWO_STAGE_ADVANCE' | string;
  advancePaid: number;
  balanceDue: number;
  razorpayPaymentId?: string;
  digitalSignatureHash: string;
  totalWeightKg?: number;
}

/**
 * 1. BUYER CONFIRMATION EMAIL — Premium SaaS Botanical Architecture
 */
export async function sendBuyerOrderConfirmationEmail(payload: BuyerEmailPayload) {
  if (!resend) {
    console.log(`[Resend Sim] Buyer confirmation queued for ${payload.toEmail} (Order #${payload.orderNumber})`);
    return { success: true, simulated: true };
  }

  const itemsRows = payload.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 12px 8px; vertical-align: top;">
          <strong style="color: #102C22; font-size: 14px;">${item.name}</strong>
          ${item.sku ? `<div style="font-family: monospace; font-size: 11px; color: #24583D; margin-top: 2px;">SKU: ${item.sku} • HSN: ${item.hsnCode || '8432'}</div>` : ''}
        </td>
        <td style="padding: 12px 8px; text-align: center; font-size: 13px; color: #4B5563; vertical-align: top;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 8px; text-align: right; font-size: 13px; color: #102C22; font-weight: bold; vertical-align: top;">
          ₹${item.unitPrice.toLocaleString('en-IN')}
        </td>
      </tr>
    `
    )
    .join('');

  const isAdvance = payload.paymentType === 'TWO_STAGE_ADVANCE';
  const orderTrackUrl = `${BASE_URL}/order-success/${payload.orderNumber}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation #${payload.orderNumber}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F7F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #141A17;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F7F5F0; padding: 40px 15px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid rgba(166,201,106,0.25);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #102C22; padding: 32px 36px; text-align: left;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <span style="display: inline-block; font-family: monospace; font-size: 11px; font-weight: 700; color: #A6C96A; text-transform: uppercase; letter-spacing: 2px;">
                          Official Commercial Dossier
                        </span>
                        <h1 style="color: #F7F5F0; font-family: Georgia, serif; font-size: 26px; font-weight: 700; margin: 6px 0 0 0;">
                          ARVEER IMPEX
                        </h1>
                        <p style="color: #A6C96A; font-size: 12px; margin: 4px 0 0 0;">
                          Agroveer™ Farm Machinery & Sawking™ Industrial Cutting
                        </p>
                      </td>
                      <td align="right" style="vertical-align: middle;">
                        <span style="background-color: #24583D; color: #FFFFFF; font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 999px; text-transform: uppercase; border: 1px solid rgba(166,201,106,0.3);">
                          Confirmed
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Greeting & Order ID -->
              <tr>
                <td style="padding: 32px 36px 20px 36px;">
                  <p style="font-size: 15px; color: #4B5563; margin: 0 0 10px 0;">
                    Namaste <strong>${payload.customerName}</strong>,
                  </p>
                  <p style="font-size: 14px; color: #4B5563; line-height: 1.6; margin: 0 0 24px 0;">
                    Your commercial equipment order <strong style="color: #102C22; font-family: monospace;">#${payload.orderNumber}</strong> has been secured in our central distribution system. Your machinery has entered the factory quality assurance queue for bench testing and laser engine serial binding.
                  </p>

                  <!-- 4-Stage Lifecycle Transition Pipeline -->
                  <div style="background-color: #F7F5F0; border-radius: 14px; padding: 18px 20px; margin-bottom: 24px; border: 1px solid rgba(166,201,106,0.3);">
                    <div style="font-size: 11px; font-weight: 700; color: #24583D; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                      Fulfillment Transition Pipeline
                    </div>
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 11px; text-align: center;">
                      <tr>
                        <td width="25%" style="color: #24583D; font-weight: bold; padding-bottom: 6px;">
                          ✓ 1. Confirmed
                        </td>
                        <td width="25%" style="color: #24583D; font-weight: bold; padding-bottom: 6px;">
                          ● 2. QC & Serial
                        </td>
                        <td width="25%" style="color: #9CA3AF; padding-bottom: 6px;">
                          ○ 3. Bilty Dispatch
                        </td>
                        <td width="25%" style="color: #9CA3AF; padding-bottom: 6px;">
                          ○ 4. Delivered
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Ordered Items Table -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <thead>
                      <tr style="border-bottom: 2px solid #102C22;">
                        <th align="left" style="padding: 10px 8px; font-size: 11px; text-transform: uppercase; font-family: monospace; color: #4B5563;">Equipment / Line Item</th>
                        <th align="center" style="padding: 10px 8px; font-size: 11px; text-transform: uppercase; font-family: monospace; color: #4B5563;">Qty</th>
                        <th align="right" style="padding: 10px 8px; font-size: 11px; text-transform: uppercase; font-family: monospace; color: #4B5563;">Total (Ex. GST)</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsRows}
                    </tbody>
                  </table>

                  <!-- Statutory GST & Payment Summary -->
                  <div style="background-color: #FAFAFA; border: 1px solid #E5E7EB; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; line-height: 1.8;">
                      <tr>
                        <td style="color: #4B5563;">Statutory GST (CGST + SGST / IGST):</td>
                        <td align="right" style="color: #102C22; font-weight: 600;">₹${payload.gstAmount.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr>
                        <td style="color: #4B5563;">Total Invoiced Value:</td>
                        <td align="right" style="color: #102C22; font-weight: 700; font-size: 15px;">₹${payload.totalAmount.toLocaleString('en-IN')}</td>
                      </tr>
                      ${
                        isAdvance
                          ? `
                        <tr style="border-top: 1px dashed #D1D5DB;">
                          <td style="color: #24583D; font-weight: bold; padding-top: 8px;">20% Advance Booking Paid:</td>
                          <td align="right" style="color: #24583D; font-weight: bold; font-size: 15px; padding-top: 8px;">₹${(payload.advancePaid || 0).toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                          <td style="color: #D64527; font-weight: bold;">80% Balance Payable on Transporter Bilty:</td>
                          <td align="right" style="color: #D64527; font-weight: bold; font-size: 15px;">₹${(payload.balanceDue || 0).toLocaleString('en-IN')}</td>
                        </tr>
                      `
                          : `
                        <tr style="border-top: 1px dashed #D1D5DB;">
                          <td style="color: #24583D; font-weight: bold; padding-top: 8px;">Amount Paid in Full:</td>
                          <td align="right" style="color: #24583D; font-weight: bold; font-size: 16px; padding-top: 8px;">₹${payload.totalAmount.toLocaleString('en-IN')}</td>
                        </tr>
                      `
                      }
                      ${
                        payload.razorpayPaymentId
                          ? `
                        <tr>
                          <td style="color: #6B7280; font-size: 11px;">Payment Transaction Ref:</td>
                          <td align="right" style="font-family: monospace; font-size: 11px; color: #102C22;">${payload.razorpayPaymentId}</td>
                        </tr>
                      `
                          : ''
                      }
                    </table>
                  </div>

                  <!-- Destination Delivery Hub -->
                  <div style="background-color: #F7F5F0; border-radius: 12px; padding: 16px; margin-bottom: 28px; border-left: 4px solid #24583D;">
                    <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #24583D; margin-bottom: 4px;">
                      Destination Road Freight Transport Hub
                    </div>
                    <div style="font-size: 13px; color: #141A17; font-weight: 600;">
                      ${payload.destinationGodown || payload.shippingAddress}
                    </div>
                  </div>

                  <!-- SaaS Action Buttons -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                    <tr>
                      <td align="center">
                        <a href="${orderTrackUrl}" style="display: inline-block; background-color: #24583D; color: #FFFFFF; font-size: 13px; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(36,88,61,0.25);">
                          Track Consignment & View Live Invoice →
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Cryptographic Digital Signature & Verification -->
                  <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; font-size: 11px; color: #6B7280;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <strong>Digitally Certified by:</strong><br />
                          ARVEER IMPEX CENTRAL DISTRIBUTION DESK<br />
                          <span style="font-family: monospace; font-size: 10px; color: #24583D;">Verification Hash: ${payload.digitalSignatureHash}</span>
                        </td>
                        <td align="right" style="vertical-align: middle;">
                          <span style="display: inline-block; border: 1px solid #24583D; color: #24583D; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 10px; font-weight: bold;">
                            SEAL VERIFIED
                          </span>
                        </td>
                      </tr>
                    </table>
                  </div>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #FAFAFA; border-top: 1px solid #E5E7EB; padding: 20px 36px; text-align: center; font-size: 11px; color: #9CA3AF;">
                  Arveer Impex Commercial Hub • Plot 14, Industrial Corridor, Bhiwandi, Maharashtra 421302<br />
                  Dedicated Machinery Support Desk: +91 80049 22476 • sales@arveerimpex.com
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: SENDER,
      to: [payload.toEmail],
      subject: `Order Confirmed #${payload.orderNumber} — Arveer Impex Commercial Machinery`,
      html,
    });
    return { success: true, result };
  } catch (error) {
    console.error('Failed to send buyer Resend email:', error);
    return { success: false, error };
  }
}

/**
 * 2. SELLER / WAREHOUSE ALERT EMAIL — High-Priority SaaS Action Dispatch
 */
export async function sendSellerOrderAlertEmail(payload: SellerEmailPayload) {
  if (!resend) {
    console.log(`[Resend Sim] Seller order alert queued for ${SELLER_EMAIL} (Order #${payload.orderNumber})`);
    return { success: true, simulated: true };
  }

  const isAdvance = payload.paymentType === 'TWO_STAGE_ADVANCE';
  const adminTerminalUrl = `${BASE_URL}/admin?tab=inventory&orderId=${payload.orderNumber}`;
  const invoiceVoucherUrl = `${BASE_URL}/order-success/${payload.orderNumber}`;
  const whatsappBuyerUrl = `https://wa.me/${payload.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Namaste ${payload.customerName}, this is Arveer Impex Central Warehouse regarding your Order #${payload.orderNumber}.`
  )}`;

  const itemsRows = payload.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 10px 8px; vertical-align: top;">
          <strong style="color: #102C22; font-size: 13px;">${item.name}</strong>
          <div style="font-family: monospace; font-size: 11px; color: #24583D; margin-top: 2px;">
            SKU: ${item.sku || 'N/A'} • HSN: ${item.hsnCode || '8432'}
          </div>
        </td>
        <td style="padding: 10px 8px; text-align: center; font-size: 13px; font-weight: bold; color: #102C22; vertical-align: top;">
          ${item.quantity} units
        </td>
        <td style="padding: 10px 8px; text-align: right; font-size: 13px; color: #102C22; font-weight: bold; vertical-align: top;">
          ₹${(item.unitPrice * item.quantity).toLocaleString('en-IN')}
        </td>
      </tr>
    `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>⚡ NEW COMMERCIAL ORDER: #${payload.orderNumber}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0B1E17; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #141A17;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0B1E17; padding: 30px 15px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 660px; background-color: #FFFFFF; border-radius: 18px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.25);">
              
              <!-- Top Urgent Alert Bar -->
              <tr>
                <td style="background-color: #D64527; padding: 12px 24px; text-align: center; color: #FFFFFF; font-weight: bold; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">
                  🚨 High-Priority Machinery Order — Action Required at QC Packing Station
                </td>
              </tr>

              <!-- SaaS Dispatch Banner -->
              <tr>
                <td style="background-color: #102C22; padding: 28px 32px; color: #FFFFFF;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <span style="font-family: monospace; font-size: 12px; color: #A6C96A; text-transform: uppercase; font-weight: bold;">
                          CENTRAL WAREHOUSE DISPATCH QUEUE
                        </span>
                        <h2 style="font-family: Georgia, serif; font-size: 24px; margin: 4px 0 0 0; color: #FFFFFF;">
                          Order #${payload.orderNumber}
                        </h2>
                        <p style="font-size: 12px; color: #A6C96A; margin: 4px 0 0 0;">
                          Payment Gateway: <strong>Razorpay (Live Verified)</strong> • Method: ${payload.paymentMethod}
                        </p>
                      </td>
                      <td align="right" style="vertical-align: top;">
                        <span style="display: inline-block; background-color: ${isAdvance ? '#D4AF37' : '#24583D'}; color: ${isAdvance ? '#141A17' : '#FFFFFF'}; font-size: 11px; font-weight: 800; padding: 6px 12px; border-radius: 6px; text-transform: uppercase;">
                          ${isAdvance ? '20% ADVANCE BOOKING' : 'PAID IN FULL'}
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Consignee Profile Card -->
              <tr>
                <td style="padding: 24px 32px;">
                  
                  <div style="background-color: #F7F5F0; border-radius: 12px; padding: 18px; margin-bottom: 24px; border: 1px solid rgba(166,201,106,0.3);">
                    <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #24583D; letter-spacing: 1px; margin-bottom: 10px;">
                      Consignee & Trade Dossier
                    </div>
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; line-height: 1.6;">
                      <tr>
                        <td width="30%" style="color: #6B7280;">Buyer Name:</td>
                        <td style="color: #102C22; font-weight: bold;">${payload.customerName}</td>
                      </tr>
                      <tr>
                        <td style="color: #6B7280;">Contact Phone:</td>
                        <td style="color: #102C22; font-family: monospace; font-weight: bold;">
                          <a href="tel:${payload.customerPhone}" style="color: #24583D; text-decoration: none;">${payload.customerPhone}</a>
                        </td>
                      </tr>
                      ${
                        payload.customerEmail
                          ? `
                        <tr>
                          <td style="color: #6B7280;">Email:</td>
                          <td style="color: #102C22;">${payload.customerEmail}</td>
                        </tr>
                      `
                          : ''
                      }
                      ${
                        payload.customerGstin
                          ? `
                        <tr>
                          <td style="color: #6B7280;">Verified GSTIN:</td>
                          <td style="color: #24583D; font-family: monospace; font-weight: bold;">
                            ${payload.customerGstin} (B2B Tax Credit Eligible)
                          </td>
                        </tr>
                      `
                          : ''
                      }
                      <tr>
                        <td style="color: #6B7280; vertical-align: top;">Destination Godown:</td>
                        <td style="color: #102C22; font-weight: bold;">
                          ${payload.destinationGodown || `${payload.city}, ${payload.state} (${payload.pincode})`}
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Order Line Items -->
                  <h3 style="font-size: 14px; font-weight: bold; color: #102C22; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                    Equipment to Pick & Pack
                  </h3>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; border-top: 1px solid #102C22;">
                    ${itemsRows}
                  </table>

                  <!-- Financial Recap -->
                  <div style="background-color: #FAFAFA; border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid #E5E7EB;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px;">
                      <tr>
                        <td style="color: #6B7280;">Taxable Value:</td>
                        <td align="right" style="color: #102C22; font-weight: bold;">₹${payload.taxableAmount.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr>
                        <td style="color: #6B7280;">Total GST Collected:</td>
                        <td align="right" style="color: #102C22; font-weight: bold;">₹${payload.gstAmount.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr style="border-top: 1px solid #E5E7EB;">
                        <td style="color: #102C22; font-weight: bold; font-size: 14px; padding-top: 6px;">Grand Total Value:</td>
                        <td align="right" style="color: #102C22; font-weight: bold; font-size: 15px; padding-top: 6px;">₹${payload.totalAmount.toLocaleString('en-IN')}</td>
                      </tr>
                      ${
                        isAdvance
                          ? `
                        <tr style="border-top: 1px dashed #D1D5DB;">
                          <td style="color: #24583D; font-weight: bold; padding-top: 6px;">Advance Collected:</td>
                          <td align="right" style="color: #24583D; font-weight: bold; font-size: 14px; padding-top: 6px;">₹${payload.advancePaid.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                          <td style="color: #D64527; font-weight: bold;">Transporter To-Pay Amount:</td>
                          <td align="right" style="color: #D64527; font-weight: bold; font-size: 14px;">₹${payload.balanceDue.toLocaleString('en-IN')}</td>
                        </tr>
                      `
                          : ''
                      }
                    </table>
                  </div>

                  <!-- Mandatory SaaS Actions -->
                  <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                    <div style="font-size: 12px; font-weight: bold; color: #166534; text-transform: uppercase; margin-bottom: 12px;">
                      ⚡ Warehouse Operations Next Steps:
                    </div>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 8px;">
                          <a href="${adminTerminalUrl}" style="display: block; background-color: #24583D; color: #FFFFFF; text-decoration: none; padding: 12px 18px; border-radius: 8px; font-size: 13px; font-weight: bold; text-align: center;">
                            1. Open Terminal: Scan Engine Serial & Bind Warranty →
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px;">
                          <a href="${invoiceVoucherUrl}" style="display: block; background-color: #FFFFFF; color: #102C22; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-size: 12px; font-weight: bold; text-align: center; border: 1px solid #D1D5DB;">
                            2. Print GST Tax Invoice & E-Way Bill Packing Slip
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <a href="${whatsappBuyerUrl}" target="_blank" style="display: block; background-color: #25D366; color: #FFFFFF; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-size: 12px; font-weight: bold; text-align: center;">
                            3. Open WhatsApp Chat with Consignee
                          </a>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Signature & Hash Audit -->
                  <div style="font-family: monospace; font-size: 10px; color: #9CA3AF; text-align: center; border-top: 1px solid #E5E7EB; padding-top: 12px;">
                    Ledger Audit SHA-256: ${payload.digitalSignatureHash} • Razorpay ID: ${payload.razorpayPaymentId || 'PREPAID_VOUCHER'}
                  </div>

                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: SENDER,
      to: [SELLER_EMAIL],
      subject: `⚡ [NEW ORDER] #${payload.orderNumber} — ${payload.customerName} (₹${payload.totalAmount.toLocaleString('en-IN')})`,
      html,
    });
    return { success: true, result };
  } catch (error) {
    console.error('Failed to send seller Resend email:', error);
    return { success: false, error };
  }
}

/**
 * 3. DISPATCH & BILTY / AWB DELIVERY EMAIL
 */
export async function sendDispatchNoticeEmail({
  toEmail,
  customerName,
  orderNumber,
  carrierName,
  trackingCode,
  trackingUrl,
  biltyUrl,
}: {
  toEmail: string;
  customerName: string;
  orderNumber: string;
  carrierName: string;
  trackingCode: string;
  trackingUrl?: string;
  biltyUrl?: string;
}) {
  if (!resend) {
    console.log(`[Resend Sim] Dispatch notification queued for ${toEmail} (LR/AWB: ${trackingCode})`);
    return { success: true, simulated: true };
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 28px; border: 1px solid #e5e7eb; border-radius: 12px;">
      <h2 style="color: #102C22; font-size: 20px; margin-top: 0;">Consignment Dispatched: Order #${orderNumber}</h2>
      <p style="color: #4b5563; font-size: 14px;">Namaste <strong>${customerName}</strong>, your machinery has passed factory bench testing and has been handed over to <strong>${carrierName}</strong>.</p>

      <div style="background-color: #f7f5f0; padding: 18px; border-radius: 8px; margin: 20px 0; border: 1px solid rgba(166,201,106,0.3);">
        <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Lorry Receipt (Bilty) / AWB No:</strong> <span style="font-family: monospace; font-size: 16px; color: #102C22; font-weight: bold;">${trackingCode}</span></p>
        <p style="margin: 0; font-size: 14px;"><strong>Carrier:</strong> ${carrierName}</p>
        ${
          biltyUrl
            ? `<div style="margin-top: 14px;"><a href="${biltyUrl}" style="background-color: #24583D; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: bold; display: inline-block;">Download Official Transporter Bilty Copy</a></div>`
            : ''
        }
        ${
          trackingUrl
            ? `<div style="margin-top: 12px;"><a href="${trackingUrl}" style="color: #24583D; font-size: 13px; font-weight: bold;">Track Consignment Online →</a></div>`
            : ''
        }
      </div>

      <p style="font-size: 12px; color: #6b7280;">Please present your Bilty copy and government photo ID at the destination transport godown to take delivery.</p>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: SENDER,
      to: [toEmail],
      subject: `Consignment Dispatched #${orderNumber} — LR / AWB ${trackingCode}`,
      html,
    });
    return { success: true, result };
  } catch (error) {
    console.error('Failed to send dispatch email:', error);
    return { success: false, error };
  }
}
