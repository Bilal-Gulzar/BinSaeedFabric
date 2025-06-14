
import { format, parseISO } from "date-fns";
interface Item {
  id: string;
  _key: string;
  productName: string;
  size?: string;
  quantity: number;
  price: number;
}

interface Product {
  _id: string;
  _createdAt: Date;
  orderDate: string;
  customerName: string;
  subtotal: number;
  city: string;
  phone: number;
  address: string;
  customerEmail: string;
  paymentMethod: string;
  paymentStatus: string;
  isPaid: boolean;
  shippingFee: number;
  totalAmount: number;
  items: Item[];
}

const getdate = (date: string) => format(parseISO(date), "MMMM d, yyyy");
const currentYear = new Date().getFullYear();


export function generateCustomerEmail(order:Product) {
    const itemRows = order.items
      .map((item) => {
        return `
          <tr>
            <td class="item-name">${item.productName}
              ${item.size ? `<span class="item-variant">Size: ${item.size}</span>` : ""}
            </td>
            <td>${item.quantity}</td>
            <td>RS.${item.price * item.quantity}</td>
          </tr>
        `;
      })
      .join("");
  return `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* Base Styles */
        body {
            font-family: 'Montserrat', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #fafafa;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }

        /* Main Container */
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            box-shadow: 0 5px 40px rgba(0,0,0,0.08);
            overflow: hidden;
            border-radius: 10px;
        }

        /* Header */
        .email-header {
            padding: 56px 40px 32px;
            text-align: center;
            background: #ffffff;
            position: relative;
            overflow: hidden;
        }

        .header-pattern {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 8px;
            background: repeating-linear-gradient(
                -45deg,
                #000000,
                #000000 2px,
                #ffffff 2px,
                #ffffff 4px
            );
        }

        .email-header h1 {
            font-weight: 700;
            font-size: 34px;
            margin: 0 0 16px;
            color: #000000;
            letter-spacing: -0.5px;
            position: relative;
        }

        .email-header h1:after {
            content: "";
            display: block;
            width: 60px;
            height: 3px;
            background: #000000;
            margin: 20px auto 0;
        }

        .email-header p {
            font-weight: 400;
            color: #666666;
            margin: 24px auto 0;
            font-size: 16px;
            max-width: 80%;
            line-height: 1.6;
        }

        /* Content */
        .email-content {
            padding: 40px;
        }

        /* Summary Card */
        .summary-card {
            background: #f9f9f9;
            border-radius: 10px;
            padding: 32px;
            margin-bottom: 40px;
            border: 1px solid #f0f0f0;
        }

        .summary-title {
            font-weight: 700;
            font-size: 18px;
            margin-bottom: 24px;
            color: #000000;
            text-transform: uppercase;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
        }

        .summary-title:before {
            content: "";
            display: inline-block;
            width: 18px;
            height: 18px;
            background-color: #000000;
            margin-right: 12px;
            border-radius: 2px;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
        }

        .summary-item {
            margin-bottom: 8px;
        }

        .summary-label {
            font-weight: 500;
            font-size: 13px;
            color: #777777;
            display: block;
            margin-bottom: 6px;
            letter-spacing: 0.5px;
        }

        .summary-value {
            font-weight: 600;
            font-size: 16px;
            color: #000000;
        }

        /* Order Table */
        .order-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 40px 0;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 6px rgba(0,0,0,0.03);
        }

        .order-table thead {
            background-color: #f5f5f5;
        }

        .order-table th {
            text-align: left;
            padding: 18px 24px;
            font-weight: 600;
            font-size: 14px;
            color: #555555;
            border-bottom: 1px solid #eeeeee;
        }

        .order-table td {
            padding: 18px 24px;
            border-bottom: 1px solid #f0f0f0;
            vertical-align: middle;
        }

        .order-table .item-name {
            font-weight: 500;
            color: #000000;
        }

        .order-table .item-variant {
            font-size: 13px;
            color: #777777;
            display: block;
            margin-top: 4px;
        }

        .order-table .total-row {
            font-weight: 700;
            background-color: #f9f9f9;
        }

        /* Shipping Card */
        .shipping-card {
            background: #f9f9f9;
            padding: 32px;
            border-radius: 10px;
            margin: 48px 0;
            border-left: 4px solid #000000;
            position: relative;
        }

        .shipping-icon {
            position: absolute;
            top: -16px;
            right: 24px;
            background: #000000;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .shipping-icon svg {
            width: 16px;
            height: 16px;
            fill: #ffffff;
        }

        .section-title {
            font-weight: 700;
            font-size: 18px;
            margin-bottom: 20px;
            color: #000000;
        }

        .shipping-address {
            margin-bottom: 8px;
            font-weight: 500;
        }

        .shipping-details {
            color: #666666;
            line-height: 1.6;
            margin-bottom: 16px;
        }

        .delivery-info {
            display: flex;
            align-items: center;
            margin-top: 16px;
        }

        .delivery-icon {
            margin-right: 12px;
        }

        /* Timeline */
        .timeline {
            margin: 48px 0;
            position: relative;
        }

        .timeline:before {
            content: "";
            position: absolute;
            top: 0;
            left: 11px;
            height: 100%;
            width: 2px;
            background: #e0e0e0;
        }

        .timeline-step {
            display: flex;
            margin-bottom: 32px;
            position: relative;
        }

        .timeline-step:last-child {
            margin-bottom: 0;
        }

        .timeline-marker {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #000000;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 24px;
            flex-shrink: 0;
            position: relative;
            z-index: 1;
        }

        .timeline-marker svg {
            width: 12px;
            height: 12px;
            fill: #ffffff;
        }

        .timeline-content {
            flex: 1;
            padding-top: 2px;
        }

        .timeline-title {
            font-weight: 700;
            margin-bottom: 8px;
            color: #000000;
        }

        .timeline-description {
            font-size: 14px;
            color: #666666;
            line-height: 1.6;
        }

        /* Button */
        .email-button {
            display: inline-block;
            padding: 18px 40px;
            background-color: #000000;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin: 32px 0;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            letter-spacing: 0.5px;
        }

        .email-button:hover {
            background-color: #222222;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.15);
        }

        /* Footer */
        .email-footer {
            text-align: center;
            padding: 48px 40px;
            background: #f5f5f5;
            font-size: 13px;
            color: #999999;
            border-top: 1px solid #eeeeee;
        }

        .footer-logo {
            font-weight: 700;
            font-size: 22px;
            color: #000000;
            margin-bottom: 20px;
            display: inline-block;
            letter-spacing: 1px;
            position: relative;
        }

        .footer-logo:after {
            content: "";
            display: block;
            width: 40px;
            height: 2px;
            background: #000000;
            margin: 12px auto 0;
        }

        .footer-links {
            margin: 24px 0;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
        }

        .footer-links a {
            color: #666666;
            text-decoration: none;
            margin: 0 12px;
            font-weight: 500;
            transition: color 0.2s;
        }

        .footer-links a:hover {
            color: #000000;
        }

        .footer-social {
            margin: 24px 0;
        }

        .social-icon {
            display: inline-block;
            width: 36px;
            height: 36px;
            background: #ffffff;
            border-radius: 50%;
            margin: 0 6px;
            text-align: center;
            line-height: 36px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            transition: all 0.2s;
        }

        .social-icon:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .footer-copyright {
            margin-top: 24px;
        }

        /* Responsive */
        @media only screen and (max-width: 600px) {
            .email-header {
                padding: 40px 24px;
            }

            .email-header h1 {
                font-size: 28px;
            }

            .email-header p {
                max-width: 100%;
            }

            .email-content {
                padding: 24px;
            }

            .summary-grid {
                grid-template-columns: 1fr;
            }

            .order-table th,
            .order-table td {
                padding: 14px 16px;
            }

            .shipping-card,
            .summary-card {
                padding: 24px;
            }

            .email-button {
                padding: 16px 32px;
            }

            .footer-links a {
                margin: 6px 10px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-header">
            <div class="header-pattern"></div>
            <h1>Order Confirmed</h1>
            <p>Thank you for your purchase! We're preparing your order and will notify you when it ships.</p>
        </div>

        <div class="email-content">
            <div class="summary-card">
                <div class="summary-title">Order Summary</div>
                <div class="summary-grid">
                    <div class="summary-item">
                        <span class="summary-label">Order Number</span>
                        <span class="summary-value">${order._id}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Order Date</span>
                        <span class="summary-value">${getdate(order.orderDate as string)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Payment Method</span>
                        <span class="summary-value">${order.paymentMethod == "cod" ? "Cash on Delivery (COD)" : "Online payment"}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Total Amount</span>
                        <span class="summary-value">RS.${order.totalAmount}</span>
                    </div>
                </div>
            </div>
            <table class="order-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                ${itemRows}
                </tbody>
            </table>

            <div class="shipping-card">
                <div class="section-title">Shipping Information</div>
                <div class="shipping-address">${order.customerName}</div>
                <div class="shipping-details">
                         ${order.address}<br>
                         ${order.phone}<br>
                          ${order.city}
                </div>
            </div>

            <div class="timeline">
                <div class="timeline-step">
                    <div class="timeline-content">
                        <div class="timeline-title">Order ${order.paymentMethod == "cod" ? "Received" : "Confirmed"}</div>
                        <div class="timeline-description">${order.paymentMethod == "cod" ? "We have successfully received your order and it is currently being processed." : "We've received your order and payment has been processed."}</div>
                    </div>
                </div>

                <div class="timeline-step">
                   
                    <div class="timeline-content">
                        <div class="timeline-title">Processing Order</div>
                        <div class="timeline-description">Our team is carefully preparing your items for shipment.</div>
                    </div>
                </div>

                <div class="timeline-step">
                    <div class="timeline-content">
                        <div class="timeline-title">Shipped</div>
                        <div class="timeline-description">You'll receive tracking information when your order leaves our warehouse.</div>
                    </div>
                </div>
            </div>

            <center>
                <a href=${process.env.NEXT_PUBLIC_BASE_URL + "/orders/" + order._id} class="email-button">Track Your Order</a>
            </center>

            <p style="text-align: center; color: #666; font-size: 14px; margin-top: 16px;">
                Need help? Reply to this email or contact us at <a href="mailto:tselffabric@gmail.com" style="color: #000; font-weight: 500;">tselffabric@gmail.com</a>
            </p>
        </div>
            <p><a href=${process.env.NEXT_PUBLIC_BASE_URL}>T Self.com</a></p>
            <div class="footer-copyright">
                © ${currentYear} T Self Fabric. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
    `;
}

export function generateAdminEmail(order: Product) {
  const itemRows = order.items
    .map((item) => {
      return `
          <tr>
            <td class="item-name">${item.productName}
              ${item.size ? `<span class="item-variant">Size: ${item.size}</span>` : ""}
            </td>
            <td>${item.quantity}</td>
            <td>RS.${item.price * item.quantity}</td>
          </tr>
        `;
    })
    .join("");
  return `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* Base Styles */
        body {
            font-family: 'Montserrat', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #fafafa;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }

        /* Main Container */
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            box-shadow: 0 5px 40px rgba(0,0,0,0.08);
            overflow: hidden;
            border-radius: 10px;
        }

        /* Header */
        .email-header {
            padding: 56px 40px 32px;
            text-align: center;
            background: #ffffff;
            position: relative;
            overflow: hidden;
        }

        .header-pattern {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 8px;
            background: repeating-linear-gradient(
                -45deg,
                #000000,
                #000000 2px,
                #ffffff 2px,
                #ffffff 4px
            );
        }

        .email-header h1 {
            font-weight: 700;
            font-size: 34px;
            margin: 0 0 16px;
            color: #000000;
            letter-spacing: -0.5px;
            position: relative;
        }

        .email-header h1:after {
            content: "";
            display: block;
            width: 60px;
            height: 3px;
            background: #000000;
            margin: 20px auto 0;
        }

        .email-header p {
            font-weight: 400;
            color: #666666;
            margin: 24px auto 0;
            font-size: 16px;
            max-width: 80%;
            line-height: 1.6;
        }

        /* Content */
        .email-content {
            padding: 40px;
        }

        /* Summary Card */
        .summary-card {
            background: #f9f9f9;
            border-radius: 10px;
            padding: 32px;
            margin-bottom: 40px;
            border: 1px solid #f0f0f0;
        }

        .summary-title {
            font-weight: 700;
            font-size: 18px;
            margin-bottom: 24px;
            color: #000000;
            text-transform: uppercase;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
        }

        .summary-title:before {
            content: "";
            display: inline-block;
            width: 18px;
            height: 18px;
            background-color: #000000;
            margin-right: 12px;
            border-radius: 2px;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
        }

        .summary-item {
            margin-bottom: 8px;
        }

        .summary-label {
            font-weight: 500;
            font-size: 13px;
            color: #777777;
            display: block;
            margin-bottom: 6px;
            letter-spacing: 0.5px;
        }

        .summary-value {
            font-weight: 600;
            font-size: 16px;
            color: #000000;
        }

        /* Order Table */
        .order-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 40px 0;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 6px rgba(0,0,0,0.03);
        }

        .order-table thead {
            background-color: #f5f5f5;
        }

        .order-table th {
            text-align: left;
            padding: 18px 24px;
            font-weight: 600;
            font-size: 14px;
            color: #555555;
            border-bottom: 1px solid #eeeeee;
        }

        .order-table td {
            padding: 18px 24px;
            border-bottom: 1px solid #f0f0f0;
            vertical-align: middle;
        }

        .order-table .item-name {
            font-weight: 500;
            color: #000000;
        }

        .order-table .item-variant {
            font-size: 13px;
            color: #777777;
            display: block;
            margin-top: 4px;
        }

        .order-table .total-row {
            font-weight: 700;
            background-color: #f9f9f9;
        }

        /* Shipping Card */
        .shipping-card {
            background: #f9f9f9;
            padding: 32px;
            border-radius: 10px;
            margin: 48px 0;
            border-left: 4px solid #000000;
            position: relative;
        }

        .shipping-icon {
            position: absolute;
            top: -16px;
            right: 24px;
            background: #000000;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .shipping-icon svg {
            width: 16px;
            height: 16px;
            fill: #ffffff;
        }

        .section-title {
            font-weight: 700;
            font-size: 18px;
            margin-bottom: 20px;
            color: #000000;
        }

        .shipping-address {
            margin-bottom: 8px;
            font-weight: 500;
        }

        .shipping-details {
            color: #666666;
            line-height: 1.6;
            margin-bottom: 16px;
        }

        .delivery-info {
            display: flex;
            align-items: center;
            margin-top: 16px;
        }

        .delivery-icon {
            margin-right: 12px;
        }

        /* Timeline */
        .timeline {
            margin: 48px 0;
            position: relative;
        }

        .timeline:before {
            content: "";
            position: absolute;
            top: 0;
            left: 11px;
            height: 100%;
            width: 2px;
            background: #e0e0e0;
        }

        .timeline-step {
            display: flex;
            margin-bottom: 32px;
            position: relative;
        }

        .timeline-step:last-child {
            margin-bottom: 0;
        }

        .timeline-marker {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #000000;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 24px;
            flex-shrink: 0;
            position: relative;
            z-index: 1;
        }

        .timeline-marker svg {
            width: 12px;
            height: 12px;
            fill: #ffffff;
        }

        .timeline-content {
            flex: 1;
            padding-top: 2px;
        }

        .timeline-title {
            font-weight: 700;
            margin-bottom: 8px;
            color: #000000;
        }

        .timeline-description {
            font-size: 14px;
            color: #666666;
            line-height: 1.6;
        }

        /* Button */
        .email-button {
            display: inline-block;
            padding: 18px 40px;
            background-color: #000000;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin: 32px 0;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            letter-spacing: 0.5px;
        }

        .email-button:hover {
            background-color: #222222;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.15);
        }

        /* Footer */
        .email-footer {
            text-align: center;
            padding: 48px 40px;
            background: #f5f5f5;
            font-size: 13px;
            color: #999999;
            border-top: 1px solid #eeeeee;
        }

        .footer-logo {
            font-weight: 700;
            font-size: 22px;
            color: #000000;
            margin-bottom: 20px;
            display: inline-block;
            letter-spacing: 1px;
            position: relative;
        }

        .footer-logo:after {
            content: "";
            display: block;
            width: 40px;
            height: 2px;
            background: #000000;
            margin: 12px auto 0;
        }

        .footer-links {
            margin: 24px 0;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
        }

        .footer-links a {
            color: #666666;
            text-decoration: none;
            margin: 0 12px;
            font-weight: 500;
            transition: color 0.2s;
        }

        .footer-links a:hover {
            color: #000000;
        }

        .footer-social {
            margin: 24px 0;
        }

        .social-icon {
            display: inline-block;
            width: 36px;
            height: 36px;
            background: #ffffff;
            border-radius: 50%;
            margin: 0 6px;
            text-align: center;
            line-height: 36px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            transition: all 0.2s;
        }

        .social-icon:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .footer-copyright {
            margin-top: 24px;
        }

        /* Responsive */
        @media only screen and (max-width: 600px) {
            .email-header {
                padding: 40px 24px;
            }

            .email-header h1 {
                font-size: 28px;
            }

            .email-header p {
                max-width: 100%;
            }

            .email-content {
                padding: 24px;
            }

            .summary-grid {
                grid-template-columns: 1fr;
            }

            .order-table th,
            .order-table td {
                padding: 14px 16px;
            }

            .shipping-card,
            .summary-card {
                padding: 24px;
            }

            .email-button {
                padding: 16px 32px;
            }

            .footer-links a {
                margin: 6px 10px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-header">
            <div class="header-pattern"></div>
            <h1>New Order Revceived!</h1>
            <p>We have received a new order in the system. Please review the order details and initiate the necessary processing steps to ensure timely fulfillment.</p>
        </div>

        <div class="email-content">
            <div class="summary-card">
                <div class="summary-title">Order Summary</div>
                <div class="summary-grid">
                    <div class="summary-item">
                        <span class="summary-label">Order Number</span>
                        <span class="summary-value">${order._id}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Order Date</span>
                        <span class="summary-value">${getdate(order.orderDate as string)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Payment Method</span>
                        <span class="summary-value">${order.paymentMethod == "cod" ? "Cash on Delivery (COD)" : "Online payment"}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Total Amount</span>
                        <span class="summary-value">RS.${order.totalAmount}</span>
                    </div>
                </div>
            </div>
            <table class="order-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                ${itemRows}
                </tbody>
            </table>

              <div class="shipping-card">
                <div class="section-title">Shipping Information</div>
                <div class="shipping-address">${order.customerName}</div>
                <div class="shipping-details">
                         ${order.address}<br>
                         ${order.phone}<br>
                          ${order.city}
                </div>
            </div>

            <div class="timeline">
                <div class="timeline-step">
                    <div class="timeline-content">
                        <div class="timeline-title">Order ${order.paymentMethod == "cod" ? "Received" : "Confirmed"}</div>
                        <div class="timeline-description">${order.paymentMethod == "cod" ? "We have successfully received your order and it is currently being processed." : "We've received your order and payment has been processed."}</div>
                    </div>
                </div>

                <div class="timeline-step">
                   
                    <div class="timeline-content">
                        <div class="timeline-title">Processing Order</div>
                        <div class="timeline-description">Our team is carefully preparing your items for shipment.</div>
                    </div>
                </div>

                <div class="timeline-step">
                
                    <div class="timeline-content">
                        <div class="timeline-title">Shipped</div>
                        <div class="timeline-description">You'll receive tracking information when your order leaves our warehouse.</div>
                    </div>
                </div>
            </div>

            <center>
                <a href=${process.env.NEXT_PUBLIC_BASE_URL + "/orders/" + order._id} class="email-button">View Order Detail</a>
            </center>

            <p style="text-align: center; color: #666; font-size: 14px; margin-top: 16px;">
                Need help? Reply to this email or contact us at <a href="mailto:tselffabric@gmail.com style="color: #000; font-weight: 500;">tselffabric@gmail.com</a>
            </p>
        </div>
            <p><a href=${process.env.NEXT_PUBLIC_BASE_URL}>T Self.com</a></p>
            <div class="footer-copyright">
                © ${currentYear} T Self Fabric. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
    `;
}
