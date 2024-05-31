const Order = require('../models/orderModel');
const OrderType = require('../models/orderTypeModel');
const User = require('../models/userModel'); 

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

            // PLACING THE ORDER (CALLING THE CLASS ABOVE)
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