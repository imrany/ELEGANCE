import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/lib/api";
import { formatPrice, formatShortDate } from "@/lib/utils";
import {
  ShoppingBag,
  Package,
  Search,
  Loader2,
  Eye,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { useOrder } from "@/contexts/OrderContext";

export default function OrdersPage() {
  const { orders, isLoading, orderCount, orderStatusCount, totalSpent } =
    useOrder();
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter orders by search
  const filteredOrders = orders?.filter((order) => {
    const searchLower = search.toLowerCase();
    return (
      order.id?.toLowerCase().includes(searchLower) ||
      order.status?.toLowerCase().includes(searchLower) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchLower))
    );
  });

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { variant: any; label: string; color: string }
    > = {
      pending: {
        variant: "secondary",
        label: "Pending",
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      },
      processing: {
        variant: "default",
        label: "Processing",
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      },
      shipped: {
        variant: "default",
        label: "Shipped",
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      },
      delivered: {
        variant: "default",
        label: "Delivered",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      },
      cancelled: {
        variant: "destructive",
        label: "Cancelled",
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      },
    };
    return (
      variants[status] || { variant: "secondary", label: status, color: "" }
    );
  };

  // Get payment status badge
  const getPaymentBadge = (status: string) => {
    const variants: Record<string, { label: string; color: string }> = {
      pending: {
        label: "Payment Pending",
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      },
      paid: {
        label: "Paid",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      },
      failed: {
        label: "Failed",
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      },
    };
    return (
      variants[status] || { label: status, color: "bg-gray-100 text-gray-800" }
    );
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleDownloadInvoice = (orderId: string) => {
    // This would typically generate a PDF invoice
    toast.success("Invoice download started");
    // Implementation: window.open(`/api/orders/${orderId}/invoice`);
  };

  return (
    <Layout>
      <div className="container py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-light text-foreground md:text-4xl">
            My Orders
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track and manage your order history
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{orderCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">
                  {orderStatusCount?.pending || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">
                  {formatPrice(totalSpent?.completed || 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        {!isLoading && orders && (
          <div className="mb-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Orders List */}
        {isLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-accent" />
              <p className="mt-4 text-muted-foreground">Loading orders...</p>
            </CardContent>
          </Card>
        ) : !filteredOrders || filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 font-serif text-xl font-light text-foreground">
                {search ? "No orders found" : "No orders yet"}
              </h3>
              <p className="mt-2 text-center text-muted-foreground">
                {search
                  ? "Try adjusting your search criteria"
                  : "Start shopping to see your orders here"}
              </p>
              {!search && (
                <Button asChild className="mt-6">
                  <Link to="/">Start Shopping</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusBadge = getStatusBadge(order.status);
              const paymentBadge = getPaymentBadge(order.payment_status);

              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-secondary/30 pb-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle className="text-base">
                          Order #{order.id?.substring(0, 8)}
                        </CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {formatShortDate(order.created_at)}
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge.color}`}
                        >
                          {statusBadge.label}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${paymentBadge.color}`}
                        >
                          {paymentBadge.label}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {/* Items Preview */}
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div
                              key={index}
                              className="h-12 w-12 overflow-hidden rounded-full border-2 border-background bg-secondary"
                            >
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-background bg-secondary text-xs font-medium">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {order.items.length}{" "}
                            {order.items.length === 1 ? "item" : "items"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.items
                              .slice(0, 2)
                              .map((item) => item.name)
                              .join(", ")}
                            {order.items.length > 2 && "..."}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Order Total and Actions */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Total</p>
                          <p className="text-lg font-bold text-foreground">
                            {formatPrice(order.total)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadInvoice(order.id!)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Order Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-4 mt-4">
                {/* Order Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-semibold">
                      Order #{selectedOrder.id?.substring(0, 8)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatShortDate(selectedOrder.created_at)}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(selectedOrder.status).color}`}
                    >
                      {getStatusBadge(selectedOrder.status).label}
                    </span>
                    <br />
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getPaymentBadge(selectedOrder.payment_status).color}`}
                    >
                      {getPaymentBadge(selectedOrder.payment_status).label}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Items */}
                <div>
                  <h3 className="mb-3 font-medium">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded border border-border bg-secondary">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                            {item.size && ` · Size: ${item.size}`}
                            {item.color && ` · Color: ${item.color}`}
                          </p>
                          <p className="mt-1 font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>
                      {selectedOrder.delivery_fee === 0 ? (
                        <span className="font-medium text-green-600">FREE</span>
                      ) : (
                        formatPrice(selectedOrder.delivery_fee)
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                <Separator />

                {/* Shipping & Contact Info */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-4 w-4" />
                      Shipping Address
                    </h3>
                    <p className="text-sm">
                      {selectedOrder.customer.first_name}{" "}
                      {selectedOrder.customer.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.shipping.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.shipping.city}
                      {selectedOrder.shipping.postalCode &&
                        `, ${selectedOrder.shipping.postalCode}`}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <Phone className="h-4 w-4" />
                      Contact Info
                    </h3>
                    <p className="text-sm">{selectedOrder.customer.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.customer.phone_number}
                    </p>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="mb-2 text-sm font-medium">
                        Delivery Notes
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedOrder.notes}
                      </p>
                    </div>
                  </>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link to={`/order-confirmation/${selectedOrder.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Full Details
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadInvoice(selectedOrder.id!)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Invoice
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
