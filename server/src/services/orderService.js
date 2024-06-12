const Order = require('../models/orderModel');
const OrderType = require('../models/orderTypeModel');
const User = require('../models/userModel'); 

// <-----------------------------------------------------------> CREATE ORDER
class OrderService {
    async createOrder(orderData, orderTypeData) {
        const order = new Order(orderData);
        const orderType = new OrderType(orderTypeData);

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

module.exports.CreateOrderService = async (username, orderData, orderTypeData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const orderService = new OrderService();

            // FIND THE USER WHO PLACES ORDER
            const userToUpdate = await User.findOne({ username: username });
            if (!userToUpdate) {
                return reject('User not found');
            }

            // PLACING THE ORDER
            const newOrder = await orderService.createOrder(orderData, orderTypeData);
            
            try {
                const updatedUser = await User.findOneAndUpdate(
                    { username: username },
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
module.exports.FindAllMyOrdersService = async (username) => {
    return new Promise(async (resolve, reject) => {
        try {
            // FIND THE USER WITH THEIR ORDERS
            const userOrders = await User.findOne({ username: username });
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
module.exports.UpdateOrdersService = async (id, orderData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatedOrder = await Order.findByIdAndUpdate(id, orderData, { new: true });
            if (!updatedOrder) {
                return reject('Order not found');
            }
            resolve(updatedOrder);
        } catch (error) {
            reject(error);
        }
    });
}
module.exports.DeleteOrderService = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedOrder = await Order.findByIdAndDelete(id);
            if (!deletedOrder) {
                return reject('Order not found');
            }
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}

