const Order = require('../models/orderModel');
const OrderType = require('../models/orderTypeModel');
const User = require('../models/userModel'); 

// <-----------------------------------------------------------> CREATE ORDER
class OrderService {
    async createOrder(orderData, orderTypeData) {
        const order = new Order(orderData);
        let orderType;

        if (order.orderType) {
            orderType = await OrderType.findById(order.orderType);
            if (!orderType) {
                return reject('OrderType not found');
            }
        } else {
            orderType = new OrderType(orderTypeData);
        }

        if (order.totalAmount >= orderType.priceThreshold) {
            orderType.type = 'delivery';
        } else {
            orderType.type = 'pickup';
        }

        await orderType.save();
        order.orderType = orderType._id;
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
            // const userToUpdate = await User.findOne({ username: username });
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
                console.log('OrderType not found for orderType ID:', orderToUpdate.orderType); // Log the problematic orderType ID
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

