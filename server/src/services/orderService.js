const Order = require('../models/orderModel')
const DeliveryStatus = require('../models/deliveryStatusModel')
const Sunglasses = require('../models/sunglassesModel')
const User = require('../models/userModel')
const Payment = require('../models/paymentModel')

class OrderService {
    async createOrder(orderData, userId) {     // CREATE ORDER WITHOUT DELIVERY LOGIC
    
        // INIT ORDER OBJECT TO CALCULATE
        const order = new Order(orderData);
    
        // CALCULATE PRICE AND TOTAL ITEMS --> decrease stock of sunglasses
        order.totalItems = 0;
        order.totalAmount = 0;
    
        for (let i = 0; i < order.sunglasses.length; i++) {
            const sunglasses = await Sunglasses.findById(order.sunglasses[i]._id);
            if (!sunglasses) {
                throw new Error('Sunglasses not found');
            }
            sunglasses.stock -= order.sunglasses[i].quantity; // decrease the stock by the quantity of this type of sunglasses ordered
            if (sunglasses.stock < 0) {
                throw new Error('Not enough stock');
            }
            await sunglasses.save();
            order.totalAmount += sunglasses.price * order.sunglasses[i].quantity; // calculate the total amount based on the price and quantity of each type of sunglasses
            order.totalItems += order.sunglasses[i].quantity; // update totalItems based on the quantity of each type of sunglasses
        }
    
        // SAVE CALCULATED ORDER FIELDS INTO SECOND OBJECT --> save to the database
        const orderModelData = new Order({
            orderDate: order.orderDate,
            status: 'pending',
            totalItems: order.totalItems,
            totalAmount: order.totalAmount,
            orderType: 'pending', // Initially set to null
    
            sunglasses: order.sunglasses,
            payment: null,
            user: userId,
            deliveryStatus: null // Initially set to null
        });
    
        // SAVE ORDER TO MONGO
        await orderModelData.save();
    
        // RETURN THE ORDER OBJECT
        return orderModelData;
    }
    async cancelOrder(orderId) {     // CANCEL ORDER - ALSO RESETS SUNGLASSES

        // FIND THE ORDER TO CANCEL
        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
    
        // Loop through the sunglasses array and increase the stock
        for (let i = 0; i < order.sunglasses.length; i++) {
            const sunglasses = await Sunglasses.findById(order.sunglasses[i]._id);
            if (!sunglasses) {
                throw new Error('Sunglasses not found');
            }
            sunglasses.stock += order.sunglasses[i].quantity; // increase the stock by the quantity of this type of sunglasses ordered
            await sunglasses.save();
        }
    
        if (order.deliveryStatus) {
            // Remove the orderType
            const deliveryStatus = await DeliveryStatus.findByIdAndDelete(order.deliveryStatus);
            if (!deliveryStatus) {
                throw new Error('Delivery status not found');
            }
        }

        order.status = 'cancelled';
        order.deliveryStatus = null;
    
        await order.save();
        return order;
    }    
}
module.exports.OrderService = OrderService;

module.exports.CreateOrderService = async (id, orderData) => {
    try {
        const orderService = new OrderService();

        // FIND THE USER WHO PLACES ORDER
        const userToUpdate = await User.findById(id);
        if (!userToUpdate) {
            throw new Error('User not found');
        }

        try {
            // PLACING THE ORDER
            const newOrder = await orderService.createOrder(orderData, userToUpdate._id);

            const updatedUser = await User.findOneAndUpdate(
                { _id: id },
                { $push: { order: newOrder._id } },
                { new: true }
            );
            
            return newOrder; // Return the created order
        } catch (error) {
            throw error;
        }
    } catch (error) {
        throw error;
    }
}
module.exports.OrderDeliveryService = async (id, deliveryStatusData) => {
    const orderToUpdate = await Order.findById(id)
    if (!orderToUpdate) {
        throw new Error('Order not found')
    }

    let deliveryStatus
    
    // create the delivery Status and ordertype
    if (orderToUpdate.deliveryStatus) {
        deliveryStatus = await DeliveryStatus.findById(orderToUpdate.deliveryStatus);
        if (!deliveryStatus) {
            throw new Error('Delivery Status not found')
        }
    } else {
        deliveryStatus = new DeliveryStatus(deliveryStatusData)
    }

    if (orderToUpdate.totalAmount >= deliveryStatus.priceThreshold) {
        
        deliveryStatus.type = 'free delivery'
        deliveryStatus.deliveryDate = 'pending'
        deliveryStatus.trackingNumber = 'pending'

        orderToUpdate.orderType = 'delivery'
    } else {
        deliveryStatus.type = 'charge for delivery'
        deliveryStatus.deliveryDate = 'pending'
        deliveryStatus.trackingNumber = 'pending'

        orderToUpdate.orderType = 'delivery'
    }

    await deliveryStatus.save()
    orderToUpdate.deliveryStatus = deliveryStatus._id
    await orderToUpdate.save()

    return orderToUpdate
}
module.exports.OrderPickupService = async (id) => {
    const orderToUpdate = await Order.findById(id);
    if (!orderToUpdate) {
        throw new Error('Order not found');
    }

    let pickupStatus;

    // Create the pickup status and order type
    if (orderToUpdate.deliveryStatus) {
        pickupStatus = await DeliveryStatus.findById(orderToUpdate.deliveryStatus);
        if (!pickupStatus) {
            throw new Error('Pickup Status not found');
        }
    } else {
        pickupStatus = new DeliveryStatus();
    }

    pickupStatus.type = 'pickup';
    pickupStatus.deliveryAmount = undefined;
    pickupStatus.priceThreshold = undefined;
    pickupStatus.deliveryDate = undefined;
    pickupStatus.trackingNumber = undefined;

    orderToUpdate.orderType = 'pickup';
    orderToUpdate.deliveryStatus = pickupStatus._id;

    await pickupStatus.save();
    await orderToUpdate.save();

    return { orderToUpdate, pickupStatus };
}
module.exports.CancelOrderService = async (orderId) => {
    try {
        const orderService = new OrderService();

        // CANCEL THE ORDER
        const cancelledOrder = await orderService.cancelOrder(orderId);
        
        // Get the userId from the cancelledOrder
        const userId = cancelledOrder.user;

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId }, // use userId from the order
            { $pull: { order: orderId } },
            { new: true }
        );
        return true; 
    } catch (error) {
        throw error;
    }
}
module.exports.FindOrderByIdService = async (id) => {
    try {
        const order = await Order.findById(id)
        if (!order) {
            throw new Error('Order not found')
        }
        return order
    }
    catch (error) {
        throw error
    }
}
module.exports.FindAllOrdersServices = async () => {
    try {
        const orders = await Order.find()
        return orders
    }
    catch (error) {
        throw error
    }
}
module.exports.FindAllMyOrdersService = async (userId) => {
    try {
        const userOrders = await User.findById(userId)
        if (!userOrders) {
            throw new Error('User not found')
        }
        const orders = await Order.find({ _id: { $in: userOrders.order } })
        return orders
    }
    catch (error) {
        throw error
    }
}
module.exports.UpdateOrdersService = async (id, orderData) => {     // UPDATE ORDER - ADDS NEW SUNGLASSES TO THE ORDER
    try {
        // Fetch the order to update
        const orderToUpdate = await Order.findById(id);
        if (!orderToUpdate) {
            throw new Error('Order not found');
        }

        // Add new sunglasses to the order
        for (let i = 0; i < orderData.sunglasses.length; i++) {
            const sunglasses = await Sunglasses.findById(orderData.sunglasses[i]._id);
            if (!sunglasses) {
                throw new Error('Sunglasses not found');
            }
            sunglasses.stock -= orderData.sunglasses[i].quantity; // decrease the stock by the quantity of this type of sunglasses ordered
            if (sunglasses.stock < 0) {
                throw new Error('Not enough stock');
            }
            await sunglasses.save();
            orderToUpdate.totalAmount += sunglasses.price * orderData.sunglasses[i].quantity; // calculate the total amount based on the price and quantity of each type of sunglasses
            orderToUpdate.totalItems += orderData.sunglasses[i].quantity; // update totalItems based on the quantity of each type of sunglasses
            orderToUpdate.sunglasses.push(orderData.sunglasses[i]); // add the new sunglasses to the order
        }

        // Save the updated order
        await orderToUpdate.save();

        return { updatedOrder: orderToUpdate };
    } catch (error) {
        throw error;
    }
};
module.exports.UpdatePickupOrdersService = async (id) => {
    try {
        const orderToUpdate = await Order.findById(id)
        if (!orderToUpdate) {
            throw new Error('Order not found')
        }
        orderToUpdate.status = 'paid & picked up'
        await orderToUpdate.save()

        return { updatedOrder: orderToUpdate }
    } catch (error) {
        throw error;
    }
}

module.exports.DeleteOrderService = async (id) => {     // DELETE ORDER - DOES NOT ADD STOCK OF SUNGLASSES BACK
    try {
        // Fetch the order to delete
        const orderToDelete = await Order.findById(id);
        if (!orderToDelete) {
            throw new Error('Order not found');
        }
        // Remove the order from the user
        const updatedUser = await User.findOneAndUpdate(
            { _id: orderToDelete.user },
            { $pull: { order: orderToDelete._id } }
        )
        if (!updatedUser) {
            throw new Error('Failed to update user');
        }
        // Delete the associated DeliveryStatus if it exists
        if (orderToDelete.deliveryStatus) {
            const deletedDeliveryStatus = await DeliveryStatus.findByIdAndDelete(orderToDelete.deliveryStatus);
            if (!deletedDeliveryStatus) {
                throw new Error('Failed to delete DeliveryStatus');
            }
        }
        // Delete the order
        const deletedOrder = await Order.findByIdAndDelete(id);
        return true;
    } catch (error) {
        throw error;
    }
}

module.exports.RefundOrderService = async (id, sunglassesToRefund) => {
    try {
        // find the order
        const orderToRefund = await Order.findById(id)
        if (!orderToRefund) 
            throw new Error('Order not found')

        let totalRefundAmount = 0
        const refundSunglasses = []

        for (const item of sunglassesToRefund) { 
            const { _id, quantity } = item; 
            
            // Find the specific sunglasses to refund 
            const sunglasses = await Sunglasses.findById(_id) 
            if (!sunglasses) throw new Error(`Sunglasses with ID ${_id} not found`); 
            
            // Calculate the refund amount for this pair of sunglasses 
            const refundAmount = sunglasses.price * quantity; 
            totalRefundAmount += refundAmount; 
            
            // Add the sunglasses to the refund array 
            refundSunglasses.push({ _id: sunglasses._id, quantity }); 
            
            // Remove or reduce quantity from the original order 
            const orderSunglassIndex = orderToRefund.sunglasses.findIndex( (item) => item._id.toString() === _id.toString() ); 
            if (orderSunglassIndex === -1) throw new Error('Sunglasses not found in order'); 
            
            if (orderToRefund.sunglasses[orderSunglassIndex].quantity > quantity) { 
                orderToRefund.sunglasses[orderSunglassIndex].quantity -= quantity; 
            } else { 
                orderToRefund.sunglasses.splice(orderSunglassIndex, 1); 
            } 
        }

        // for (const item of sunglassesToRefund) { 
        //     const { _id, quantity } = item; 
            
        //     // Find the specific sunglasses to refund 
        //     const sunglasses = await Sunglasses.findById(_id)
        //     if (!sunglasses) 
        //         throw new Error(`Sunglasses with ID ${_id} not found`)
            
        //     // Calculate the refund amount for this pair of sunglasses 
        //     const refundAmount = sunglasses.price * quantity; 
        //     totalRefundAmount += refundAmount
            
        //     // Add the sunglasses to the refund array 
        //     refundSunglasses.push({ _id: sunglasses._id, quantity })
            
        //     // Remove or reduce quantity from the original order 
        //     const orderSunglassIndex = orderToRefund.sunglasses.findIndex( 
        //         (item) => item._id.toString() === _id.toString() 
        //     )
        //     if (orderSunglassIndex === -1) throw new Error('Sunglasses not found in order')
            
        //     if (orderToRefund.sunglasses[orderSunglassIndex].quantity > quantity) { 
        //         orderToRefund.sunglasses[orderSunglassIndex].quantity -= quantity; 
        //     } else { 
        //         orderToRefund.sunglasses.splice(orderSunglassIndex, 1); }
        // }

        // Create a new order record for the refund 
        const refundOrder = new Order({ 
            orderDate: Date.now(), 
            status: 'refunded', 
            totalItems: refundSunglasses.reduce((acc, item) => acc + item.quantity, 0), 
            totalAmount: -totalRefundAmount, // Negative value to indicate a refund 
            orderType: orderToRefund.orderType, 
            sunglasses: refundSunglasses, 
            payment: orderToRefund.payment, 
            user: orderToRefund.user, 
            deliveryStatus: orderToRefund.deliveryStatus, 
            originalOrder: orderToRefund._id,
        })
        await refundOrder.save()
        
        orderToRefund.returns = 'returned item'
        await orderToRefund.save()
        
        return { success: true, message: 'Sunglasses refunded successfully' }
    } catch (error) {
        throw error
    }
}

        // // Create a new payment record for the refund 
        // const refundPayment = new Payment({ 
        //     paymentAmount: -totalRefundAmount, // Negative value to indicate a refund 
        //     paymentDate: orderToRefund.orderDate,
        //     status: 'refunded',
        //     description: `Ordered refunded on the ${orderToRefund.orderDate}`,
        //     order: refundOrder._id, 
        // })

        // Save the new refund order and payment 
        // await refundPayment.save()
        