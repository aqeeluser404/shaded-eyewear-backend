const Order = require('../models/orderModel');
const OrderType = require('../models/orderTypeModel');
const Sunglasses = require('../models/sunglassesModel')
const User = require('../models/userModel'); 

// <-----------------------------------------------------------> CREATE ORDER
class OrderService {

    async createOrder(orderData, orderTypeData) {
        const order = new Order(orderData);
    
        // calculate price and item amount - decrease stock of sunglasses
        order.totalAmount = 0;
        order.totalItems = 0; // initialize totalItems
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
    
        // determining order type based on order amount
        let orderType;
        if (order.orderType) {
            orderType = await OrderType.findById(order.orderType);
            if (!orderType) {
                throw new Error('OrderType not found');
            }
        } else {
            orderType = new OrderType(orderTypeData);
        }
        if (order.totalAmount >= orderType.priceThreshold) {
            orderType.type = 'delivery';
        } else {
            orderType.type = 'pickup';
        }
    
        // update db data
        await orderType.save();
        order.orderType = orderType._id;
        await order.save();
        return order;
    }
    async cancelOrder(orderId) {
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
    
        // Remove the orderType
        const orderType = await OrderType.findByIdAndDelete(order.orderType);
        if (!orderType) {
            throw new Error('OrderType not found');
        }
    
        order.status = 'cancelled';
        order.orderType = null;
    
        await order.save();
        return order;
    }    
}
module.exports.OrderService = OrderService;

module.exports.CreateOrderService = async (id, orderData, orderTypeData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const orderService = new OrderService();

            // FIND THE USER WHO PLACES ORDER
            const userToUpdate = await User.findOne({ _id: id });
            if (!userToUpdate) {
                return reject('User not found');
            }

            // PLACING THE ORDER
            const newOrder = await orderService.createOrder(orderData, orderTypeData);
            
            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: id },
                    { $push: { order: newOrder._id } },
                    { new: true }
                );
                resolve(true); 
            } catch (error) {
                reject(error);
            }
        } catch (error) {
            reject(error);
        }
    });
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
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById(id)
            if (!order) {
                return reject('Order not found')
            }
            resolve(order)
        }
        catch (error) {
            reject(error)
        }
    })
}
module.exports.FindAllOrdersServices = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const orders = await Order.find()
            resolve(orders)
        }
        catch (error) {
            reject (error)
        }
    })
}
module.exports.FindAllMyOrdersService = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // FIND THE USER WITH THEIR ORDERS
            const userOrders = await User.findById(userId);
            if (!userOrders) {
                return reject('User not found');
            }
            const orders = await Order.find({ _id: { $in: userOrders.order } })
            resolve(orders)
        }
        catch (error) {
            reject (error)
        }
    })
}
// might have to redo the update
module.exports.UpdateOrdersService = async (id, orderData, orderTypeData) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch the order to update
            const orderToUpdate = await Order.findById(id);
            if (!orderToUpdate) {
                return reject('Order not found');
            }

            // Fetch the orderType to update
            const orderTypeToUpdate = await OrderType.findById(orderToUpdate.orderType);
            if (!orderTypeToUpdate) {
                console.log('OrderType not found for orderType ID:', orderToUpdate.orderType);
                return reject('OrderType not found');
            }

            // Determine the order type based on the price threshold
            if (orderData.totalAmount >= orderTypeData.priceThreshold) {
                orderTypeToUpdate.type = 'delivery';
            } else {
                orderTypeToUpdate.type = 'pickup';
            }
            
            // Update the priceThreshold of the orderType
            orderTypeToUpdate.priceThreshold = orderTypeData.priceThreshold;

            // Update the order
            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                { 
                    totalAmount: orderData.totalAmount,
                    sunglasses: orderData.sunglasses
                },
                { new: true }
            );

            // Save the updated orderType
            await orderTypeToUpdate.save();

            resolve({ updatedOrder, updatedOrderType: orderTypeToUpdate });
        } catch (error) {
            reject(error);
        }
    });
}
module.exports.DeleteOrderService = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch the order to delete
            const orderToDelete = await Order.findById(id);
            if (!orderToDelete) {
                return reject('Order not found');
            }

            // Loop through the sunglasses array and increase the stock
            for (let i = 0; i < orderToDelete.sunglasses.length; i++) {
                const sunglasses = await Sunglasses.findById(orderToDelete.sunglasses[i]._id);
                if (!sunglasses) {
                    return reject('Sunglasses not found');
                }
                sunglasses.stock += orderToDelete.sunglasses[i].quantity; // increase the stock by the quantity of this type of sunglasses ordered
                await sunglasses.save();
            }

            // Remove the order from the user
            const updatedUser = await User.updateOne(
                { _id: orderToDelete.user }, 
                { $pull: { order: orderToDelete._id } }
            );
            if (!updatedUser) {
                return reject('Failed to update user');
            }

            // Delete the associated OrderType
            const deletedOrderType = await OrderType.findByIdAndDelete(orderToDelete.orderType);
            if (!deletedOrderType) {
                return reject('Failed to delete OrderType');
            }

            // Delete the order
            const deletedOrder = await Order.findByIdAndDelete(id);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}

